+++ 
date = 2024-02-08T15:05:00+09:00
title = "[Kotlin Coroutines] 14장. 공유 상태로 인한 문제"
+++

![](/images/books/kotlin-coroutines/cover.webp)

## 개요

- 아래 코드 처럼 구현하면 어떤 문제가 있을지 생각해보자 🤔

```kotlin
private class UserDownloader(
    private val api: NetworkService,
) {
    private val users = mutableListOf<User>()

    fun downloaded(): List<User> = users.toList()

    suspend fun fetchUser(id: Int) {
        val newUser = api.fetchUser(id)
        users += newUser
    }
}
```

- 동시 사용에 대한 대비가 되어 있지 않다.
  - fetchUser 호출은 users 를 변경하기 때문
    - 같은 시간에 해당 함수가 한 개의 스레드에서 시작할 경우에만 정상적으로 동작
- 같은 시간에 두 개 이상의 스레드에서 함수가 호출 될 수 있으므로 users 는 공유 상태에 해당하며 보호될 필요가 있음
  - 동시에 리스트를 변경하면 충돌이 일어날 수 있기 때문
  - 아래 예제는 충돌이 일어날 수 있는 경우

```kotlin
private class FakeNetworkService : NetworkService {
    override suspend fun fetchUser(id: Int): User {
        delay(2)
        return User("User$id")
    }
}

suspend fun main() {
    val downloader = UserDownloader(FakeNetworkService())
    coroutineScope {
        repeat(1_000_000) {
            launch {
                downloader.fetchUser(it)
            }
        }
    }
    print(downloader.downloaded().size) // 815781, 805445, 753823, ...
}
```

- 상호 작용하는 스레드가 많아 1_000_000 보다 작은 수가 나오거나 예외가 발생하게 됨
- 이런 문제는 공유 상태를 변경할 때 쉽게 만날 수 있음
- 아래 예제도 비슷한 경우

```kotlin
private var counter = 0

fun main() =
    runBlocking {
        massiveRun {
            counter++
        }
        println(counter) // 332598, 300346, 375650, ...
    }

private suspend fun massiveRun(action: suspend () -> Unit) =
    withContext(Dispatchers.Default) {
        repeat(1000) {
            launch {
                repeat(1000) { action() }
            }
        }
    }
```

## 동기화 블로킹

- 위와 같은 문제는 자바에서 사용되는 전통적인 도구인 synchronized 블록이나 동기화된 컬렉션을 사용해 해결할 수 있음

```kotlin
private var counter = 0

fun main() =
    runBlocking {
        val lock = Any()
        massiveRun {
            synchronized(lock) { // We are blocking threads!
                counter++
            }
        }
        println("Counter = $counter") // 1000000
    }

private suspend fun massiveRun(action: suspend () -> Unit) =
    withContext(Dispatchers.Default) {
        repeat(1000) {
            launch {
                repeat(1000) { action() }
            }
        }
    }
```

- 이러면 문제가 몇 개 발생하지만
  - 가장 큰 문제점은 synchronized 블록 내부에서 중단 함수를 사용할 수 없다는 것
  - 두 번째는 synchroized 블록에서 코루틴이 자기 차례를 기다릴 때 스레드를 블로킹한다는 것
- 디스패처의 원리를 생각해보면 코루틴이 스레드를 블로킹하는건 지양해야 함
  - 메인 스레드가 블로킹되면?
  - 제한된 수의 스레드만 가지고 있다면?
  - 왜 스레드와 같은 자원을 낭비해야 할까요?
- **따라서 코루틴에 특화된 방법을 사용해야 함**
  - **블로킹 없이 중단하거나 충돌을 회피하는 방법을 사용해야 함**

## 원자성

- 자바의 Atomic~ 원자값 사용
- 원자값을 활용한 연산은 빠르며 스레드 안전을 보장함
  - 이러한 연산을 원자성 연산
- 원자성 연산은 락 없이 로우 레벨로 구현되어 효율적이고 사용하기가 쉬움

```kotlin
private var counter = AtomicInteger()

fun main() =
    runBlocking {
        massiveRun {
            counter.incrementAndGet()
        }
        println(counter.get()) // 1000000
    }
```

- 하나의 연산에서 원자성을 가지고 있다고 해서 전체 연산에 원자성이 보장되는 것은 아님

```kotlin
private var counter = AtomicInteger()

fun main() =
    runBlocking {
        massiveRun {
            counter.set(counter.get() + 1)
        }
        println(counter.get()) // 165668, 172644, 179273, ...
    }
```

- UserDownloader 를 안전하게 사용하기 위해서 읽기만 가능한 사용자 리스트를 AtomicReference 로 래핑할 수도 있음
  - 충돌없이 값을 갱신하기 위해서는 getAndUpdate 라는 원자성 보장 함수를 사용
- 원자성은 하나의 프리미티브 변수 또는 하나의 레퍼런스의 안전을 보장하기 위해 사용되지만, 좀 더 복잡한 경우에는 다른 방법을 사용해야 함

```kotlin
class UserDownloader(
    private val api: NetworkService,
) {
    private val users = AtomicReference(listOf<User>())

    fun downloaded(): List<User> = users.get()

    suspend fun fetchUser(id: Int) {
        val newUser = api.fetchUser(id)
        users.getAndUpdate { it + newUser }
    }
}
```

### Q. ☝️위의 예시가 제대로 종료안됨. 너무 오래 걸림

### Q. 어떻게 원자성을 보장하나?

- CAS-based 로 구현됨
- CAS-based
  - Compare-and-Swap
- https://dzone.com/articles/demystifying-javas-compare-and-swap-cas

### References

- https://www.baeldung.com/java-atomic-variables

## 싱글스레드로 제한된 디스패치

- 싱글스레드 디스패처를 사용하는 것이 공유 상태와 관련된 대부분의 문제를 해결하는 가장 쉬운 방법

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
private val dispatcher =
    Dispatchers.IO
        .limitedParallelism(1)

private var counter = 0

fun main() =
    runBlocking {
        massiveRun {
            withContext(dispatcher) {
                counter++
            }
        }
        println(counter) // 1000000
    }

private suspend fun massiveRun(action: suspend () -> Unit) =
    withContext(Dispatchers.Default) {
        repeat(1000) {
            launch {
                repeat(1000) { action() }
            }
        }
    }
```

- 두 가지 방법으로 디스패처를 사용할 수 있음
- 첫 번째 방법은 **코스 그레인드 스레드 한정 (coarse-grained thread confinement)**

  - 디스패처를 싱글스레드로 제한한 withContext 로 전체 함수를 래핑하는 방법
  - 사용하기 쉬움, 충돌을 방지할 수 있음
  - 함수 전체에서 멀티스레딩의 이점을 누리지 못하는 문제가 있음

  ```kotlin
  @OptIn(ExperimentalCoroutinesApi::class)
  suspend fun main() {
      class UserDownloader(
          private val api: NetworkService,
      ) {
          private val users = mutableListOf<User>()
          private val dispatcher = // <-- 요 부분
              Dispatchers.IO
                  .limitedParallelism(1)

          suspend fun downloaded(): List<User> =
              withContext(dispatcher) {
                  users.toList()
              }

          suspend fun fetchUser(id: Int) =
              withContext(dispatcher) {
                  val newUser = api.fetchUser(id)
                  users += newUser
              }
      }

      class FakeNetworkService : NetworkService {
          override suspend fun fetchUser(id: Int): User {
              delay(2)
              return User("User$id")
          }
      }

      val downloader = UserDownloader(FakeNetworkService())
      coroutineScope {
          repeat(1_000_000) {
              launch {
                  downloader.fetchUser(it)
              }
          }
      }
      print(downloader.downloaded().size) // 1000000
  }
  ```

- 두 번째 방법은 **파인 그레인드 스레드 한정 (fine-grained thread confinement)**

  - 상태를 변경하는 구문들만 래핑
    - 예제에서는 users 를 사용하는 모든 라인들
  - 좀 더 번거롭지만, critical section 이 아닌 부분이 블로킹되거나 CPU 집약적인 경우에 더 나은 성능을 제공
  - 일반적인 중단 함수에 적용하는 경우에는 성능에 큰 차이가 없음

  ```kotlin
  @OptIn(ExperimentalCoroutinesApi::class)
  suspend fun main() {
      class UserDownloader(
          private val api: NetworkService,
      ) {
          private val users = mutableListOf<User>()
          private val dispatcher =
              Dispatchers.IO
                  .limitedParallelism(1)

          suspend fun downloaded(): List<User> =
              withContext(dispatcher) {
                  users.toList()
              }

          suspend fun fetchUser(id: Int) {
              val newUser = api.fetchUser(id)
              withContext(dispatcher) { // <-- 상태를 변경할 때만
                  users += newUser
              }
          }
      }

      class FakeNetworkService : NetworkService {
          override suspend fun fetchUser(id: Int): User {
              delay(2)
              return User("User$id")
          }
      }

      val downloader = UserDownloader(FakeNetworkService())
      coroutineScope {
          repeat(1_000_000) {
              launch {
                  downloader.fetchUser(it)
              }
          }
      }
      print(downloader.downloaded().size) // 1000000
  }
  ```

  - 대부분의 경우, 표준 디스패처가 같은 스레드 풀을 사용하기 때문에 싱글스레드를 가진 디스패처를 사용하는 건 쉬울 뿐 아니라 효율적

## 뮤텍스

- 마지막으로 가장 인기 있는 방식은 Mutex 를 사용하는 것
  - 뮤텍스를 단 하나의 열쇠가 있는 방이라고 생각할 수 있음
- 뮤텍스의 가장 중요한 기능은 lock
  - 첫 번째 코루틴이 lock 을 호출하면 열쇠를 가지고 중단 없이 작업을 수행
  - 또 다른 코루틴이 lock 을 호출하면 첫 번째 코루틴이 unlock 할 때까지 중단됨
  - 또 다른 코루틴이 lock 을 호출하면, 마찬가지로 작업을 중단한 뒤에 두 번째 코루틴 다음 순서로 큐에 들어감
  - 첫 번째 코루틴이 unlock 하면, 두 번째 코루틴 (큐의 첫 번째 코루틴) 이 재개한 뒤 lock 함수를 통과
  - **따라서 단 하나의 코루틴만이 lock 과 unlock 사이에 있을 수 있음**

```kotlin
suspend fun main() =
    coroutineScope {
        repeat(5) {
            launch {
                delayAndPrint()
            }
        }
    }

private val mutex = Mutex()

private suspend fun delayAndPrint() {
    mutex.lock()
    delay(1000)
    println("Done")
    mutex.unlock()
}

// (1 sec)
// Done
// (1 sec)
// Done
// (1 sec)
// Done
// (1 sec)
// Done
// (1 sec)
// Done
```

- **lock 과 unlock 을 직접 사용하는 건 위험함**
  - 두 함수 사이에서 예외가 발생할 경우 **deadlock 이 발생할 수 있음**
- 대신 lock 으로 시작해서 finally 블록에서 unlock 을 호출하는 withLock 함수를 사용하여 블록 내에서 어떤 예외가 발생하더라도 자물쇠를 성공적으로 풀 수 있게 할 수 있음

  ```kotlin
  @OptIn(ExperimentalContracts::class)
  public suspend inline fun <T> Mutex.withLock(owner: Any? = null, action: () -> T): T {
      contract {
          callsInPlace(action, InvocationKind.EXACTLY_ONCE)
      }

      lock(owner)
      try {
          return action()
      } finally {
          unlock(owner)
      }
  }
  ```

  - 실제 사용하는 법은 synchronized 블록과 비슷

```kotlin
private val mutex = Mutex()

private var counter = 0

fun main() =
    runBlocking {
        massiveRun {
            mutex.withLock {
                counter++
            }
        }
        println(counter) // 1000000
    }

private suspend fun massiveRun(action: suspend () -> Unit) =
    withContext(Dispatchers.Default) {
        repeat(1000) {
            launch {
                repeat(1000) { action() }
            }
        }
    }
```

- synchronized 블록과 달리 뮤텍스가 가지는 중요한 이점
  - **스레드를 블로킹하는 대신 코루틴을 중단시킨다는 것**
  - 좀 더 안전하고 가벼운 방식
- 병렬 실행이 싱글스레드로 제한된 디스패처를 사용하는 것과 비교하면 뮤텍스가 가벼우며 좀 더 나은 성능을 가질 수 있음
- 하지만 적절히 사용하는 것 또한 더 어려움
- 뮤텍스를 사용할 때 맞닥뜨리는 위험한 경우
  - **코루틴이 락을 두 번 통과할 수 없다는 것**
  - 아래 코드는 교착에 빠지며 영원히 블로킹됨
  ```kotlin
  suspend fun main() {
      val mutex = Mutex()
      println("Started")
      mutex.withLock {
          mutex.withLock {
              println("Will never be printed")
          }
      }
  }
  // Started
  // (runs forever)
  ```
- 뮤텍스가 가진 두 번째 문제점은 **코루틴이 중단되었을 때 뮤텍스를 풀 수 없다는 점 😱**

  - 다음 코드를 보면 delay 중에 뮤텍스가 잠겨 있어서 5초가 걸리는 걸 확인 가능

  ```kotlin
  suspend fun main() {
      class MessagesRepository {
          private val messages = mutableListOf<String>()
          private val mutex = Mutex()

          suspend fun add(message: String) =
              mutex.withLock {
                  delay(1000) // we simulate network call
                  messages.add(message)
              }
      }

      val repo = MessagesRepository()

      val timeMillis =
          measureTimeMillis {
              coroutineScope {
                  repeat(5) {
                      launch {
                          repo.add("Message$it")
                      }
                  }
              }
          }
      println(timeMillis) // 5071, 5065, 5060, ...
  }
  ```

  - 싱글스레드로 제한된 디스패처를 사용하면 이런 문제는 발생하지 않음
  - delay 나 네트워크 호출이 코루틴을 중단시키면 스레드를 다른 코루틴이 사용함

  ```kotlin
  @OptIn(ExperimentalCoroutinesApi::class)
  suspend fun main() {
      class MessagesRepository {
          private val messages = mutableListOf<String>()
          private val dispatcher = Dispatchers.IO.limitedParallelism(1)

          suspend fun add(message: String) =
              withContext(dispatcher) {
                  delay(1000) // we simulate network call
                  messages.add(message)
              }
      }

      val repo = MessagesRepository()

      val timeMillis =
          measureTimeMillis {
              coroutineScope {
                  repeat(5) {
                      launch {
                          repo.add("Message$it")
                      }
                  }
              }
          }
      println(timeMillis) // 1044, 1039, 1038, ...
  }
  ```

- 따라서 전체 함수를 뮤텍스로 래핑하는 건 지양해야 함
  - 코스 그레인드 방식
- 뮤텍스를 사용하기로 했다면 락을 두 번 걸지 않고 중단 함수를 호출하지 않도록 신경 써야 함
- (공유 상태를 변경하는 곳에서만 래핑하는) 파인 그레인드 스레드 한정이 도움이 될 수 있음

## 세마포어 (semaphore)

- Mutex 에 대해 배웠다면… 비슷한 방식으로 작동하지만 둘 이상이 접근할 수 있고 사용법이 다른 세마포어도 알아야 함
- Mutex
  - 하나의 접근만 허용
  - lock, unlock, withLock
- Semaphore
  - 여러 개의 접근을 허용
  - acquire, release, withPermit

```kotlin
suspend fun main() =
    coroutineScope {
        val semaphore = Semaphore(2)

        repeat(5) {
            launch {
                semaphore.withPermit {
                    delay(1000)
                    print(it)
                }
            }
        }
    }

// 01
// (1 sec)
// 32
// (1 sec)
// 4
```

- 세마포어는 공유 상태로 인해 생기는 문제를 해결할 수는 없지만, 동시 요청을 처리하는 수를 제한할 때 사용할 수 있음
  - 처리율 제한 장치 (rate limiter) 를 구현할 때 도움이 됨

## 요약

- 공유 상태를 변경할 때 발생할 수 있는 충돌을 피하기 위해 코루틴을 다루는 방법은 다양함
- 가장 많이 쓰이는 방법
  - 싱글스레드로 제한된 디스패처를 사용해 공유 상태를 변경하는 것
- 파인 그레인드 스레드 한정
  - 동기화가 필요한 특정 장소만 래핑
- 코스 그레인드 스레드 한정
  - 전체 함수를 래핑
  - 파인 그레인드 스레드 한정보다 더 쉽지만 성능은 떨어짐
- 원자값, 뮤텍스를 사용하는 방법도 있음

## References

- https://kotlinlang.org/docs/shared-mutable-state-and-concurrency.html
