+++ 
date = 2024-01-06T23:30:00+09:00
title = "[Kotlin Coroutines] 6장. 코루틴 빌더"
+++

![](/images/books/kotlin-coroutines/cover.webp)

## 개요

- 중단 함수는 컨티뉴에이션 객체를 다른 중단 함수로 전달해야 함
  - 따라서 중단 함수가 일반 함수를 호출하는 것은 가능
  - 일반 함수가 중단 함수를 호출하는 것은 불가능
- 모든 중단 함수는 또 다른 중단 함수에 의해 호출되어야 함
  - 그렇게 따라가다가 보면… 최초로 시작되는 지점은 어딜까?
  - 코루틴 빌더 (coroutine builder) 가 그 역할
  - 일반 함수와 중단 가능한 세계를 연결시키는 다리
- kotlinx.coroutines 라이브러리가 제공하는 세 가지 필수적인 코루틴 빌더
  - launch
  - runBlocking
  - async

## launch 빌더

- launch 가 작동하는 방식은 thread 함수를 호출하여 새로운 스레드를 시작하는 것과 비슷
- 코루틴을 시작하면 별개로 실행됨
- 아래는 예제

```kotlin
@OptIn(DelicateCoroutinesApi::class)
fun main() {
    GlobalScope.launch {
        delay(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    GlobalScope.launch {
        delay(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    GlobalScope.launch {
        delay(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    println("Hello,")
    Thread.sleep(2000L)
}

// Hello,
// World! DefaultDispatcher-worker-1
// World! DefaultDispatcher-worker-3
// World! DefaultDispatcher-worker-2
//
// Process finished with exit code 0
```

- launch 함수는 CoroutineScope 인터페이스의 확장 함수
- CoroutineScope 인터페이스
  - 부모 코루틴과 자식 코루틴 사이의 관계를 정립하기 위한 목적으로 사용되는 구조화된 동시성의 핵심
    - 구조화된 동시성, structed concurrency
- **실제로 이런 방식은 좋다고 보기 힘듦**
  - **실제 현업에서는 GlobalScope 의 사용을 지양해야 함**
- main 함수의 마지막의 Thread.sleep 은 왜 있을까?

  - 없으면 메인 함수는 코루틴을 실행하자마자 끝나버리게 됨
  - 코루틴이 일을 할 기회조차 주지 않음

  ```kotlin
  @OptIn(DelicateCoroutinesApi::class)
  fun main() {
      GlobalScope.launch {
          delay(1000L) // <-- 스레들를 블록시키지 않고, 코루틴을 중단시킴
          println("World! ${Thread.currentThread().name}")
      }
      GlobalScope.launch {
          delay(1000L)
          println("World! ${Thread.currentThread().name}")
      }
      GlobalScope.launch {
          delay(1000L)
          println("World! ${Thread.currentThread().name}")
      }
      println("Hello,")
  //    Thread.sleep(2000L) // <-- sleep 이 없어서 바로 종료됨
  }

  // Hello,
  //
  // Process finished with exit code 0
  ```

  - 스레드가 블로킹되지 않으면 할 일이 없어져 그대로 종료됨

- launch 가 작동하는 방식은 데몬 스레드와 어느 정도 비슷하지만 훨씬 가벼움
- 이런 비교 방식은 처음엔 유용할 수 있지만 나중엔 문제가 될 수 있음

```kotlin
fun main() {
    thread(isDaemon = true) {
        Thread.sleep(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    thread(isDaemon = true) {
        Thread.sleep(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    thread(isDaemon = true) {
        Thread.sleep(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    println("Hello,")
    Thread.sleep(2000L)
}

// Hello,
// World! Thread-0
// World! Thread-2
// World! Thread-1
//
// Process finished with exit code 0
```

## runBlocking 빌더

- 코루틴이 스레드를 블로킹하지 않고 작업을 중단시키기만 하는 것이 일반적인 법칙
- 하지만 블로킹이 필요한 경우에는?
  - 이럴 때 runBlocking 을 사용하면 됨
- runBlocking 은 아주 특이한 코루틴 빌더
  - 코루틴이 중단되었을 경우 runBlocking 빌더는 중단 메인 함수와 마찬가지로 시작한 스레드를 중단시킨다.
    - 정확히는 새로운 코루틴을 실행한 뒤 완료될 때까지 현재 스레드를 중단 가능한 상태로 블로킹
  - 따라서 runBlocking 내부에서 delay 를 호출하면 Thread.sleep 과 비슷하게 작동

```kotlin
fun main() {
    runBlocking {
        delay(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    runBlocking {
        delay(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    runBlocking {
        delay(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    println("Hello,")
}

// World! main
// World! main
// World! main
// Hello,
//
// Process finished with exit code 0
```

```kotlin
fun main() {
    Thread.sleep(1000L)
    println("World!")
    Thread.sleep(1000L)
    println("World!")
    Thread.sleep(1000L)
    println("World!")
    println("Hello,")
}

// World!
// World!
// World!
// Hello,
//
// Process finished with exit code 0
```

- runBlocking 이 사용되는 특수한 경우는 실제로 두 가지
  - 프로그램이 끝나는 걸 방지하기 위해 스레드를 블로킹할 필요가 있는 메인 함수
  - 같은 이유로 스레드를 블로킹할 필요가 있는 유닛 테스트
- Thread.sleep 을 runBlocking 안에서 delay 사용하는 방식으로 대체 가능
  - 이 방식이 더 유용함

```kotlin
fun main() =
    runBlocking {
        GlobalScope.launch {
            delay(1000L)
            println("World! ${Thread.currentThread().name}")
        }
        GlobalScope.launch {
            delay(1000L)
            println("World! ${Thread.currentThread().name}")
        }
        GlobalScope.launch {
            delay(1000L)
            println("World! ${Thread.currentThread().name}")
        }
        println("Hello,")
        delay(2000L) // still needed
    }

// Hello,
// World! DefaultDispatcher-worker-2
// World! DefaultDispatcher-worker-1
// World! DefaultDispatcher-worker-3
//
// Process finished with exit code 0
```

- 현재는 runBlocking 을 코루틴 빌더로 거의 사용되지 않음
  - 유닛 테스트에서는 코루틴을 가상 시간으로 실행시키는 runTest 가 주로 사용됨
  - 메인 함수는 runBlocking 대신에 suspend 를 붙여 중단 함수로 만드는 방법을 주로 사용

```kotlin
@OptIn(DelicateCoroutinesApi::class)
suspend fun main() {
    GlobalScope.launch {
        delay(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    GlobalScope.launch {
        delay(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    GlobalScope.launch {
        delay(1000L)
        println("World! ${Thread.currentThread().name}")
    }
    println("Hello,")
    delay(2000L)
}

// Hello,
// World! DefaultDispatcher-worker-2
// World! DefaultDispatcher-worker-1
// World! DefaultDispatcher-worker-3
//
// Process finished with exit code 0
```

## async 빌더

- async 코루틴 빌더는 launch 와 비슷
  - 하지만 값을 생성하도록 설계되어 있음
  - 이 값은 람다 표현식에 의해 반환되어야 함
    - 좀 더 정확히는 마지막에 위치한 함수형의 인자에 의해 반환됨
- async 함수의 리턴 타입 객체
  - `Deferred<T>` 타입
    - `T`는 생성되는 값의 타입
    - `Deferred` 에는 작업이 끝나면 값을 반환하는 중단 메서드인 `await` 가 있음

```kotlin
@OptIn(DelicateCoroutinesApi::class)
fun main() =
    runBlocking {
        val resultDeferred: Deferred<Int> =
            GlobalScope.async {
                delay(1000L)
                42
            }
        // do other stuff...
        val result: Int = resultDeferred.await() // (1 sec)
        println(result) // 42
        // or just
        println(resultDeferred.await()) // 42
    }
```

```kotlin
public fun <T> CoroutineScope.async(
    context: CoroutineContext = EmptyCoroutineContext,
    start: CoroutineStart = CoroutineStart.DEFAULT,
    block: suspend CoroutineScope.() -> T
): Deferred<T> {
    val newContext = newCoroutineContext(context)
    val coroutine = if (start.isLazy)
        LazyDeferredCoroutine(newContext, block) else
        DeferredCoroutine<T>(newContext, active = true)
    coroutine.start(start, coroutine, block)
    return coroutine
}
```

- 호출되자마자 코루틴을 즉시 시작
  - 따라서 몇 개의 작업을 한 번에 시작하고 모든 결과를 한꺼번에 기다릴 때 사용함
- 반환된 Deferred는 값이 생성되면 해당 값을 내부에 저장하기 때문에 await 에서 값이 반환되는 즉시 값을 사용할 수 있다.
  - 하지만 값이 생성되기 전에 await 를 호출하면 값이 나올 때까지 기다리게 됨

```kotlin
@OptIn(DelicateCoroutinesApi::class)
fun main() =
    runBlocking {
        val res1 =
            GlobalScope.async {
                delay(1000L)
                "Text 1"
            }
        val res2 =
            GlobalScope.async {
                delay(3000L)
                "Text 2"
            }
        val res3 =
            GlobalScope.async {
                delay(2000L)
                "Text 3"
            }
        println(res1.await())
        println(res2.await())
        println(res3.await())
    }
```

- launch 와 작동하는 방식이 비슷하지만 값을 반환한다는 것이 추가적인 특징
- **launch 는 값이 필요하지 않을 때, async 는 값을 생성될 때 꼭 사용하자**
- async 빌더는 두 가지 다른 곳에서 데이터를 얻어와 합치는 경우처럼, 두 작업을 병렬로 실행할 때 주로 사용됨

## 구조화된 동시성

- 코루틴이 `GlobalScope` 에서 시작되었다면 프로그램은 해당 코루틴을 기다리지 않음…
  - 아까도 말했듯이, 코루틴은 어떤 스레드도 블록하지 않기 때문에 프로그램이 끝나는 걸 막을 방법이 없음
- 처음에 `GlobalScope` 가 필요한 이유는 뭘까?
  - 그 이유는 `launch` 와 `async` 가 `CoroutineScope` 의 확장 함수이기 때문
- `launch` 와 `async` 그리고 `runBlocking` 의 정의를 살펴보면 `block` 파라미터가 리시버 타입이 `CoroutineScope` 인 함수형 타입이라는 것을 알 수 있음

```kotlin
public fun CoroutineScope.launch(
    context: CoroutineContext = EmptyCoroutineContext,
    start: CoroutineStart = CoroutineStart.DEFAULT,
    block: suspend CoroutineScope.() -> Unit
): Job {
    val newContext = newCoroutineContext(context)
    val coroutine = if (start.isLazy)
        LazyStandaloneCoroutine(newContext, block) else
        StandaloneCoroutine(newContext, active = true)
    coroutine.start(start, coroutine, block)
    return coroutine
}
```

```kotlin
public fun <T> CoroutineScope.async(
    context: CoroutineContext = EmptyCoroutineContext,
    start: CoroutineStart = CoroutineStart.DEFAULT,
    block: suspend CoroutineScope.() -> T
): Deferred<T> {
    val newContext = newCoroutineContext(context)
    val coroutine = if (start.isLazy)
        LazyDeferredCoroutine(newContext, block) else
        DeferredCoroutine<T>(newContext, active = true)
    coroutine.start(start, coroutine, block)
    return coroutine
}
```

```kotlin
@Throws(InterruptedException::class)
public actual fun <T> runBlocking(context: CoroutineContext, block: suspend CoroutineScope.() -> T): T {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    val currentThread = Thread.currentThread()
    val contextInterceptor = context[ContinuationInterceptor]
    val eventLoop: EventLoop?
    val newContext: CoroutineContext
    if (contextInterceptor == null) {
        // create or use private event loop if no dispatcher is specified
        eventLoop = ThreadLocalEventLoop.eventLoop
        newContext = GlobalScope.newCoroutineContext(context + eventLoop)
    } else {
        // See if context's interceptor is an event loop that we shall use (to support TestContext)
        // or take an existing thread-local event loop if present to avoid blocking it (but don't create one)
        eventLoop = (contextInterceptor as? EventLoop)?.takeIf { it.shouldBeProcessedFromContext() }
            ?: ThreadLocalEventLoop.currentOrNull()
        newContext = GlobalScope.newCoroutineContext(context)
    }
    val coroutine = BlockingCoroutine<T>(newContext, currentThread, eventLoop)
    coroutine.start(CoroutineStart.DEFAULT, coroutine, block)
    return coroutine.joinBlocking()
}
```

- 즉, `GlobalScope` 를 굳이 사용하지 않고 `runBlocking` 이 제공하는 리시버를 통해 `launch` 를 호출해도 됨
  - 이렇게 하면 `launch` 는 `runBlocking` 의 자식이 됨
  - 부모는 자식을 모두 기다리므로, `runBlocking` 은 모든 자식이 작업을 끝마칠 때까지 중단됨
- 부모는 자식들을 위한 스코프를 제공
- 자식들은 해당 스코프 내에서 호출
- 이를 통해 **구조화된 동시성**이라는 관계가 성립
- 부모-자식 관계의 가장 중요한 특징
  - 자식은 부모로부터 컨텍스트를 상속 받음
    - 하지만 자식이 이를 재정의할 수 도 있음
  - 부모는 모든 자식이 작업을 마칠 때까지 기다림
  - 부모 코루틴이 취소되면 자식 코루틴도 취소됨
  - 자식 코루틴에서 에러가 발생하면, 부모 코루틴 또한 에러로 소멸
- `runBlocking` 은 `CoroutineScope` 의 확장 함수가 아님
  - `runBlocking` 은 자식이 될 수 없으며, 루트 코루틴으로만 사용될 수 있다는 것을 의미
    - 계층상 모든 자식의 부모
  - 따라서 쓰임새가 다른 코루틴과 다름

## 현업에서의 코루틴 사용

- 중단 함수는 다른 중단 함수들로부터 호출되어야 함
- 모든 중단 함수는 코루틴 빌더로 시작되어야 함
- runBlocking 을 제외한 모든 코루틴 빌더는 CoroutineScope 에서 시작되어야 함
- 좀 더 큰 애플리케이션에서는 스코프를 직접 만들거나 프레임워크에서 제공하는 스코프를 사용
- 첫 번째 빌더가 스코프에서 시작되면 다른 빌더가 첫 번째 빌더의 스코프에서 시작될 수 있음
- 이것이 애플리케이션이 구조화되는 과정의 본질
- 한 가지 문제
  - 중단 함수에선 스코프를 어떻게 처리할까?
  - 중단 함수 내부에서 중단될 수 있지만, 함수 내에는 스코프가 없음
  - 스코프를 인자로 넘기는 건 좋은 방법이 아님
  - 대신 코루틴 빌더가 사용할 스코프를 만들어 주는 중단 함수인 coroutineScope 함수를 사용하는 것이 바람직함

## coroutineScope 사용하기

- async 를 호출하려면 스코프가 필요하지만, 함수에 스코프를 넘기고 싶지 않을 때 중단 함수 밖에서 스코프를 만들려면, coroutineScope 함수를 사용하면 됨
- coroutineScope 는 람다 표현식이 필요로 하는 스코프를 만들어 주는 중단 함수
  - 람다식이 반환하는 것이면 무엇이든 반환함
- coroutineScope 는 중단 함수 내에서 스코프가 필요할 때 일반적으로 사용하는 함수
  - 이러한 특징은 정말 중요
- 중단 함수를 coroutineScope 와 함께 시작하는 것도 가능
  - 이는 메인 함수와 runBlocking 을 사용하는 것보다 세련된 방법

![kotlin_coroutines_library_elements.svg](/images/books/kotlin-coroutines/chapter06/kotlin_coroutines_library_elements.svg)

## 요약

- 대부분의 경우 다른 중단 함수나 일반 함수를 호출하는 중단 함수만을 사용
- 동시성 처리를 하기 위해서는 함수를 coroutineScope 로 래핑한 다음,
  - 스코프 내에서 빌더를 사용해야 함
- **모든 것은 스코프 내에서 빌더를 호출함으로써 시작됨**
- 대부분의 프로젝트에서는 스코프가 한 번 정의되면 건드릴 일은 별로 없음
