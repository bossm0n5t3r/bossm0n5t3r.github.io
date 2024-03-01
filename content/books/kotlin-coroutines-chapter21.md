+++ 
date = 2024-03-02T04:15:00+09:00
title = "[Kotlin Coroutines] 21장. 플로우 만들기"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## 원시값을 가지는 플로우

- 플로우를 만드는 가장 간단한 방법
  - 어떤 값을 가져야 하는지 정의하는 `flowOf` 함수를 사용하는 것

```kotlin
suspend fun main() {
    flowOf(1, 2, 3, 4, 5)
        .collect { print(it) } // 12345
}
```

- 값이 없는 플로우의 경우 `emptyFlow()`

```kotlin
suspend fun main() {
    emptyFlow<Int>()
        .collect { print(it) } // (nothing)
}
```

## 컨버터

- `Iterable`, `Iterator`, `Sequence` 를 플로우로 바꾸려면 `asFlow` 를 사용

```kotlin
suspend fun main() {
    listOf(1, 2, 3, 4, 5)
        .asFlow()
        .collect { print(it) } // 12345

    println()

    setOf(1, 2, 3, 4, 5)
        .asFlow()
        .collect { print(it) } // 12345

    println()

    sequenceOf(1, 2, 3, 4, 5)
        .asFlow()
        .collect { print(it) } // 12345
}
```

- asFlow 는 즉시 사용 가능한 원소들의 플로우를 만듦
- 플로우 처리 함수를 사용해 처리 가능한 원소들의 플로우를 시작할 때 유용함

## 함수를 플로우로 바꾸기

- 플로우는 시간상 지연되는 하나의 값을 나타낼 때 자주 사용됨
- **따라서 중단 함수를 플로우로 변환하는 것 또한 가능**
  - 이때 중단 함수의 결과가 플로우의 유일한 값

```kotlin
suspend fun main() {
    val function =
        suspend {
            // this is suspending lambda expression
            delay(1000)
            "UserName"
        }

    function.asFlow()
        .collect { println(it) }
}

// (1 sec)
// UserName

```

- 일반 함수를 변경하려면 함수 참조값이 필요
- 코틀린에서는 `::` 를 사용해서 참조 가능

```kotlin
private suspend fun getUserName(): String {
    delay(1000)
    return "UserName"
}

suspend fun main() {
    ::getUserName
        .asFlow()
        .collect { println(it) }
}

// (1 sec)
// UserName

```

## 플로우와 리액티브 스트림

- 리액티브 스트림을 활용하고 있다면 코드를 별로 바꾸지 않고 플로우 적용이 가능
- `Flux`, `Flowable`, `Observable` 은 `kotlinx-coroutines-reactive` 라이브러리의 `asFlow` 함수를 사용해 `Flow` 로 변환 가능한 `Publisher` 인터페이스를 구현하고 있음

```kotlin
suspend fun main() =
    coroutineScope {
        Flux.range(1, 5).asFlow()
            .collect { print(it) } // 12345

        println()

        Flowable.range(1, 5).asFlow()
            .collect { print(it) } // 12345

        println()

        Observable.range(1, 5).asFlow()
            .collect { print(it) } // 12345
    }

```

- 역으로 변환하려면?
  - 좀 더 복잡한 라이브러리를 사용해야 함
  - https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-reactor/

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val flow = flowOf(1, 2, 3, 4, 5)

        flow.asFlux()
            .doOnNext { print(it) } // 12345
            .subscribe()

        println()

        flow.asFlowable()
            .subscribe { print(it) } // 12345

        println()

        flow.asObservable()
            .subscribe { print(it) } // 12345
    }

```

## 플로우 빌더

- 플로우를 만들 때 가장 많이 사용되는 방법은 `flow` 빌더
- 빌더는 `flow` 함수를 먼저 호출하고, 람다식 내부에서 `emit` 함수를 사용해 다음 값을 방출함
- `Channel` 이나 `Flow` 에서 모든 값을 방출하려면 `emitAll` 을 사용할 수 있음

```kotlin
private fun makeFlow(): Flow<Int> =
    flow {
        repeat(3) { num ->
            delay(1000)
            emit(num)
        }
    }

suspend fun main() {
    makeFlow()
        .collect { println(it) }
}

// (1 sec)
// 0
// (1 sec)
// 1
// (1 sec)
// 2

```

## 플로우 빌더 이해하기

- 플로우 빌더는 플로우를 만드는 가장 기본적인 방법
- 다른 모든 방법 또한 빌더를 기초로 하고 있음

```kotlin
public fun <T> flowOf(vararg elements: T): Flow<T> = flow {
    for (element in elements) {
        emit(element)
    }
}
```

- `flow` 빌더는 내부적으로 아주 간단
  - `collect` 메서드 내부에서 `block` 함수를 호출하는 `Flow` 인터페이스를 구현함

```kotlin
@PublishedApi
internal inline fun <T> unsafeFlow(@BuilderInference crossinline block: suspend FlowCollector<T>.() -> Unit): Flow<T> {
    return object : Flow<T> {
        override suspend fun collect(collector: FlowCollector<T>) {
            collector.block()
        }
    }
}

```

- `flow` 빌더를 호출하면 단지 객체를 만들 뿐
- 반면 `collect` 를 호출하면 `collector` 인터페이스의 `block` 함수를 호출하게 됨

  - 이 예제의 `block` 함수는 1에서 정의된 람다식

  ```kotlin
  fun main() =
      runBlocking {
          flow { // 1
              emit("A")
              emit("B")
              emit("C")
          }.collect { value -> // 2
              println(value)
          }
      }

  // A
  // B
  // C
  ```

  - 리시버는 2에서 정의된 람다식인 `collect`

- (`FlowCollector` 와 같이) 람다식으로 정의된 함수 인터페이스를 정의하면 람다식의 본체는 함수형 인터페이스의 함수 본체로 사용됨
  - 여기서는 `emit`
  - 그러므로 `emit` 함수의 본체는 `println(value)`가 됨
- 따라서 `collect` 를 호출하면 1에서 정의된 람다식을 실행하기 시작하고
- `emit` 을 호출했을 때 2에서 정의된 람다식을 호출함
- 이것이 플로우가 작동하는 원리
- 플로우의 다른 모든 특성 또한 이런 원리에 기초하여 만들어짐

## 채널플로우 (channelFlow)

- `Flow` 는 콜드 데이터 스트림이므로 필요할 때만 값을 생성
- 몇몇 상황에서는 특정 원소를 찾는 상황이 발생할 수 있다.

  - 이럴 때 필요할 때만 다음 페이지를 지연 요청하게 된다.

  ```kotlin
  data class UserInChannelFlowExample(val name: String)

  interface UserApiInChannelFlowExample {
      suspend fun takePage(pageNumber: Int): List<UserInChannelFlowExample>
  }

  class FakeUserApiInChannelFlowExample : UserApiInChannelFlowExample {
      private val userInChannelFlowExamples = List(20) { UserInChannelFlowExample("User$it") }
      private val pageSize: Int = 3

      override suspend fun takePage(pageNumber: Int): List<UserInChannelFlowExample> {
          delay(1000) // suspending
          return userInChannelFlowExamples
              .drop(pageSize * pageNumber)
              .take(pageSize)
      }
  }

  fun allUsersFlowInChannelFlowExample(api: UserApiInChannelFlowExample): Flow<UserInChannelFlowExample> =
      flow {
          var page = 0
          do {
              println("Fetching page $page")
              val users = api.takePage(page++) // suspending
              emitAll(users.asFlow())
          } while (users.isNotEmpty())
      }

  suspend fun main() {
      val api = FakeUserApiInChannelFlowExample()
      val users = allUsersFlowInChannelFlowExample(api)
      val user =
          users
              .first {
                  println("Checking $it")
                  delay(1000) // suspending
                  it.name == "User3"
              }
      println(user)
  }

  // Fetching page 0
  // (1 sec)
  // Checking User(name=User0)
  // (1 sec)
  // Checking User(name=User1)
  // (1 sec)
  // Checking User(name=User2)
  // (1 sec)
  // Fetching page 1
  // (1 sec)
  // Checking User(name=User3)
  // (1 sec)
  // User(name=User3)

  ```

- 반면 원소를 처리하고 있을 때 미리 페이지를 받아오고 싶은 경우
  - 네트워크 호출을 더 빈번하게 하는 단점
  - 결과를 더 빠르게 얻어올 수 있는 장점
  - 이렇게 하려면 데이터 새성을 하고 소비하는 과정이 별개로 진행되어야 함
  - 이는 채널과 같은 핫 데이터 스트림의 전형적인 특징
  - 따라서 채널과 플로우를 합친 형태가 필요
- `channelFlow`

  - 플로우처럼 `Flow` 인터페이스를 구현하기 때문에 플로우가 가지는 특징을 제공
  - 채널 플로우 빌더는 일반 함수, `collect` 와 같은 최종 연산으로 시작됨
  - 한 번 시작하기만 하면 리시버를 기다릴 필요 없이 분리된 코루틴에서 값을 생성한다는 점이 채널과 비슷함

  ```kotlin
  data class UserInChannelFlowExample2(val name: String)

  interface UserApiInChannelFlowExample2 {
      suspend fun takePage(pageNumber: Int): List<UserInChannelFlowExample2>?
  }

  class FakeUserApiInChannelFlowExample2 : UserApiInChannelFlowExample2 {
      private val userInChannelFlowExample2s = List(20) { UserInChannelFlowExample2("User$it") }
      private val pageSize: Int = 3

      override suspend fun takePage(pageNumber: Int): List<UserInChannelFlowExample2> {
          delay(1000)
          return userInChannelFlowExample2s
              .drop(pageSize * pageNumber)
              .take(pageSize)
      }
  }

  fun allUsersFlowInChannelFlowExample2(api: UserApiInChannelFlowExample2): Flow<UserInChannelFlowExample2> =
      channelFlow {
          var page = 0
          do {
              println("Fetching page $page")
              val users = api.takePage(page++) // suspending
              users?.forEach { send(it) }
          } while (!users.isNullOrEmpty())
      }

  suspend fun main() {
      val api = FakeUserApiInChannelFlowExample2()
      val users = allUsersFlowInChannelFlowExample2(api)
      val user =
          users
              .first {
                  println("Checking $it")
                  delay(1000)
                  it.name == "User3"
              }
      println(user)
  }

  // Fetching page 0
  // (1 sec)
  // Checking UserInChannelFlowExample2(name=User0)
  // Fetching page 1
  // (1 sec)
  // Checking UserInChannelFlowExample2(name=User1)
  // Fetching page 2
  // (1 sec)
  // Checking UserInChannelFlowExample2(name=User2)
  // Fetching page 3
  // (1 sec)
  // Checking UserInChannelFlowExample2(name=User3)
  // Fetching page 4
  // (1 sec)
  // UserInChannelFlowExample2(name=User3)

  ```

  - `channelFlow` 는 `ProducerScope<T>` 에서 작동
  - `ProducerScope` 는 `produce` 빌더가 사용하는 것과 같은 타입
  - `ProducerScope` 는 `CoroutineScope` 를 구현했기 때문에 빌더에서 새로운 코루틴을 시작할 때 사용할 수 있음
  - 원소를 생성하려면 `emit` 대신에 `send` 를 사용함
  - 채널에 접근해 `SendChannel` 함수를 직접 조작할 수도 있음

  ```kotlin
  public interface ProducerScope<in E> : CoroutineScope, SendChannel<E> {
      /**
       * A reference to the channel this coroutine [sends][send] elements to.
       * It is provided for convenience, so that the code in the coroutine can refer
       * to the channel as `channel` as opposed to `this`.
       * All the [SendChannel] functions on this interface delegate to
       * the channel instance returned by this property.
       */
      public val channel: SendChannel<E>
  }
  ```

- 여러 개의 값을 독립적으로 계산해야 할 때 `channelFlow` 를 주로 사용함
- `channelFlow` 는 코루틴 스코프를 생성하여 `launch` 와 같은 코루틴 빌더를 직접 시작할 수 있음
- `flow` 는 코루틴 빌더가 필요로 하는 스코프를 만들지 못함
- 다른 코루틴처럼 `channelFlow` 도 모든 자식 코루틴이 종료 상태가 될 때까지 끝나지 않음

## 콜백플로우 (callbackFlow)

- 사용자의 클릭이나 활동 변화를 감지해야 하는 이벤트 플로우의 경우, 감지하는 프로세스는 이벤트를 처리하는 프로세스와 독립적이어야 하므로 `channelFlow` 를 사용해도 좋지만, 이 경우에는 `callbackFlow` 를 사용하는 것이 더 낫다.
- `channelFlow` 와 `callbackFlow` 의 가장 큰 차이점은 `callbackFlow` 가 콜백 함수를 래핑하는 방식으로 변경된 것
- `callbackFlow` 는 `ProducerScope<T>` 에서 작동
- 아래는 콜백을 처리하는데 유용한 몇 가지 함수
  - `awaitClose { … }`
  - `trySendBlocking(value)`
  - `close()`
  - `cancel(throwable)`

## 요약

- 플로우를 생성하는 여러 가지 방법에 대해 정리
