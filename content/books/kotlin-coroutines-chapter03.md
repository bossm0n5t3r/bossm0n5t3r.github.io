+++ 
date = 2023-12-23T02:40:00+09:00
title = "[Kotlin Coroutines] 3장. 중단은 어떻게 작동할까?"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## 개요

- 중단 함수는 코틀린 코루틴의 핵심
- 중단이 가능하다는 것 = 코틀린 코루틴의 다른 모든 개념의 기초가 되는 필수적인 요소
- 이번 장의 목표
  - **중단이 어떻게 작동하는지 확실하게 이해**
- 코루틴을 중단하는 것
  - 실행을 중간에 멈추는 것
  - 코루틴은 중단되었을 때 Continutation 객체를 반환
  - Continuation 객체를 이용하면 멈췄던 곳에서 다시 코루틴을 실행할 수 있음
- 여기가 쓰레드와의 차이점
  - 쓰레드: 저장이 불가능, 멈추는 것만 가능
- 중단했을 때 코루틴은 어떤 자원도 사용하지 않음
  - 코루틴은 다른 스레드에서 시작할 수 있고,
  - Continuation 객체는 (이론상) 직렬화와 역직렬화가 가능하며 다시 실행될 수 있음

## 재개

```kotlin
@SinceKotlin("1.3")
public interface Continuation<in T> {
    /**
     * The context of the coroutine that corresponds to this continuation.
     */
    public val context: CoroutineContext

    /**
     * Resumes the execution of the corresponding coroutine passing a successful or failed [result] as the
     * return value of the last suspension point.
     */
    public fun resumeWith(result: Result<T>)
}
```

- 중단 함수는 말 그대로 코루틴을 중단할 수 있는 함수
- 이는 중단 함수가 반드시 코루틴 (또는 다른 중단 함수) 에 의해 호출되어야 함을 의미
- **즉, 중단 함수는 중단할 수 있는 곳이 필요**

```kotlin
suspend fun main() { // <- suspend 가 붙은 main
    println("Before")

    suspendCoroutine { continuation -> // <- 여기서 중단!
        println("Before too")
        continuation.resume(Unit) // <- 중단 이후 바로 재개
    }

    println("After") // <- resume 을 호출 했기 때문에 출력 가능
}
```

```kotlin
suspend fun main() { // <- suspend 가 붙은 main
    println("Before")

    suspendCoroutine { continuation -> // <- 여기서 중단!
        thread {
            println("Suspended")
            Thread.sleep(1000)
            continuation.resume(Unit)
            println("Resumed") // <- resume 이후 바로 실행이 되지는 않음, After 이후 출력
        }
    }

    println("After") // <- 1초 후 바로 출력
}
```

- 정해진 시간 후에 재개하는 방법?

  - 스레드를 이용하는 방법

    ```kotlin
    private fun continueAfterSecond(continuation: Continuation<Unit>) {
        thread {
            Thread.sleep(1000)
            continuation.resume(Unit)
        }
    }

    suspend fun main() {
        println("Before")

        suspendCoroutine { continuation ->
            continueAfterSecond(continuation)
        }

        println("After")
    }
    ```

    - 굳이 스레드를 생성하는 비용을 감내해야 할까?

  - ScheduledExecutorService 를 사용하는 방법

    ```kotlin
    private val executor =
        Executors.newSingleThreadScheduledExecutor {
            Thread(it, "scheduler").apply { isDaemon = true }
        }

    // 코틀린 코루틴 라이브러리에서 delay 가 구현된 방식과 정확히 일치
    private suspend fun delay(timeMillis: Long): Unit =
        suspendCoroutine { cont ->
            executor.schedule({
                cont.resume(Unit)
            }, timeMillis, TimeUnit.MILLISECONDS)
        }

    suspend fun main() {
        println("Before")

        delay(1000)

        println("After")
    }
    ```

## 값으로 재개하기

- 왜 resume 함수에 Unit 을 인자로 넣을까?
- 왜 suspendCoroutine 의 타입 인자로 Unit 을 사용하는 걸까?
- 우연이 아님

  - Continuation 의 제네릭 타입 인자이기 때문, 둘은 같은 타입이어야 함

  ```kotlin
  suspend fun main() {
      val i: Int =
          suspendCoroutine { cont ->
              cont.resume(42)
          }
      println(i) // 42

      val str: String =
          suspendCoroutine { cont ->
              cont.resume("Some text")
          }
      println(str) // Some text

      val b: Boolean =
          suspendCoroutine { cont ->
              cont.resume(true)
          }
      println(b) // true
  }
  ```

- 코루틴에서는 값으로 재개하는 것이 자연스럽다.

  - API 를 호출해 네트워크 응답을 기다리는 등등

  ```kotlin
  private fun requestUser(callback: (User) -> Unit) {
      thread {
          Thread.sleep(1000)
          callback.invoke(User("Test"))
      }
  }

  // sampleStart
  suspend fun main() {
      println("Before")

      val user =
          suspendCoroutine { cont ->
              requestUser { user ->
                  cont.resume(user)
              }
          }

      println(user)
      println("After")
  }
  ```

- 중단 함수는 Retrofit 과 Room 같은 널리 사용되는 라이브러리에 의해 이미 지원되고 있음
- 그렇기 때문에 중단 함수 내에서 콜백 함수를 사용하는 일은 거의 없음
  - 만약 필요하다면?
  - suspendCancellableCoroutine 을 사용하는 것이 좋음
- 만약 API 에서 장애가 발생하면?
  - **데이터를 반환할 수 없으므로, 코루틴이 중단된 곳에서 예외를 발생시켜야 함**
  - 예외로 재개하는 방법이 필요할 때가 바로 이런 경우

## 예외로 재개하기

- resumeWithException 이 호출되면 중단된 지점에서 인자로 넣어준 예외를 던짐

```kotlin
private class MyException : Throwable("Just an exception")

suspend fun main() {
    try {
        suspendCoroutine<Unit> { cont ->
            cont.resumeWithException(MyException())
        }
    } catch (e: MyException) {
        println("Caught!")
    }
}
```

- 예를 들어 네트워크 관련 예외를 알릴 때 사용 가능

## 함수가 아닌 코루틴을 중단시킨다

- 강조 하고 싶은 것! **함수가 아닌 코루틴을 중단시킨다는 것!**
- 변수에 컨티뉴에이션 객체를 저장하고 함수를 호출한다음에 재개하는 상황은 의도대로 흘러가지 않는다.
  - 따라서 다른 스레드나 다른 코루틴으로 재개하지 않으면 프로그램이 실행된 상태로 유지된다.

## 요약

- 이제 사용자 관점에서 코루틴이 어떻게 작동하는지에 대해 명확하게 이해했을 것
- **코루틴의 작동 과정은 중요**
- 다음 장부터는 내부 구현에 대해 확인
