+++ 
date = 2024-01-19T23:00:00+09:00
title = "[Kotlin Coroutines] 11장. 코루틴 스코프 함수"
+++

![](/images/books/kotlin-coroutines/cover.webp)

## 코루틴 스코프 함수가 소개되기 전에 사용한 방법들

- 중단 함수에서 중단 함수를 호출하는 것이 첫 번째 방법
  - 문제는 작업이 동시에 진행되지 않는다는 점
  - 두 개의 중단 함수를 동시에 실행하려면 각각 async 로 래핑해야 함
    - 하지만 async 는 스코프를 필요로 함
    - GlobalScope 를 사용하는 건 좋은 방법이 아님
      - GlobalScope 는 그저 EmptyCoroutineContext 를 가진 스코프일 뿐
        ```kotlin
        public object GlobalScope : CoroutineScope {
            /**
             * Returns [EmptyCoroutineContext].
             */
            override val coroutineContext: CoroutineContext
                get() = EmptyCoroutineContext
        }
        ```
      - GlobalScope 에서 async 를 호출하면 부모 코루틴과 아무런 관계가 없음
      - 이 때 async 코루틴은
        - 취소될 수 없다.
          - 부모가 취소되어도 async 내부의 함수가 실행 중인 상태가 되므로 작업이 끝날 때까지 자원이 낭비됨
        - 부모로부터 스코프를 상속받지 않음
          - 항상 기본 디스패처에서 실행됨
          - 부모의 컨텍스트를 전혀 신경쓰지 않음
  - 가장 중요한 결과는 다음과 같다
    - **메모리 누수가 발생할 수 있으며 쓸데없이 CPU 를 낭비함**
    - **코루틴을 단위 테스트하는 도구가 작동하지 않아 함수를 테스트하기 아주 어려움**
  - 따라서 위와 같은 방법은 전혀 좋다고 볼 수 없음
- 스코프를 인자로 넘기는 다음 방법

  ```kotlin
  suspend fun getUserProfile(
  	scope: CoroutineScope
  ): UserProfileData {
  	...
  }

  // 또는

  suspend fun CoroutineScope.getUserProfile(): UserProfileData {
  	...
  }
  ```

  - 일단 절대 위와 같이 구현하면 안됨
  - 이 방법은 취소가 가능하고 적절한 단위 테스트를 추가할 수 있다는 점에서 좀 더 나은 방식
  - **문제는 스코프가 함수에서 함수로 전달되어야 한다는 점**
    - 스코프가 함수로 전달되면 스코프에서 예상하지 못한 부작용이 발생할 수 있음
      - async 에서 예외가 발생하면 모든 스코프가 닫히게 됨 (SupervisorJob 이 아니라고 가정)
      - 또한 스코프에서 접근하는 함수가 cancel 메서드를 사용해 스코프를 취소하는 등 스코프를 조작할 수도 있음
  - **이러한 접근 방식은 다루기도 어렵고 잠재적으로 위험함**

- 예외가 발생하면 종료하는 대신, 예외를 그대로 던지는 함수가 더 나음
  - 여기서 coroutineScope 가 등장

## coroutineScope

- coroutineScope 는 스코프를 시작하는 중단 함수
  - 인자로 들어온 함수가 생성한 값을 반환함

```kotlin
public suspend fun <R> coroutineScope(block: suspend CoroutineScope.() -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return suspendCoroutineUninterceptedOrReturn { uCont ->
        val coroutine = ScopeCoroutine(uCont.context, uCont)
        coroutine.startUndispatchedOrReturn(coroutine, block)
    }
}
```

- async 나 launch 와는 다르게 coroutineScope 의 본체는 리시버 없이 곧바로 호출됨
- coroutineScope 함수는
  - 새로운 코루틴을 생성하지만,
  - 새로운 코루틴이 끝날 때까지 coroutineScope 를 호출한 코루틴을 중단하기 때문에
  - 호출한 코루틴이 작업을 동시에 시작하지는 않음

```kotlin
fun main() =
    runBlocking {
        val a =
            coroutineScope {
                delay(1000)
                10
            }
        println("a is calculated")
        val b =
            coroutineScope {
                delay(1000)
                20
            }
        println(a) // 10
        println(b) // 20
    }

// (1초 후)
// a is calculated
// (1초 후)
// 10
// 20
```

- ☝️ 두 delay 호출 모두 runBlocking 을 중단시킴
- 생성된 스코프는 바깥의 스코프에서 coroutineContext 를 상속받지만 컨텍스트의 Job 을 오버라이딩함
  - **따라서 생성된 스코프는 부모가 해야 할 책임을 이어 받음**
    - 부모로부터 컨텍스트를 상속받음
    - 자신의 작업을 끝내기 전까지 모든 자식을 기다림
    - 부모가 취소되면 자식들 모두를 취소함
- 아래 예에서 coroutineScope 는 모든 자식이 끝날 때까지 종료되지 않는 것을 확인 가능
- 또한 CoroutineName 이 부모에서 자식으로 전달되는 것도 확인 가능

```kotlin
private suspend fun longTask() =
    coroutineScope {
        launch {
            delay(1000)
            val name = coroutineContext[CoroutineName]?.name
            println("[$name] Finished task 1")
        }
        launch {
            delay(2000)
            val name = coroutineContext[CoroutineName]?.name
            println("[$name] Finished task 2")
        }
    }

fun main() =
    runBlocking(CoroutineName("Parent")) {
        println("Before")
        longTask()
        println("After")
    }

// Before
// (1 sec)
// [Parent] Finished task 1
// (1 sec)
// [Parent] Finished task 2
// After
```

- 아래 코드는 취소가 어떻게 동작하는 지 확인 가능
  - 부모가 취소되면 아직 끝나지 않은 자식 코루틴이 모두 취소됨

```kotlin
private suspend fun longTask() =
    coroutineScope {
        launch {
            delay(1000)
            val name = coroutineContext[CoroutineName]?.name
            println("[$name] Finished task 1")
        }
        launch {
            delay(2000)
            val name = coroutineContext[CoroutineName]?.name
            println("[$name] Finished task 2")
        }
    }

fun main(): Unit =
    runBlocking {
        val job =
            launch(CoroutineName("Parent")) {
                longTask()
            }
        delay(1500)
        job.cancel()
    }

// [Parent] Finished task 1

// Process finished with exit code 0
```

- 코루틴 빌더와 달리 coroutineScope 나 스코프에 속한 자식에서 예외가 발생하면
  - 다른 모든 자식이 취소되고
  - 예외가 다시 던져짐
- 중단 함수에서 병렬로 작업을 수행할 경우
  - coroutineScope 를 사용하는 것이 좋다
- coroutineScope 은 중단 메인 함수 본체를 래핑할 때 주로 사용됨
- coroutineScope 함수는 기존의 중단 컨텍스트에서 벗어난 새로운 스코프를 만듦
- 부모로부터 스코프를 상속받고 구조화된 동시성을 지원함
- 다음 함수들은 첫 번째 함수가 getProfile 과 getFriends 를 연속으로 호출하고, 두 번째 함수는 함수를 병렬로 호출하는 것을 제외하면 사용하는 것에 있어 아무런 차이가 없음

  ```kotlin
  suspend fun productCurrentUserSeq(): User {
  		val profile = repo.getProfile()
  		val friends = repo.getFriends()
  		return User(profile, friends)
  }

  suspend fun productCurrentUserSeq(): User = coroutineScope {
  		val profile = async { repo.getProfile() }
  		val friends = async { repo.getFriends() }
  		User(profile.await(), friends.await())
  }
  ```

## 코루틴 스코프 (중단) 함수

- supervisorScope
  - coroutineScope 와 비슷
  - Job 대신 SupervisorJob 을 사용
- withContext
  - 코루틴 컨텍스트를 바꿀 수 있는 coroutineScope
- withTimeout
  - 타임아웃이 있는 coroutineScope
- 위 함수들을 묶어서 우리는 “코루틴 스코프 함수” 라고 부르자

| 코루틴 빌더
(runBlocking 제외) | 코루틴 스코프 함수 |
| --- | --- |
| launch, async, produce | coroutineScope, supervisorScope, withContext, withTimeout |
| CoroutineScope 의 확장 함수 | 중단 함수 |
| CoroutineScope 리시버의 코루틴 컨텍스트를 사용 | 중단 함수의 컨티뉴에이션 객체가 가진 코루틴 컨텍스트를 사용 |
| 예외는 Job 을 통해 부모로 전파됨 | 일반 함수와 같은 방식으로 예외를 던짐 |
| 비동기인 코루틴을 시작함 | 호출된 지점에서 코루틴을 시작함<br/>(Starts a coroutine that is called in-place.) |

- runBlocking 을 한 번 보자
  - 코루틴 빌더 보다 코루틴 스코프 함수와 비슷한 점이 많아 보임
  - runBlocking 또한 함수 본체를 곧바로 호출하고 그 결과를 반환함
  - 가장 큰 차이점은 runBlocking 은 블로킹 함수지만, 코루틴 스코프 함수는 중단 함수라는 점
    - 따라서 runBlocking 은 코루틴의 계층에서 가장 상위에 있으며, 코루틴 스코프 함수는 계층 중간에 있는 것

## withContext

- 코루틴 컨텍스트를 바꿀 수 있는 coroutineScope
- withContext 의 인자로 컨텍스트를 제공하면, 부모 스코프의 컨텍스트를 대체
  - withContext(EmptyCoroutineContext) == coroutineScope()

```kotlin
private fun CoroutineScope.log(text: String) {
    val name = this.coroutineContext[CoroutineName]?.name
    println("[$name] $text")
}

fun main() =
    runBlocking(CoroutineName("Parent")) {
        log("Before")

        withContext(CoroutineName("Child 1")) {
            delay(1000)
            log("Hello 1")
        }

        withContext(CoroutineName("Child 2")) {
            delay(1000)
            log("Hello 2")
        }

        log("After")
    }

// [Parent] Before
// (1 sec)
// [Child 1] Hello 1
// (1 sec)
// [Child 2] Hello 2
// [Parent] After
```

- withContext 는 기존 스코프와 컨텍스트가 다른 코루틴 스코프를 설정하기 위해 주로 사용됨
- 디스패처와 함께 종종 사용되곤 함

## supervisorScope

- Job 대신 SupervisorJob 을 사용하는 coroutineScope
  - 자식 코루틴이 예외를 던지더라도 취소되지 않음
- 호출한 스코프로부터 상속받은 CoroutineScope 를 만들고 지정된 중단 함수를 호출한다는 점에서 coroutineScope 와 비슷

```kotlin
fun main() =
    runBlocking {
        println("Before")

        supervisorScope {
            launch {
                delay(1000)
                throw Error()
            }

            launch {
                delay(2000)
                println("Done")
            }
        }

        println("After")
    }

// Before
// (1 sec)
// Exception...
// (1 sec)
// Done
// After
```

- supervisorScope 는 서로 독립적인 작업을 시작하는 함수에서 주로 사용됨
  - async 를 사용한다면 예외가 부모로 전파되는 걸 막는 것 외에 추가적인 예외 처리가 필요함
  - await 를 호출하고 async 코루틴이 예외로 끝나게 된다면 await 는 예외를 다시 던지게 됨
  - 따라서 async 에서 발생하는 에러를 전부 처리하려면 try-catch 블록으로 await 호출을 래핑해야 함
- 그러면 withContext(SupervisorJob()) 을 사용하면 supervisorScope 대신 사용할 수 있을까?
  - 대답은 “그렇게 할 수 없다”
  - withContext(SupervisorJob()) 을 사용하면 withContext 는 여전히 기존에 가지고 있던 Job 을 사용하며, SupervisorJob() 이 해당 잡의 부모가 됨
  - 따라서 하나의 자식 코루틴이 예외를 던진다면, 다른 자식들 또한 취소가 됨
  - withContext 또한 예외를 던지기 때문에 SupervisorJob()은 사실상 쓸모가 없게 됨
  - 따라서 withContext(SupervisorJob()) 은 의미가 없고, 잘못 사용될 소지가 있기 때문에 사용할 필요가 없음

```kotlin
fun main() =
    runBlocking {
        println("Before")

        withContext(SupervisorJob()) {
            launch {
                delay(1000)
                throw Error()
            }

            launch {
                delay(2000)
                println("Done")
            }
        }

        println("After")
    }

// Before
// (1 sec)
// Exception...
```

## withTimeout

- 타임아웃이 있는 coroutineScope
- withTimeout 에 아주 큰 타임아웃 값을 넣어주면 coroutineScope 와 다를 것이 없음
- withTimeout 은 인자로 들어온 람다식을 실행할 때 시간 제한이 있다는 점이 다름
  - 실행하는 데 시간이 너무 오래 걸리면 람다식은 취소되고, TimeoutCancellationException 을 던짐
    - CancellationException 의 서브타입

```kotlin
private suspend fun test(): Int =
    withTimeout(Duration.ofMillis(1500)) {
        delay(Duration.ofMillis(1000))
        println("Still thinking")
        delay(Duration.ofMillis(1000))
        println("Done!")
        42
    }

suspend fun main(): Unit =
    coroutineScope {
        try {
            test()
        } catch (e: TimeoutCancellationException) {
            println("Cancelled")
        }
        delay(Duration.ofMillis(1000)) // Extra timeout does not help,
        // `test` body was cancelled
    }

// (1 sec)
// Still thinking
// (0.5 sec)
// Cancelled
```

- 테스트할 때 특히 유용
  - runTest 내부에서 사용됨
- withTimeout 이 CancellationException 의 서브타입인 TimeoutCancellationException 을 던진다는 걸 알아야 함

  - 코루틴 빌더 내부에서 TimeoutCancellationException 을 던지면 해당 코루틴만 취소되고 부모에게는 영향을 주지 않음

  ```kotlin
  suspend fun main(): Unit =
      coroutineScope {
          launch { // 1
              launch { // 2, cancelled by its parent
                  delay(2000)
                  println("Will not be printed")
              }
              withTimeout(1000) { // we cancel launch
                  delay(1500) // throw TimeoutCancellationException
              }
          }
          launch { // 3
              delay(2000)
              println("Done")
          }
      }

  // (2 sec)
  // Done
  ```

- withTimeoutOrNull 은 예외를 던지지 않음
  - 타임아웃을 초과하면 람다식이 취소되고 null 이 반환
  - 래핑 함수에서 걸리는 시간이 너무 길 때 무언가 잘못되었음을 알리는 용도
    - 응답을 5초 이상 기다리는 네트워크 연산 예
      - 이럴 때는 응답을 받지 못하는 경우가 대부분

## 코루틴 스코프 함수 연결하기

- 서로 다른 코루틴 스코프 함수의 두 가지 기능이 모두 필요하다면?
  - 코루틴 스코프에서 다른 기능을 가지는 코루틴 스코프 함수를 호출해야 함

## 추가적인 연산

- 작업을 수행하는 도중에 추가적인 연산을 수행하는 경우
- 예를 들면 사용자 프로필을 보여준 다음, 분석을 위한 목적으로 요청을 보내고 싶다면?
- 동일한 스코프에서 launch 를 호출하는 방법이 자주 사용됨
- 하지만 이 방식은 몇 가지 문제가 있음
  - coroutineScope 가 사용자 데이터를 보여 준 뒤 launch 로 시작된 코루틴이 끝나기를 기다려야 하므로 launch 에서 함수의 목적과 유의미한 작업을 한다고 보기는 어려움
  - 분석을 위한 호출이 실패했다고 해서, 전체 과정이 취소가 되는건 말이 안됨
- 그러면 어떻게 해야할까?
- 핵심 동작에 영향을 주지 않는 추가적인 연산이 있을 경우, **또 다른 스코프에서 시작하는 편이 나음**
- 쉬운 방법은 추가적인 연산을 위한 스코프를 만드는 것
- 주입된 스코프에서 추가적인 연산을 시작하는 건 자주 사용되는 방법
- 스코프를 전달하면 전달된 클래스를 통해 독립적인 작업을 실행한다는 것을 명확하게 알 수 있음
- 따라서 중단 함수는 주입된 스코프에서 시작한 연산이 끝날 때까지 기다리지 않음
- 스코프가 전달되지 않으면 중단 함수는 모든 연산이 완료될 때까지 종료되지 않을 거라는 걸 예상할 수 있음

## 요약

- 코루틴 스코프 함수는 모든 중단 함수에서 사용될 수 있으므로 아주 유용함
- 코루틴 스코프 함수는 람다식 전체를 래핑할 때 주로 사용됨
