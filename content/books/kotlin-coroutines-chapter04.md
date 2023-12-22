+++ 
date = 2023-12-23T02:45:00+09:00
title = "[Kotlin Coroutines] 4장. 코루틴의 실제 구현"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## 개요

- 코루틴 동작의 중요한 점
- 중단 함수는 함수가 시작할 때와 중단 함수가 호출되었을 때 상태를 가진다는 점에서 **상태 머신(state machine)** 과 비슷함
- Continuation 객체는 상태를 나타내는 숫자와 로컬 데이터를 가지고 있음
- 함수의 컨티뉴에이션 객체가 이 함수를 부르는 다른 함수의 컨티뉴에이션 객체를 장식 (decorate) 함
  - 그 결과, 모든 컨티뉴에이션 객체는 실행을 재개하거나 재개된 함수를 완료할 때 사용되는 콜 스택으로 사용됨

## 컨티뉴에이션 전달 방식

- 코틀린은 중단 함수를 구현하는 방법으로 “컨티뉴에이션 전달 방식”을 채택

  - [Continuation-passing style](https://en.wikipedia.org/wiki/Continuation-passing_style)

- 컨티뉴에이션은 함수에서 함수로 인자를 통해 전달됨
  - 관례상 컨티뉴에이션은 마지막 파라미터로 전달됨
- 중단 함수는 실행되는 도중에 중단될 수 있으며, 이때는 선언된 타입의 값을 반환하지 않을 수 있기 때문에 nullable 로 바뀌게 된다.
  - 이때 중단 함수는 특별한 마커인 COROUTINE_SUSPENDED 를 반환한다.
  - 나중에는 이와 관련하여 유니언 타입을 도입하지 않을까…

## 아주 간단한 함수

- 간단한 함수를 하나 만들어보자.

```kotlin
suspend fun myFunction() {
    println("Before")
    delay(1000) // suspending
    println("After")
}
```

- 이 함수의 시그니처는?
  - 시그니처가 뭘까?
    - method signature 는 method 이름과 method 파라미터들을 가리킨다.
    - scope 와 access 제어자는 미포함
    - return type 도 미포함
    - https://stackoverflow.com/a/29672594
  - 이제 다시 중단함수 myFunction 의 시그니처를 추론해보자.
    ```kotlin
    fun myFunction(continuation: Continuation<*>): Any
    ```
- 이 함수는 상태를 저장하기 위해 자신만의 컨티뉴에이션 객체가 필요함
  - `MyFunctionContinuation` 이라고 하자
  - **실제로 컨티뉴에이션은 이름 없는 객체의 표현식**
- 본체가 시작될 때 MyFunction 은 파라미터인 continuation 을 자신만의 컨티뉴에이션인 `MyFunctionContinuation` 으로 포장함

```kotlin
val continuation = MyFunctionContinuation(continuation)
```

- 그런데 클래스에 포장이 없는 경우에만 클래스를 포장해야 함
  - 만약 코루틴이 재실행되고 있으면? 컨티뉴에이션 객체는 이미 래핑되어 있을 것

```kotlin
val continuation =
		if (continuation is MyFunctionContinuation) continuation
		else MyFunctionContinuation(continuation)

val continuation = continuation as? MyFunctionContinuation
		?: MyFunctionContinuation(continuation)
```

- 함수가 시작되는 지점은
  - 함수의 시작점 (함수가 처음 호출될 때) 과
  - 중단 이후 재개 시점 (컨티뉴에이션이 resume 을 호출할 때) 두 곳
- 현재 상태를 저장하려면 label 이라는 필드를 사용
  - 함수가 처음 시작될 때 이 값은 0으로 설정
  - 이후에는 중단 되기 전에 다음 상태로 설정되어 코루틴이 재개될 시점을 알려줌

```kotlin
fun myFunction(continuation: Continuation<Unit>): Any {
    val continuation = continuation as? MyFunctionContinuation
        ?: MyFunctionContinuation(continuation)

    if (continuation.label == 0) {
        println("Before")
        continuation.label = 1
        if (delay(1000, continuation) == COROUTINE_SUSPENDED){
            return COROUTINE_SUSPENDED
        }
    }
    if (continuation.label == 1) {
        println("After")
        return Unit
    }
    error("Impossible")
}
```

- delay 에 의해 중단된 경우 COROUTINE_SUSPENDED 가 반환되며, myFunction 은 COROUTINE_SUSPENDED 를 반환함
- COROUTINE_SUSPENDED는 빌더함수나 ‘재개(resume)’ 함수에 도달할 때까지 전달됨
- 중단이 일어나면 콜 스택에 있는 모든 함수가 종료되며,
  - 중단된 코루틴을 실행하던 스레드를 (다른 종류의 코루틴을 포함해) 실행 가능한 코드가 사용할 수 있게 됨
- 만약 delay 호출이 COROUTINE_SUSPENDED 를 반환하지 않는다면?
  - 만약 Unit 을 반환한다면?
    - 다음 상태로 바뀌고 다른 함수와 다름 없는 동작을 할 것
- 이제 익명 클래스로 구현된 컨티뉴에이션 객체에 대해 알아보자.
- 간단히 나타내면 아래

```kotlin
cont = object : ContinuationImpl(continuation) {
    var result: Any? = null
    var label = 0

    override fun invokeSuspend(`$result`: Any?): Any? {
        this.result = `$result`;
        return myFunction(this);
    }
};
```

- 가독성을 위해 코드를 클래스로 나타내서 정리하면 최종으로 아래 모습이 된다.

```kotlin
private fun myFunction(continuation: Continuation<Unit>): Any {
    val continuation = continuation as? MyFunctionContinuation
        ?: MyFunctionContinuation(continuation)

    if (continuation.label == 0) {
        println("Before")
        continuation.label = 1
        if (delay(1000, continuation) == COROUTINE_SUSPENDED){
            return COROUTINE_SUSPENDED
        }
    }
    if (continuation.label == 1) {
        println("After")
        return Unit
    }
    error("Impossible")
}

private class MyFunctionContinuation(
    val completion: Continuation<Unit>
) : Continuation<Unit> {
    override val context: CoroutineContext
        get() = completion.context

    var label = 0
    var result: Result<Any>? = null

    override fun resumeWith(result: Result<Unit>) {
        this.result = result
        val res = try {
            val r = myFunction(this)
            if (r == COROUTINE_SUSPENDED) return
            Result.success(r as Unit)
        } catch (e: Throwable) {
            Result.failure(e)
        }
        completion.resumeWith(res)
    }
}
```

- 이제 원래의 간단한 함수를 자바로 변환해보면 아래와 같다.

```java
public final class SimpleMyFunctionKt {
   private static final Object myFunction(Continuation var0) {
      Object $continuation;
      label20: {
         if (var0 instanceof <undefinedtype>) {
            $continuation = (<undefinedtype>)var0;
            if ((((<undefinedtype>)$continuation).label & Integer.MIN_VALUE) != 0) {
               ((<undefinedtype>)$continuation).label -= Integer.MIN_VALUE;
               break label20;
            }
         }

         $continuation = new ContinuationImpl(var0) {
            // $FF: synthetic field
            Object result;
            int label;

            @Nullable
            public final Object invokeSuspend(@NotNull Object $result) {
               this.result = $result;
               this.label |= Integer.MIN_VALUE;
               return SimpleMyFunctionKt.myFunction(this);
            }
         };
      }

      Object $result = ((<undefinedtype>)$continuation).result;
      Object var4 = IntrinsicsKt.getCOROUTINE_SUSPENDED();
      String var1;
      switch (((<undefinedtype>)$continuation).label) {
         case 0:
            ResultKt.throwOnFailure($result);
            var1 = "Before";
            System.out.println(var1);
            ((<undefinedtype>)$continuation).label = 1;
            if (DelayKt.delay(1000L, (Continuation)$continuation) == var4) {
               return var4;
            }
            break;
         case 1:
            ResultKt.throwOnFailure($result);
            break;
         default:
            throw new IllegalStateException("call to 'resume' before 'invoke' with coroutine");
      }

      var1 = "After";
      System.out.println(var1);
      return Unit.INSTANCE;
   }
}
```

- 상당히 유사한 것을 확인할 수 있다.

## 상태를 가진 함수

- 상태를 가진 간단한 함수

```kotlin
suspend fun myFunctionWithStatus() {
    println("Before")
    var counter = 0
    delay(1000) // suspending
    counter++
    println("Counter: $counter")
    println("After")
}
```

- 컨티뉴에이션 객체를 통해 이를 저장해야 함
- 지역 변수나 파라미터 같이 함수 내에서 사용되는 값들은 중단 되기 직전에 저장, 재개될 때 복구
- 중단 함수의 모습은 아래와 같다.

```kotlin
private fun myFunction(continuation: Continuation<Unit>): Any {
    val continuation = continuation as? MyFunctionContinuationWithStatus
        ?: MyFunctionContinuationWithStatus(continuation)

    var counter = continuation.counter

    if (continuation.label == 0) {
        println("Before")
        counter = 0
        continuation.counter = counter
        continuation.label = 1
        if (delay(1000, continuation) == COROUTINE_SUSPENDED){
            return COROUTINE_SUSPENDED
        }
    }
    if (continuation.label == 1) {
        counter = (counter as Int) + 1
        println("Counter: $counter")
        println("After")
        return Unit
    }
    error("Impossible")
}

private class MyFunctionContinuationWithStatus(
    val completion: Continuation<Unit>
) : Continuation<Unit> {
    override val context: CoroutineContext
        get() = completion.context

    var result: Result<Unit>? = null
    var label = 0
    var counter = 0

    override fun resumeWith(result: Result<Unit>) {
        this.result = result
        val res = try {
            val r = myFunction(this)
            if (r == COROUTINE_SUSPENDED) return
            Result.success(r as Unit)
        } catch (e: Throwable) {
            Result.failure(e)
        }
        completion.resumeWith(res)
    }
}
```

## 값을 받아 재개되는 함수

- 중단함수로부터 값을 받는 경우

```kotlin
suspend fun printUser(token: String) {
  println("Before")
  val userId = getUserId(token) // suspending
  println("Got userId: $userId")
  val userName = getUserName(userId, token) // suspending
  println(User(userId, userName))
  println("After")
}
```

- 이 때 파라미터와 반환값을 모두 컨티뉴에이션 객체에 저장되어야한다.
- 함수가 값으로 재개되었다면, 결과는 Result.Success(value) 가 되며, 이 값을 얻어서 사용 가능
- 함수가 예외로 재개되었다면, 결과는 Result.Failure(exception) 이 되며, 이때는 예외를 던짐

- note) monad 와 유사한 구조. 실제로 https://github.com/michaelbull/kotlin-result 와 같이 사용하려는 부분이 있음
  - https://discuss.kotlinlang.org/t/state-of-kotlin-result-vs-kotlin-result/21103
  - https://adambennett.dev/2020/05/the-result-monad/

```kotlin
fun printUser(
    token: String,
    continuation: Continuation<*>,
): Any {
    val continuation =
        continuation as? PrintUserContinuation
            ?: PrintUserContinuation(
                continuation as Continuation<Unit>,
                token,
            )

    var result: Result<Any>? = continuation.result
    var userId: String? = continuation.userId
    val userName: String

    if (continuation.label == 0) {
        println("Before")
        continuation.label = 1
        val res = getUserId(token, continuation)
        if (res == COROUTINE_SUSPENDED) {
            return COROUTINE_SUSPENDED
        }
        result = Result.success(res)
    }
    if (continuation.label == 1) {
        userId = result!!.getOrThrow() as String
        println("Got userId: $userId")
        continuation.label = 2
        continuation.userId = userId
        val res = getUserName(userId, continuation)
        if (res == COROUTINE_SUSPENDED) {
            return COROUTINE_SUSPENDED
        }
        result = Result.success(res)
    }
    if (continuation.label == 2) {
        userName = result!!.getOrThrow() as String
        println(User(userId as String, userName))
        println("After")
        return Unit
    }
    error("Impossible")
}

class PrintUserContinuation(
    val completion: Continuation<Unit>,
    val token: String,
) : Continuation<String> {
    override val context: CoroutineContext
        get() = completion.context

    var label = 0
    var result: Result<Any>? = null
    var userId: String? = null

    override fun resumeWith(result: Result<String>) {
        this.result = result
        val res =
            try {
                val r = printUser(token, this)
                if (r == COROUTINE_SUSPENDED) return
                Result.success(r as Unit)
            } catch (e: Throwable) {
                Result.failure(e)
            }
        completion.resumeWith(res)
    }
}
```

## 콜 스택

- 함수 a 가 함수 b 를 호출하면 가상 머신은 a 의 상태와 b 가 끝나면 실행이 될 지점을 어딘가에 저장해야 함
  - 이런 정보들을 모두 **콜 스택(call stack)**이라는 자료 구조에 저장
  - 콜 스택은 저장 공간이 제한되어 있어, 모든 공간을 다 사용하면 StackOverflowError 가 발생
  - 콜 스택?
    - [Call stack](https://en.wikipedia.org/wiki/Call_stack)
      ![1.png](/images/books/kotlin-coroutines/chapter04/1.png)
- 코루틴을 중단하면 스레드를 반환해 콜 스택에 있는 정보가 사라질 것
  - 따라서 코루틴을 재개할 때 콜 스택을 사용할 수는 없다.
  - **대신 컨티뉴에이션 객체가 콜 스택의 역할을 대신**한다.
- 컨티뉴에이션 객체는 중단이 되었을 때의 상태 (label) 와 함수의 지역 변수와 파라미터 (필드), 그리고 중단 함수를 호출할 함수가 재개될 위치 정보를 가지고 있다.
- 하나의 컨티뉴에이션 객체가 다른 하나를 참조하고, 참조된 객체가 또 다른 컨티뉴에이션 객체를 참조
  - 거대한 양파와 같다.
  - 일반적으로 콜 스택에 저장되는 정보를 모두 가지고 있다.

```kotlin
suspend fun a() {
    val user = readUser()
    b()
    b()
    b()
    println(user)
}

suspend fun b() {
    for (i in 1..10) {
        c(i)
    }
}

suspend fun c(i: Int) {
    delay(i * 100L)
    println("Tick")
}
```

- ☝️ 위 코드가 사용하는 컨티뉴에이션 객체는?

```kotlin
CContinuation(
		i = 4
		label = 1,
		completion = BContinuation(
				i = 4
				label = 1
				completion = AContinuation(
						label = 2,
						user = User@1234,
						completion = ...
				)
		)
)
```

- 이 코드에서 찍히는 Tick 의 개수는…?
  - 당장 봐서는 30개가 아닐까? → 전체적으로는 30개가 맞음, 컨티뉴에이션 객체 상황으로 봤을 때…ㅠ
  - 정답은 13개…
    - A 라벨이 2 → b 함수가 한 번 완료됨 (10번)
    - i = 4 → b 함수가 3번 출력됨
- 컨티뉴에이션 객체가 재개될 때
  - 각 컨티뉴에이션 객체는 자신이 담당하는 함수를 먼저 호출
  - 함수의 실행이 끝나면 자신을 호출한 함수의 컨티뉴에이션을 재개
  - 재개된 컨티뉴에이션 객체 또한 담당하는 함수를 호출하고, 이 과정을 스택의 끝에 다다를 때까지 반복

```kotlin
override fun resumeWith(result: Result<String>) {
    this.result = result
    val res = try {
        val r = printUser(token, this)
        if (r == COROUTINE_SUSPENDED) return
        Result.success(r as Unit)
    } catch (e: Throwable) {
        Result.failure(e)
    }
    completion.resumeWith(res)
}
```

- 함수 a → 함수 b → 함수 c 순서대로 호출하고, 함수 c 에서 중단된 상황
  - 실행이 재개되면?
    - c 의 컨티뉴에이션 객체는 c 함수를 먼저 재개
    - c 함수가 완료되면 c 컨티뉴에이션 객체는 b 함수를 호출하는 b 컨티뉴에이션 객체를 재개
    - b 함수가 완료되면 b 컨티뉴에이션 객체는 a 함수를 호출하는 a 컨티뉴에이션 객체를 재개
  - 일반적인 콜 스택
    ```mermaid
    sequenceDiagram
        Initial->>a(): 1
        a()->>b(): 2
        b()->>c(): 3
        c()->>b(): 4
        b()->>a(): 5
        a()->>Initial: 6
    ```
  - c 에서 재개되었을 때
    ```mermaid
    sequenceDiagram
        Initial->>CContinuation.resume: 1
        CContinuation.resume-->>c(): 2
        c()-->>CContinuation.resume: 3
        CContinuation.resume->>BContinuation.resume: 4
        BContinuation.resume-->>b(): 5
        b()-->>BContinuation.resume: 6
        BContinuation.resume->>AContinuation.resume: 7
        AContinuation.resume-->>a(): 8
        a()-->>AContinuation.resume: 9
        AContinuation.resume->>Done: 10
    ```
- 예외를 던질 때도 이와 비슷
  - 처리되지 못한 예외가 있으면 resumeWith 에서 잡히면 Result.failure 로 래핑됨
- 이제 코루틴이 중단되었을 때 무슨 일이 벌어지는지 이해가 됨
  - 상태는 컨티뉴에이션 객체에 상태가 저장됨
  - 중단을 처리하기 위한 과정이 있어야 함
  - 중단된 함수가 재개했을 때 컨티뉴에이션 객체로부터 상태를 복원
  - 얻은 결과를 사용하거나 예외를 던짐

```java
         continuation.setLabel(2); // <-- 다음 label 설정
         continuation.setUserId(userId); // <-- 컨티뉴에이션 객체에 상태를 저장
         res = getUserName(userId, (Continuation)continuation); // <-- 중단 함수를 호출
         if (Intrinsics.areEqual(res, COROUTINE_SUSPENDED)) { // 중단상태일 때
            return COROUTINE_SUSPENDED;
         }

         var7 = Result.Companion;
         result = Result.box-impl(Result.constructor-impl(res)); // <-- 중단되지 않았으면 결괏값을 설정
      }

      if (continuation.getLabel() == 2) {
         Intrinsics.checkNotNull(result);
         res = result.unbox-impl();
         ResultKt.throwOnFailure(res); // <-- 실패할 경우 예외를 던짐
         if (res == null) {
            throw new NullPointerException("null cannot be cast to non-null type kotlin.String");
```

## 실제 코드

- 컨티뉴에이션 객체와 중단 함수를 컴파일한 실제 코드는 최적화되어 있고, 몇 가지 처리 과정이 더 포함되어 있어 복잡함
  - 예외가 발생했을 때 더 나은 스택 트레이스 생성
  - 코루틴 중단 인터셉션
  - 사용하지 않는 변수를 제거하거나 테일콜 최적화 (tail-call optimization) 하는 등의 다양한 단계에서의 최적화
    - 테일콜?
      - 함수를 호출하여 값을 반환받은 뒤 어떠한 후처리 없이 그대로 반환하는 방식
        - [What is tail call optimization?](https://stackoverflow.com/questions/310974/what-is-tail-call-optimization)
        - [Tail call](https://en.wikipedia.org/wiki/Tail_call)
      - 테일콜 최적화한 짜여진 코드에서 테일콜로 호출하는 함수에 대한 스택을 만들지 않고, 함수가 반환한 값을 대신 사용하여 스택을 최소한으로 만드는 최적화 방식을 말한다.
- 아래는 BaseContinuationImpl 을 구현한 코드 일부분

```kotlin
internal abstract class BaseContinuationImpl(
    // This is `public val` so that it is private on JVM and cannot be modified by untrusted code, yet
    // it has a public getter (since even untrusted code is allowed to inspect its call stack).
    public val completion: Continuation<Any?>?
) : Continuation<Any?>, CoroutineStackFrame, Serializable {
    // This implementation is final. This fact is used to unroll resumeWith recursion.
    public final override fun resumeWith(result: Result<Any?>) {
        // This loop unrolls recursion in current.resumeWith(param) to make saner and shorter stack traces on resume
        var current = this
        var param = result
        while (true) {
            // Invoke "resume" debug probe on every resumed continuation, so that a debugging library infrastructure
            // can precisely track what part of suspended callstack was already resumed
            probeCoroutineResumed(current)
            with(current) {
                val completion = completion!! // fail fast when trying to resume continuation without completion
                val outcome: Result<Any?> =
                    try {
                        val outcome = invokeSuspend(param)
                        if (outcome === COROUTINE_SUSPENDED) return
                        Result.success(outcome)
                    } catch (exception: Throwable) {
                        Result.failure(exception)
                    }
                releaseIntercepted() // this state machine instance is terminating
                if (completion is BaseContinuationImpl) {
                    // unrolling recursion via loop
                    current = completion
                    param = outcome
                } else {
                    // top-level completion reached -- invoke and return
                    completion.resumeWith(outcome)
                    return
                }
            }
        }
    }
```

- 상당히 주석이 많은게 인상적…

## 중단 함수의 성능

- 일반적인 함수 대신 중단 함수를 사용하면 비용은?
  - 실제로는 비용이 크지 않음
  - 함수를 상태로 나누는 것은 숫자를 비교하는 것만큼 쉬운 일이며, 실행점이 변하는 비용 또한 거의 들지 않음
  - 컨티뉴에이션 객체에 상태를 저장하는 것 또한 간단
  - 지역 변수를 복사하지 않고 새로운 변수가 메모리 내 특정 값을 가리키게 함
  - 컨티뉴에이션 객체를 생성하는 비용도 큰 문제는 아님
- RxJava 나 콜백 함수의 성능에 대해 신경 쓰지 않는다면 중단 함수의 성능에 대해서도 걱정하지 않아도 됨

## 요약

- 코루틴의 실제 구현은 우리가 살펴본 것보다 훨씬 복잡하지만 대략 이해했으면 좋겠다.
- 중요한 점
  - 중단 함수는 상태 머신과 비슷해 함수가 시작될 때와 중단 함수를 호출한 뒤의 상태를 가진다.
  - 상태를 나타내는 값과 로컬 데이터는 컨티뉴에이션 객체에 저장됨
  - 호출된 함수의 컨티뉴에이션 객체는 호출한 함수의 컨티뉴에이션을 장식함
    - 그 결과, 모든 컨티뉴에이션 객체는 함수가 재개될 때 또는 재개된 함수가 완료될 때 사용되는 콜 스택의 역할을 함
