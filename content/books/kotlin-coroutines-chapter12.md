+++ 
date = 2024-01-25T23:11:33+09:00
title = "[Kotlin Coroutines] 12장. 디스패처"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## 개요

코틀린 코루틴 라이브러리가 제공하는 중요한 기능

- 코루틴이 실행되어야 (시작하거나 재개하는 등) 할 스레드 (또는 스레드 풀) 를 결정할 수 있다는 것
  - 디스패처를 이용해 이러한 기능을 사용할 수 있음

디스패처?

- 영어 사전에서는 사람이나 차량, 특히 긴급 차량을 필요한 곳에 보내는 것을 담당하는 사람

코틀린 코루틴에서 코루틴이 어떤 스레드에서 실행될지 정하는 것은 CoroutineContext

## 기본 디스패처

- 디스패처를 설정하지 않으면 기본적으로 설정되는 디스패처는 CPU 집약적인 연산을 수행하도록 설계된 Dispatchers.Default
  - 이 디스패처는 코드가 실행되는 컴퓨터의 CPU 개수와 동일한 수 (최소 두 개 이상)의 스레드 풀을 가지고 있음
- 스레드를 효율적으로 사용하고 있다고 가정하면 이론적으로 최적의 스레드 수
  - 예를 들면 CPU 집약적인 연산을 수행하며 블로킹이 일어나지 않는 환경

```kotlin
suspend fun main() =
    coroutineScope {
        repeat(1000) {
            // runBlocking 은 디스패처가 설정되어 있지 않으면 자신만의 디스패처를 사용함
            launch { // or launch(Dispatchers.Default) {
                // To make it busy
                List(1000) { Random.nextLong() }.maxOrNull()

                val threadName = Thread.currentThread().name
                println("Running on thread: $threadName")
            }
        }
    }

// Running on thread: DefaultDispatcher-worker-3
// Running on thread: DefaultDispatcher-worker-7
// Running on thread: DefaultDispatcher-worker-10
// Running on thread: DefaultDispatcher-worker-5
// Running on thread: DefaultDispatcher-worker-2
// Running on thread: DefaultDispatcher-worker-6
// Running on thread: DefaultDispatcher-worker-8
// Running on thread: DefaultDispatcher-worker-9
// Running on thread: DefaultDispatcher-worker-10
// Running on thread: DefaultDispatcher-worker-2
// Running on thread: DefaultDispatcher-worker-10
// ...
```

- runBlocking 은 디스패처가 설정되어 있지 않으면 자신만의 디스패처를 사용함
  - 따라서 Dispatchers.Default 가 자동으로 선택안됨
  - coroutineScope 대신에 사용하면, 모든 코루틴은 ‘main’ 에서 실행됨

## 기본 디스패처를 제한하기

- Dispatchers.Default 의 limitedParallelism 을 사용하면 디스패처가 같은 스레드 풀을 사용하지만 같은 시간에 특정 수 이상의 스레드를 사용하지 못하도록 제한할 수 있음
- 디스패처의 스레드 수를 제한하는 방법은 Dispaters.Default 에만 사용되는 것이 아니므로, limitedParallelism 을 기억하고 있자.
  - 훨씬 중요하고 자주 사용됨

## 메인 디스패처

- 메인 스레드에서 코루틴을 실행하려면 Dispatchers.Main 을 사용하면 됨
  - 메인 디스패처를 정의하는 의존성이 없다면 Dispaters.Main 을 사용할 수 없음
  - 사용하고 싶다면 테스트 라이브러리에서 Dispaters.setMain(dispatcher) 로 디스패처를 설정하면 됨
- 안드로이드에서는 기본 디스패처로 메인 디스패처를 주로 사용
  - 블로킹 대신 중단하는 라이브러리를 사용하고, 복잡한 연산을 하지 않는다면 Dispatchers.Main 만으로 충분
- CPU 집약적인 작업을 수행한다면 Dispatchers.Default 로 실행
- 대부분의 애플리케이션에서는 두 개의 디스패처만 있어도 충분
- 하지만 스레드를 블로킹해야 하는 경우 어떻게 해야할까?
  - 예를 들어 시간이 오래 걸리는 I/O 작업 (용량이 큰 파일을 읽는 등) 이나 블로킹 함수가 있는 라이브러리가 필요할 때
  - Dispatchers.IO 가 짜잔

## IO 디스패처

- Dispatchers.IO 는
  - 파일을 읽고 쓰는 경우,
  - 블로킹 함수를 호출하는 경우,
- 처럼 I/O 연산으로 스레드를 블로킹할 때 사용하기 위해 설계됨
- 다음 코드는 Dispatchers.IO 가 같은 시간에 50개가 넘는 스레드를 사용할 수 있도록 만들어졌기 때문에 1초밖에 걸리지 않음 ㄷㄷ

```kotlin
suspend fun main() {
    val time =
        measureTimeMillis {
            coroutineScope {
                repeat(50) {
                    launch(Dispatchers.IO) {
                        Thread.sleep(1000)
                    }
                }
            }
        }
    println(time) // 1038, 1045, 1038, ...
}
```

- 왜 1초밖에 안걸림?

  - 스레드가 무한한 풀을 생각해보자
  - 처음에 풀이 비어 있지만, 더 많은 스레드가 필요해지면 스레드가 생성되고 작업이 끝날 때까지 활성화된 상태로 유지됨
  - 이러한 스레드 풀이 존재하더라도 직접 사용하는 건 안전하다고 볼 수 없음

    - 활성화된 스레드가 너무 많다면 성능이 떨어지게 되고, 결국에는 메모리 부족 에러가 발생할 것
    - 따라서 같은 시간에 사용할 수 있는 스레드 수를 제한한 디스패처가 필요함

      - Dispatchers.Default 는 프로세서가 가지고 있는 코어 수로 제한됨
      - Dispatchers.IO 는 64개 (또는 더 많은 코어가 있다면 해당 코어의 수) 로 제한됨

      ```kotlin
      suspend fun main() =
          coroutineScope {
              repeat(1000) {
                  launch(Dispatchers.IO) {
                      Thread.sleep(200)

                      val threadName = Thread.currentThread().name
                      println("Running on thread: $threadName")
                  }
              }
          }

      // Running on thread: DefaultDispatcher-worker-30
      // Running on thread: DefaultDispatcher-worker-2
      // Running on thread: DefaultDispatcher-worker-15
      // Running on thread: DefaultDispatcher-worker-1
      // Running on thread: DefaultDispatcher-worker-7
      // Running on thread: DefaultDispatcher-worker-32
      // Running on thread: DefaultDispatcher-worker-11
      // Running on thread: DefaultDispatcher-worker-16
      // Running on thread: DefaultDispatcher-worker-22
      // Running on thread: DefaultDispatcher-worker-10
      // Running on thread: DefaultDispatcher-worker-31
      // Running on thread: DefaultDispatcher-worker-13
      // Running on thread: DefaultDispatcher-worker-8
      // Running on thread: DefaultDispatcher-worker-24
      // Running on thread: DefaultDispatcher-worker-3
      // Running on thread: DefaultDispatcher-worker-12
      // Running on thread: DefaultDispatcher-worker-27
      // Running on thread: DefaultDispatcher-worker-14
      // Running on thread: DefaultDispatcher-worker-9
      // Running on thread: DefaultDispatcher-worker-18
      // Running on thread: DefaultDispatcher-worker-17
      // Running on thread: DefaultDispatcher-worker-19
      // Running on thread: DefaultDispatcher-worker-5
      // ...
      ```

- **Dispatchers.Default 와 Dispatchers.IO 는 같은 스레드 풀을 공유**
  - 최적화 측면에서 중요한 사실
  - 스레드는 재사용되고 다시 분배될 필요가 없음
- Dispatchers.Default 로 실행하는 도중에 withContext(Dispatchers.IO) { … } 까지 도달한 경우

  - 대부분은 같은 스레드로 실행될 것으로 예상하지만
  - 스레드 수가 Dispatchers.Default 의 한도가 아닌 Dispatchers.IO 의 한도로 적용됨
  - 스레드의 한도는 독립적
    - 다른 디스패처의 스레드를 고갈시키는 경우는 없음

  ```kotlin
  suspend fun main(): Unit =
      coroutineScope {
          launch(Dispatchers.Default) {
              println(Thread.currentThread().name)
              withContext(Dispatchers.IO) {
                  println(Thread.currentThread().name)
              }
          }
      }

  // DefaultDispatcher-worker-1
  // DefaultDispatcher-worker-1
  ```

- Dispatchers.Default 와 Dispatchers.IO 둘 다 모두를 최대치로 사용하는 경우
  - 활성화된 스레드의 수는 스레드 한도 전부를 합친 것과 같음
    - Dispatchers.IO에서 64개의 스레드까지 사용할 수 있고,
    - 8개의 코어를 가지고 있다면
    - 공유 스레드 풀에서 활성화된 스레드는 72개일 것
- 스레드 재활용적인 측면에서 효율적이라 할 수 있으며, 디스패처의 스레드 수는 각각 별개로 설정
- Dispatchers.IO 를 사용하는 가장 흔한 경우
  - 라이브러리에서 블로킹 함수를 호출해야 하는 경우
  - 이런 경우 withContext(Dispatchers.IO) 로 래핑해 중단 함수로 만드는 것이 가장 좋음
    - 이렇게 만들어진 함수는 다른 중단 함수와 다르지 않기 때문에 간단하게 사용할 수 있음
- withContext(Dispatchers.IO) 로 래핑한 함수가 너무 많은 스레드를 블로킹하면?
  - 문제가 됨
  - Dispatchers.IO 의 스레드는 64개로 제한됨
  - 이보다 더 많은 수의 스레드를 블로킹하면 스레드를 전부 기다리게 만듦
  - 이럴 때 limitedParallelism 을 활용할 수 있음

## 커스텀 스레드 풀을 사용하는 IO 디스패처

- Dispatchers.IO 에는 limitedParallelism 함수를 위해 정의된 특별한 작동 방식이 있음
- limitedParallelism 함수는 독립적인 스레드 풀을 가진 새로운 디스패처를 만듦
- 이렇게 만들어진 풀은 우리가 원하는 만큼 많은 수의 스레드 수를 설정할 수 있으므로, 스레드 수가 64개로 제한되지 않음 (?)
- 100개의 코루틴이 각각 스레드를 1초씩 블로킹하는 경우

  - Dispatchers.IO 로 실행하면 2초
  - 동일한 동작을 limitedParallelism 으로 100개의 스레드를 사용하는 Dispatchers.IO 에서 실행하면 1초가 걸림 ㄷㄷ
  - 디스패처의 한도는 서로 무관하기 때문에 디스패처의 실행 시간을 동시에 측정할 수 있음

  ```kotlin
  @OptIn(ExperimentalCoroutinesApi::class)
  suspend fun main(): Unit =
      coroutineScope {
          launch {
              printCoroutinesTime(Dispatchers.IO)
              // Dispatchers.IO took: 2020
          }

          launch {
              val dispatcher =
                  Dispatchers.IO
                      .limitedParallelism(100)
              printCoroutinesTime(dispatcher)
              // LimitedDispatcher@5ea9eecf took: 1026
          }
      }

  private suspend fun printCoroutinesTime(dispatcher: CoroutineDispatcher) {
      val test =
          measureTimeMillis {
              coroutineScope {
                  repeat(100) {
                      launch(dispatcher) {
                          Thread.sleep(1000)
                      }
                  }
              }
          }
      println("$dispatcher took: $test")
  }
  ```

- limitedParallelism 을 가장 잘 활용하는 방법은 스레드를 블로킹하는 경우가 잦은 클래스에서 자신 만의 한도를 가진 커스텀 디스패처를 정의하는 것
- 한도를 얼마나 크게 정하는 것이 좋을까?
  - 정해진 답은 없음
  - 너무 많은 스레드는 자원은 비효율적으로 사용함
  - 하지만 스레드 수가 적다면 사용 가능한 스레드를 가디라게 되므로 성능상 좋지 않음
  - 이 때 사용하는 스레드 한도가 Dispatchers.IO 를 비롯한 다른 디스패처와 무관하다는 사실
    - 따라서 한 서비스가 다른 서비스를 블로킹하는 경우는 없음

## 정해진 수의 스레드 풀을 가진 디스패처

- 몇몇 개발자들은 자신들이 사용하는 스레드 풀을 직접 관리하기를 원하며, 자바는 이를 지원하기 위한 강력한 API 를 제공
- ExecutorService.asCoroutineDispatchers() 로 만들어진 디스패처의 가장 큰 문제점
  - close 함수로 닫혀야 한다는 것
  - 이를 깜빡하면 메모리 누수로 이어짐
- 또 다른 문제는 정해진 수의 스레드 풀을 만들면 스레드를 효율적으로 사용하지 않는다는 것
  - 사용하지 않는 스레드가 다른 서비스와 공유되지 않고 살아있는 상태로 유지되기 때문

## 싱글스레드로 제한된 디스패처

- 다수의 스레드를 사용하는 모든 디스패처에서는 공유 상태로 인한 문제를 생각해야 함
- 다음 예제에서는 10000개의 코루틴이 i 를 1씩 증가하는 코드
- 기대하는 값: i는 10000이 되어야 함
- 실제 값: 동일 시간에 다수의 스레드가 공유 상태를 변경했기 때문에 작은 값을 가지게 됨

```kotlin
private var i = 0

suspend fun main(): Unit =
    coroutineScope {
        repeat(10_000) {
            launch(Dispatchers.IO) { // or Default
                i++
            }
        }
        delay(1000)
        println(i) // 9762, 9804, 9813, ...
    }
```

- 이러한 문제를 해결하는 다양한 방법이 있음
  - 싱글 스레드를 가진 디스패처를 사용하는 방법이 그 중 하나
  - 싱글 스레드를 사용하면 동기화를 위한 조치가 더 이상 필요하지 않음
  - Executors 를 사용하며 싱글 스레드 디스패처를 만드는 방법이 대표적
    - 하지만 디스패처가 스레드 하나를 액티브한 상태로 유지하고 있으며, 더 이상 사용되지 않을 때는 스레드를 반드시 닫아야 한다는 문제점이 있음
  - 최근에는 Dispatchers.Default 나 (스레드를 블로킹한다면) 병렬 처리를 1로 제한한 Dispatchers.IO 를 주로 사용함

```kotlin
private var i = 0

@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main(): Unit =
    coroutineScope {
        val dispatcher =
            Dispatchers.Default
                .limitedParallelism(1)

        repeat(10000) {
            launch(dispatcher) {
                i++
            }
        }
        delay(1000)
        println(i) // 10000
    }
```

- 단 하나의 스레드만 가지고 있기 때문에 이 스레드가 블로킹되면 작업이 순차적으로 처리되는 것이 가장 큰 단점

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main(): Unit =
    coroutineScope {
        val dispatcher =
            Dispatchers.Default
                .limitedParallelism(1)

        val job = Job()
        repeat(5) {
            launch(dispatcher + job) {
                Thread.sleep(1000)
            }
        }
        job.complete()
        val time = measureTimeMillis { job.join() }
        println("Took $time") // Took 5024
    }
```

## 프로젝트 룸의 가상 스레드 사용하기

- 프로젝트 룸! (Project Loom)
- 가장 혁신적인 특징
  - 일반적인 스레드보다 훨씬 가벼운 **가상 스레드**를 도입했다는 점
  - 일반적은 스레드를 블로킹하는 것보다 가상 스레드를 블로킹하는 것이 비용이 훨씬 적게 듦
- 코틀린 코루틴을 알고 있는 개발자들은 프로젝트 룸을 사용할 필요가 별로 없음
- 코틀린 코루틴은 취소를 쉽게 할 수 있고, 테스트에서 가상 시간을 쓰는 등의 훨씬 더 놀라운 기능을 갖추고 있음
- 프로젝트 룸이 정말로 유용한 경우는 스레드를 블로킹할 수 밖에 없는 Dispatchers.IO 대신 가상 스레드를 사용할 때
- 프로젝트 룸을 사용하려면 JVM 19 이상을 사용해야 함
- Exucutors 의 newVirtualThreadPerTaskExecutor 로 익스큐터를 생성한 후, 코루틴 디스패처로 변환할 수 있음
- ExecutorCoroutineDispatcher 를 구현하는 객체를 만들 수도 있음

```kotlin
object LoomDispatcher : ExecutorCoroutineDispatcher() {
    val Dispatchers.LOOM: CoroutineDispatcher
        get() = LoomDispatcher

    override val executor: Executor =
        Executor { command ->
            Thread.startVirtualThread(command)
        }

    override fun dispatch(
        context: CoroutineContext,
        block: Runnable,
    ) {
        executor.execute(block)
    }

    override fun close() {
        error("Cannot be invoked on Dispatchers.LOOM")
    }
}
```

- ExecutorCoroutineDispatcher 를 구현한 디스패처를 다른 디스패처와 비슷하게 사용하려면, Dispaters 객체의 확장 프로퍼티를 정의해야 함
- 이제 테스트 해보자. (누구나 차이점을 볼 수 있는 극단적인 예시로)
- 각각의 코루틴이 1초 동안 블로킹되는 100,000 개의 코루틴을 시작
  - 무언가를 출력하거나 값을 증가시키는 등의 작업을 수행하게 할 수 있지만, 결과에 큰 차이는 없을 것
  - Dispatchers.LOOM 에서 수행한 결과, 2초보다 약간 더 걸림

```kotlin
suspend fun main() =
    measureTimeMillis {
        coroutineScope {
            repeat(100_000) {
                launch(Dispatchers.LOOM) {
                    Thread.sleep(1000)
                }
            }
        }
    }.let(::println) // 2349, 2219, 2452, ...
```

- Dispatchers.IO 로 늘려서 실행해보면 23초 걸림, 룸 디스패처보다 10배나 ㄷㄷ

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main() =
    measureTimeMillis {
        val dispatcher =
            Dispatchers.IO
                .limitedParallelism(100_000)

        coroutineScope {
            repeat(100_000) {
                launch(dispatcher) {
                    Thread.sleep(1000)
                }
            }
        }
    }.let(::println) // 22989
```

- 아직 시작단계지만, Dispatchers.IO 를 대체할 수 있는 경쟁자라고 생각함
- 하지만 코틀린 코루틴 팀이 프로젝트 룸이 안정화되면 가상 스레드를 기본으로 사용할 수있다고 했기 때문에 나중에 룸 디스패처가 필요하지 않을 수도 있음
  - 어차피 JVM 위에서 돌아감 ㅅㄱ

## 제한받지 않는 디스패처

- Dispatchers.Unconfined
- 이 디스패처는 스레드를 바꾸지 않는다는 점에서 이전 디스패처들과 다름
- 제한받지 않는 디스패처가 시작되면 시작한 스레드에서 실행이 됨
- 재개되었을 때는 재개한 스레드에서 실행이 됨

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, DelicateCoroutinesApi::class)
suspend fun main(): Unit =
    withContext(newSingleThreadContext("Thread1")) {
        var continuation: Continuation<Unit>? = null

        launch(newSingleThreadContext("Thread2")) {
            delay(1000)
            continuation?.resume(Unit)
        }

        launch(Dispatchers.Unconfined) {
            println(Thread.currentThread().name) // Thread1

            suspendCancellableCoroutine<Unit> {
                continuation = it
            }

            println(Thread.currentThread().name) // Thread2

            delay(1000)

            println(Thread.currentThread().name)
            // kotlinx.coroutines.DefaultExecutor
            // (used by delay)
        }
    }
```

- 제한받지 않는 디스패처는 단위 테스트를 할 때 유용
  - 하지만 runTest 를 사용하면 이런 방법은 필요가 없다.
- 성능적인 측면에서 보면 스레드 스위칭을 일으키지 않는다는 점에서 제한받지 않는 디스패처의 비용이 가장 저렴
  - 실행되는 스레드에 대해 전혀 신경쓰지 않아도 된다면 제한받지 않는 디스패처를 선택해도 됨
- 하지만 현업에서 제한받지 않는 디스패처를 사용하는 건 무모함

## 메인 디스패처로 즉시 옮기기

- 코루틴을 배정하는 것에도 비용이 듦
- withContext 가 호출되면 코루틴은 중단되고 큐에서 기다리다가 재개됨
- 스레드에서 이미 실행되고 있는 코루틴을 다시 배정하면 작지만 필요 없는 비용이 든다고 할 수 있음
- 메인 디스패처에서 withContext(Dispatchers.Main) 을 사용하면 불필요한 비용이 들게되므로, 이럴 때 Dispatchers.Main.immediate 를 사용하면 된다.
- 메인 디스패처 외에 다른 디스패처에서는 즉시 배정하는 옵션을 현재 지원하지 않고 있다.

### 다른 디스패처로 옮기는 걸 확인해보자

```kotlin
class SwitchDispatchersTest {
    private val dispatcher =
        Executors
            .newSingleThreadExecutor()
            .asCoroutineDispatcher()

    @OptIn(ExperimentalCoroutinesApi::class)
    @BeforeEach
    fun setup() {
        Dispatchers.setMain(dispatcher)
    }

    @Test
    @DisplayName("Dispatchers.Main -> Dispatchers.Main.immediate")
    fun switchDispatchersTest0(): Unit =
        runTest {
            launch(Dispatchers.Main) {
                val mainDispatcher = coroutineContext[ContinuationInterceptor] as CoroutineDispatcher

                assert(mainDispatcher.toString() == "Dispatchers.Main")
                val rootThreadName = Thread.currentThread().name

                withContext(Dispatchers.Main.immediate) {
                    val mainImmediateDispatcher = coroutineContext[ContinuationInterceptor] as CoroutineDispatcher

                    assert(mainImmediateDispatcher.toString() == "Dispatchers.Main")
                    assert(mainDispatcher.toString() == mainImmediateDispatcher.toString())

                    val threadName = Thread.currentThread().name
                    assert(threadName == rootThreadName)
                }
            }
        }

    @Test
    @DisplayName("Dispatchers.Main -> Dispatchers.Unconfined")
    fun switchDispatchersTest1(): Unit =
        runTest {
            launch(Dispatchers.Main) {
                val mainDispatcher = coroutineContext[ContinuationInterceptor] as CoroutineDispatcher

                assert(mainDispatcher.toString() == "Dispatchers.Main")
                val rootThreadName = Thread.currentThread().name
                withContext(Dispatchers.Unconfined) {
                    val unconfinedDispatcher = coroutineContext[ContinuationInterceptor] as CoroutineDispatcher

                    assert(unconfinedDispatcher.toString() == "Dispatchers.Unconfined")
                    assert(mainDispatcher.toString() != unconfinedDispatcher.toString())

                    val threadName = Thread.currentThread().name
                    assert(threadName == rootThreadName)
                }
            }
        }
}
```

## 컨티뉴에이션 인터셉터

- 디스패칭은 코루틴 언어에서 지원하는 컨티뉴에이션 인터셉션을 기반으로 작동
- ContinuationInterceptor 라는 코루틴 컨텍스트는 코루틴이 중단되었을 때 interceptContinuation 메서드로 컨티뉴에이션 객체를 수정하고 포장함
  - 캐싱이 작동하기 때문에 컨티뉴에이션당 한 번만 래핑하면 됨
- releaseInterceptedContinuation 메서드는 컨티뉴에이션이 종료되었을 때 호출됨
- 컨티뉴에이션 객체를 래핑할 수 있다는 것은 다양한 방법으로 제어할 수 있다는 것
- 디스패처는 특정 스레드 풀에서 실행되는 DispatchedContinuation 으로 컨티뉴에이션 객체를 래핑하기 위해 interceptContinuation 을 사용함
- **DispatchedContinuation 은 디스패처가 작동하는 핵심 요소**
- kotlinx-coroutines-test 의 runTest 와 같은 테스트 라이브러리에서도 똑같은 컨텍스트를 사용하고 있음
  - 컨텍스트의 각 원소는 고유한 키를 가져야 함
  - 따라서 일부 단위 테스트에서 디스패처를 주입해 기존 디스패처를 테스트 디스패처로 대체해야 함

## 작업의 종류에 따른 각 디스패처의 성능 비교

- 작업의 종류에 따라 각 디스패처의 성능을 비교하기 위해 벤치마크 테스트를 수행해봄
- 중단
  - 순서대로 1초 중단함
- 블로킹
  - 1초동안 블로킹함
- 단위는 millisecond

|                             | 중단  | 블로킹  | CPU 집약적인 연산 | 메모리 집약적인 연산 |
| --------------------------- | ----- | ------- | ----------------- | -------------------- |
| 싱글스레드                  | 1,002 | 100,003 | 39,103            | 94,358               |
| 디폴트 디스패처(스레드 8개) | 1,002 | 13,003  | 8,473             | 21,461               |
| IO 디스패처 (스레드 63개)   | 1,002 | 2,003   | 9,893             | 20,776               |
| 스레드 100개                | 1,002 | 1,003   | 16,379            | 21,004               |

- 주목할 만한 중요한 사항
  - 단지 중단할 경우에는 사용하고 있는 스레드 수가 얼마나 많은지는 문제가 안됨
  - 블로킹할 경우에는 스레드가 많을 수록 모든 코루틴이 종료되는 시간이 빨라짐
  - CPU 집약적인 연산에서는 Dispatchers.Default 가 가장 좋은 선택지
  - 메모리 집약적인 연산을 처리하고 있다면 더 많은 스레드를 사용하는 것이 좀 더 나음
    - 하지만 그렇게 차이가 많이 나지는 않음
- 테스트 함수는 아래와 같다
  - https://github.com/MarcinMoskala/coroutines-benchmarks/blob/master/src/jmh/java/me/champeau/jmh/DispatchersBenchmark.kt

## 요약

- 디스패처는 코루틴이 실행될 (시작하거나 재개되는) 스레드나 스레드 풀을 결정
- 가장 중요한 옵션은 다음과 같다.
  - Dispatchers.Default 는 CPU 집약적인 연산에 사용
  - Dispatchers.Main 은 메인 스레드에 접근할 때
  - Dispatchers.Main.immediate 는 Dispatchers.Main 이 사용하는 스레드에서 실행되지만 꼭 필요할 때만 재배정됨
  - Dispatchers.IO 는 블로킹 연산을 할 필요가 있을 때 사용
  - 병렬 처리를 제한한 Dispatchers.IO 나 특정 스레드 풀을 사용하는 커스텀 디스패처는 블로킹 호출 양이 아주 많을 때 사용함
  - 병렬 처리가 1로 제한된 Dispatchers.Default 나 Dispatchers.IO 또는 싱글 스레드를 사용하는 커스텀 디스패처는 공유 상태 변경으로 인한 문제를 방지하기 위해 사용함
  - Dispatchers.Unconfined 는 코루틴이 실행될 스레드에 대해서 신경 쓸 필요가 없을 때 사용함
