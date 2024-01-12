+++ 
date = 2024-01-12T23:00:00+09:00
title = "[Kotlin Coroutines] 9장. 취소"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## 개요

- 코루틴에서 아주 중요한 기능 중 하나, 바로 취소 (cancellation)
- 취소는 아주 중요한 기능이기 때문에 중단 함수를 사용하는 몇몇 클래스와 라이브러리는 취소를 반드시 지원함
- 코루틴을 취소하는 문제에 대한 좋은 해결책은 아주 오랫동안 연구됨
  - 그 중 **코틀린 코루틴이 제시한 방식은 아주 간단하고 편리하며 안전**함
  - 필자의 경력 동안 보았던 모든 취소 방식 중 단연 최고

## 기본적인 취소

- Job 인터페이스는 취소하게 하는 cancel 메서드를 가지고 있음
- cancel 메서드를 호출하면 다음과 같은 효과
  - 호출한 코루틴은 첫 번째 중단점에서 잡을 끝냄
  - 잡이 자식을 가지고 있다면, 그들 또한 취소됨
    - 하지만 부모는 영향을 받지 않음
  - 잡이 취소되면, 취소된 잡은 새로운 코루틴의 부모로 사용될 수 없음
    - 취소된 잡은 Cancelling 상태가 되었다가 Cancelled 상태로 바뀜

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val job =
            launch {
                repeat(1_000) { i ->
                    delay(200)
                    println("Printing $i")
                }
            }

        delay(1100)
        job.cancel()
        job.join()
        println("Cancelled successfully")
    }
```

- cancel 함수에 각기 다른 예외를 인자로 넣는 방법을 사용하면 취소된 원인을 명확하게 할 수 있음
- 코루틴을 취소하기 위해서 사용되는 예외는 CancellationException
  - 인자로 사용되는 예외는 반드시 CancellationException 의 서브 타입
- cancel 이 호출된 뒤 다음 작업을 진행하기 전에 취소 과정이 완료되는 걸 기다리기 위해 join 을 사용하는 것이 일반적

  - join 을 호출하지 않으면?

    - 경쟁 상태 (race condition) 가 될 수도 있음
    - 다음 코드에서 ‘Cancelled successfully’ 뒤에 ‘Printing 4’ 가 출력되는 걸 알 수 있음

    ```kotlin
    suspend fun main() =
        coroutineScope {
            val job =
                launch {
                    repeat(1_000) { i ->
                        delay(100)
                        Thread.sleep(100) // We simulate long operation
                        println("Printing $i")
                    }
                }

            delay(1000)
            job.cancel()
            println("Cancelled successfully")
        }
    ```

    - job.join() 을 뒤에 추가하면 코루틴이 취소를 마칠 때까지 중단되므로, 경쟁 상태가 발생하지 않음

    ```kotlin
    suspend fun main() =
        coroutineScope {
            val job =
                launch {
                    repeat(1_000) { i ->
                        delay(100)
                        Thread.sleep(100) // We simulate long operation
                        println("Printing $i")
                    }
                }

            delay(1000)
            job.cancel()
            job.join()
            println("Cancelled successfully")
        }
    ```

    - cancelAndJoin 을 사용해도 된다.

    ```kotlin
    suspend fun main(): Unit =
        coroutineScope {
            val job =
                launch {
                    repeat(1_000) { i ->
                        delay(200)
                        println("Printing $i")
                    }
                }

            delay(1100)
            job.cancelAndJoin()
            println("Cancelled successfully")
        }
    ```

- Job 팩토리 함수로 생성된 잡은 같은 방법으로 취소될 수 있음
  - 이 방법은 잡에 딸린 수많은 코루틴을 한 번에 취소할 때 자주 사용됨
  ```kotlin
  suspend fun main(): Unit =
      coroutineScope {
          val job = Job()
          launch(job) {
              repeat(1_000) { i ->
                  delay(200)
                  println("Printing $i")
              }
          }
          delay(1100)
          job.cancelAndJoin()
          println("Cancelled successfully")
      }
  ```
  - 한꺼번에 취소하는 기능은 아주 유용

## 취소는 어떻게 작동하는가?

- 잡이 취소되면 Cancelling 상태로 바뀜
- 상태가 바뀐 뒤 첫 번째 중단점에서 CancellationException 예외를 던짐
- 예외는 try-catch 구문을 사용하여 잡을 수도 있지만, 다시 던지는 것이 좋음

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val job = Job()
        launch(job) {
            try {
                repeat(1_000) { i ->
                    delay(200)
                    println("Printing $i")
                }
            } catch (e: CancellationException) {
                println(e)
                throw e
            }
        }
        delay(1100)
        job.cancelAndJoin()
        println("Cancelled successfully")
        delay(1000)
    }
```

- 취소된 코루티닝 단지 멈추는 것이 아니라 내부적으로 예외를 사용해 취소되는 걸 명심해야 함
- 따라서 finally 블록 안에서 모든 것을 정리할 수 있음
  - 예를 들어 finally 블록에서 파일이나 데이터베이스 연결을 닫을 수 있음
  - 대부분의 자원 정리 과정은 finally 블록에서 실행되므로 코루틴에서도 finally 블록을 마음껏 사용해도 됨

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val job = Job()
        launch(job) {
            try {
                delay(Random.nextLong(2000))
                println("Done")
            } finally {
                print("Will always be printed")
            }
        }
        delay(1000)
        job.cancelAndJoin()
    }
```

## 취소 중 코루틴을 한 번 더 호출하기

- 코루틴이 실제로 종료되기 전에 CancellationException 을 잡고 좀 더 많은 연산을 수행 가능
  - 그러면 후처리 과정에 제한이 있을까?
- 코루틴은 모든 자원을 정리할 필요가 있는 한 계속해서 실행될 수 있음
- **하지만 중단 과정 중에 중단을 허용하지는 않음**
- Job 은 이미 Cancelling 상태가 되었기 때문에 중단되거나 다른 코루틴을 시작하는 건 절대 불가능
  - 다른 코루틴을 시작하려고 하면 그냥 무시함
  - 중단하려고 하면 CancellationException 을 던짐

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val job = Job()
        launch(job) {
            try {
                delay(2000)
                println("Job is done")
            } finally {
                println("Finally")
                launch { // will be ignored
                    println("Will not be printed")
                }
                delay(1000) // here exception is thrown
                println("Will not be printed")
            }
        }
        delay(1000)
        job.cancelAndJoin()
        println("Cancel done")
    }
```

- 가끔 코루틴이 이미 취소되었을 때 중단 함수를 반드시 호출해야 하는 경우도 있음
  - 예를 들면 데이터베이스의 변경 사항을 롤백하는 경우
- 이런 경우 함수 콜을 withContext(NonCancellable) 로 포장하는 방법이 많이 사용되고 있음
- 여기서 중요한 것은 코드 블록의 컨텍스트를 바꾼다는 것
  - withContext 내부에서는 취소될 수 없는 Job 인 NonCancellable 객체를 사용함
- 따라서 블록 내부에서 잡은 액티브 상태를 유지하며, 중단 함수를 원하는 만큼 호출할 수 있음

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val job = Job()
        launch(job) {
            try {
                delay(200)
                println("Coroutine finished")
            } finally {
                println("Finally")
                withContext(NonCancellable) {
                    delay(1000L)
                    println("Cleanup done")
                }
            }
        }
        delay(100)
        job.cancelAndJoin()
        println("Done")
    }
```

## invokeOnCompletion

- 자원을 해제하는 데 자주 사용되는 또 다른 방법은 Job의 invokeOnCompletion 메서드를 호출하는 것
- invokeOnCompletion 메서드는 잡이 Completed 나 Cancelled 와 같은 마지막 상태에 도달했을 때 호출될 핸들러를 지정하는 역할

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val job =
            launch {
                delay(1000)
            }
        job.invokeOnCompletion { exception: Throwable? ->
            println("Finished")
        }
        delay(400)
        job.cancelAndJoin()
    }
```

- 핸들러의 파라미터 중 하나인 예외의 종류는 다음과 같음
  - 잡이 예외 없이 끝나면 null
  - 코루틴이 취소되었으면 CancellationException 이 됨
  - 코루틴을 종료시킨 예외일 수 있음
- 잡이 invokeOnCompletion 이 호출되기 전에 완료되었으면 핸들러는 즉시 호출됨
  - onCancelling 과 invokeImmediately 파라미터를 사용하면 핸들러의 동작 방식을 변경할 수 있음

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val job =
            launch {
                delay(Random.nextLong(2400))
                println("Finished")
            }
        delay(800)
        job.invokeOnCompletion { exception: Throwable? ->
            println("Will always be printed")
            println("The exception was: $exception")
        }
        delay(800)
        job.cancelAndJoin()
    }
```

- invokeOnCompletion 은 취소하는 중에 동기적으로 호출됨
- 어떤 스레드에서 실행할지 결정할 수는 없음

## 중단될 수 없는 걸 중단하기

- 취소는 중단점에서 일어나기 때문에 **중단점이 없으면 취소를 할 수 없음**
- 이런 상황을 만들어 보기 위해, delay 대신에 Thread.sleep 을 사용할 수 있음
- **Thread.sleep 을 사용한 구현은 정말 나쁜 방식이므로 현업에선 절대 사용하면 안 됨**
- 여기서는 코루틴을 확장해서 사용하고 중단시키지 않는 상황을 만들기 위한 예제로 사용했다고 이해하면 됨
  - 신경망 러닝이나 블록되는 호출이 필요할 때와 같이 복잡한 상황에서 이런 상황이 일어날 수 있음

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val job = Job()
        launch(job) {
            repeat(1_000) { i ->
                Thread.sleep(200) // We might have some
                // complex operations or reading files here
                println("Printing $i")
            }
        }
        delay(1000)
        job.cancelAndJoin()
        println("Cancelled successfully")
        delay(1000)
    }
// 계속 출력됨...
```

- 이런 상황에 대처하는 몇 가지 방법
  - 첫 번째는 yield() 를 주기적으로 호출하는 것
    - yield 는 코루틴을 중단하고 즉시 재실행
    - 중단점이 생겼기 때문에 취소를 포함해 중단 (또는 재실행) 중에 필요한 모든 작업을 할 수 있는 기회가 주어짐
    ```kotlin
    suspend fun main(): Unit =
        coroutineScope {
            val job = Job()
            launch(job) {
                repeat(1_000) { i ->
                    Thread.sleep(200)
                    yield()
                    println("Printing $i")
                }
            }
            delay(1100)
            job.cancelAndJoin()
            println("Cancelled successfully")
            delay(1000)
        }
    ```
    - 중단 가능하지 않으면서 CPU 집약적이거나 시간 집약적인 연산들이 중단 함수에 있다면, 각 연산들 사이에 yield 를 사용하는 것이 좋음
  - 또 다른 방법은 잡의 상태를 추적하는것
    - 코루틴 빌더 내부에서 this 는 빌더의 스코프를 참조하고 있음
    - isActive 를 통해 상태 체크 후 액티브 하지 않을 때 연산을 중단하는 방법
    ```kotlin
    suspend fun main(): Unit =
        coroutineScope {
            val job = Job()
            launch(job) {
                do {
                    Thread.sleep(200)
                    println("Printing")
                } while (isActive)
            }
            delay(1100)
            job.cancelAndJoin()
            println("Cancelled successfully")
        }
    ```
  - 또 다른 방법으로 Job 이 액티브 상태가 아니면 CancellationException 을 던지는 ensureActive 함수를 사용하는 방법
    ```kotlin
    suspend fun main(): Unit =
        coroutineScope {
            val job = Job()
            launch(job) {
                repeat(1000) { num ->
                    Thread.sleep(200)
                    ensureActive()
                    println("Printing $num")
                }
            }
            delay(1100)
            job.cancelAndJoin()
            println("Cancelled successfully")
        }
    ```
- yield vs isActive, ensureActive 모두 다른 코루틴이 실행할 수 있는 기회를 준다는 점에서 결과는 비슷

  - 하지만 둘이 매우 다름
  - ensureActive 함수는 CoroutineScope (또는 CoroutineContext 나 Job) 에서 호출되어야 함

    - 함수가 하는 일은 잡이 더 이상 액티브 상태가 아니면 예외를 던지는 것
    - 일반적으로 ensureActive 가 좀 더 가벼워서 선호되고 있음

    ```kotlin
    public fun CoroutineScope.ensureActive(): Unit = coroutineContext.ensureActive()

    public fun CoroutineContext.ensureActive() {
        get(Job)?.ensureActive()
    }

    public fun Job.ensureActive(): Unit {
        if (!isActive) throw getCancellationException()
    }
    ```

  - yield 함수는 전형적인 최상위 중단 함수
    - 스코프가 필요하지 않음
      - 일반적인 중단 함수에서도 사용될 수 있음
    - 중단하고 재개하는 일을 함
      - **스레드 풀을 가진 디스패처를 사용하면 스레드가 바뀌는 문제가 생길 수 있음**
    - yield 는 CPU 사용량이 크거나, 스레드를 블로킹하는 중단 함수에서 자주 사용됨

## suspendCancellableCoroutine

- suspendCoroutine 과 비슷하지만, 컨티뉴에이션 객체를 몇 가지 메서드가 추가된 CancellableContinutation<T> 로 래핑함
- 가장 중요한 메서드는 코루틴이 취소되었을 때 행동을 정의하는 데 사용하는 invokeOnCancellation 메서드
  - 이 메서드는 라이브러리의 실행을 취소하거나 자원을 해제할 때 주로 사용됨
- Retrofit 에서 지원되고 잘 사용되는 듯

## 요약

- 취소는 코루틴의 아주 강력한 기능
- 일반적으로 사용하는 데 어려움은 없지만 가끔씩 까다로운 경우도 있음
- 그래서 취소가 어떻게 작동하는지 이해하는 것이 중요
- 취소를 적절하게 사용하면 자원 낭비와 메모리 누수를 줄일 수 있음
- 애플리케이션 성능을 위해 잘 사용해보자.
