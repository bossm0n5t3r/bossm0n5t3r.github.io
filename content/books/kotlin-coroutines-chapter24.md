+++ 
date = 2024-03-24T15:35:00+09:00
title = "[Kotlin Coroutines] 24장. 공유 플로우와 상태 플로우"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## 공유 플로우

- 브로드캐스트 채널과 비슷한 MutableSharedFlow
- 공유 플로우를 통해 메시지를 보내면 (내보내면) 대기하고 있는 모든 코루틴이 수신하게 됨

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val mutableSharedFlow =
            MutableSharedFlow<String>(replay = 0)
        // or MutableSharedFlow<String>()

        launch {
            mutableSharedFlow.collect {
                println("#1 received $it")
            }
        }
        launch {
            mutableSharedFlow.collect {
                println("#2 received $it")
            }
        }

        delay(1000)
        mutableSharedFlow.emit("Message1")
        mutableSharedFlow.emit("Message2")
    }

// (1 sec)
// #2 received Message1
// #2 received Message2
// #1 received Message1
// #1 received Message2
// (program never ends)

```

- 자식 코루틴이 launch 로 시작된 뒤 MutableSharedFlow 를 감지하고 있어서 종료가 안됨
  - MutableSharedFlow 를 종료할 방법은 없으므로 프로그램을 종료하려면 전체 스코프를 취소하는 방법밖에 없음
- MutableSharedFlow 는 메시지를 보내는 작업을 유지할 수도 있음
- replay 인자 (default 0) 를 설정하면 마지막으로 전송한 값들이 정해진 수만큼 저장됨
- 코루틴이 감지를 시작하면 저장된 값들을 먼저 받게 됨
- resetReplayCache 를 사용하면 값을 저장한 캐시를 초기화할 수 있음

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main(): Unit =
    coroutineScope {
        val mutableSharedFlow =
            MutableSharedFlow<String>(
                replay = 2,
            )
        mutableSharedFlow.emit("Message1")
        mutableSharedFlow.emit("Message2")
        mutableSharedFlow.emit("Message3")

        println(mutableSharedFlow.replayCache)
        // [Message2, Message3]

        launch {
            mutableSharedFlow.collect {
                println("#1 received $it")
            }
            // #1 received Message2
            // #1 received Message3
        }

        delay(100)
        mutableSharedFlow.resetReplayCache()
        println(mutableSharedFlow.replayCache) // []
    }

```

- MutableSharedFlow 는 SharedFlow 와 FlowCollector 모두를 상속함

```kotlin
public interface MutableSharedFlow<T> : SharedFlow<T>, FlowCollector<T> {
    override suspend fun emit(value: T)
    public fun tryEmit(value: T): Boolean
    public val subscriptionCount: StateFlow<Int>
    @ExperimentalCoroutinesApi
    public fun resetReplayCache()
}

public interface SharedFlow<out T> : Flow<T> {
    public val replayCache: List<T>
    override suspend fun collect(collector: FlowCollector<T>): Nothing
}

public fun interface FlowCollector<in T> {
    public suspend fun emit(value: T)
}
```

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val mutableSharedFlow = MutableSharedFlow<String>()
        val sharedFlow: SharedFlow<String> = mutableSharedFlow
        val collector: FlowCollector<String> = mutableSharedFlow

        launch {
            mutableSharedFlow.collect {
                println("#1 received $it")
            }
        }

        launch {
            sharedFlow.collect {
                println("#2 received $it")
            }
        }

        delay(1000)
        mutableSharedFlow.emit("Message1")
        collector.emit("Message2")
    }

// (1 sec)
// #2 received Message1
// #2 received Message2
// #1 received Message1
// #1 received Message2

```

### shareIn

- 플로우는 사용자 액션, 데이터베이스 변경, 또는 새로운 메시지와 같은 변화를 감지할 때 주로 사용됨
- 다양한 클래스가 변화를 감지하는 상황에서 하나의 플로우로 여러 개의 플로우를 만들고 싶다면?
- SharedFlow 가 해결책이며, Flow → SharedFlow 로 바꾸는 가장 쉬운 방법이 shareIn 함수를 사용하는 것

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val flow =
            flowOf("A", "B", "C")
                .onEach { delay(1000) }

        val sharedFlow: SharedFlow<String> =
            flow.shareIn(
                scope = this,
                started = SharingStarted.Eagerly,
                // replay = 0 (default)
            )

        delay(500)

        launch {
            sharedFlow.collect { println("#1 $it") }
        }

        delay(1000)

        launch {
            sharedFlow.collect { println("#2 $it") }
        }

        delay(1000)

        launch {
            sharedFlow.collect { println("#3 $it") }
        }
    }

// (1 sec)
// #1 A
// (1 sec)
// #2 B
// #1 B
// (1 sec)
// #1 C
// #2 C
// #3 C

```

- shareIn 함수는 첫 번째 인자로 코루틴 스코프를 받음
- 세번째 인자로는 기본값이 0인 replay
- 두번째 인자 started 가 흥미로운데, 리스너의 수에 따라 값을 언제부터 감지할지 결정함

  - SharingStarted.Eagerly

    - 즉시 값을 감지하기 시작
    - 플로우로 값을 전송
    - replay 값에 제한이 있고, 감지를 시작하기 전에 값이 나오면 일부를 유실할 수 있음

    ```kotlin
    suspend fun main(): Unit =
        coroutineScope {
            val flow = flowOf("A", "B", "C")

            val sharedFlow: SharedFlow<String> =
                flow.shareIn(
                    scope = this,
                    started = SharingStarted.Eagerly,
                )

            delay(100)
            launch {
                sharedFlow.collect { println("#1 $it") }
            }
            print("Done")
        }

    // (0.1 sec)
    // Done

    ```

  - SharingStarted.Lazily

    - 첫번째 구독자가 나올 때 감시하기 시작함
    - 첫번째 구독자는 내보내진 모든 값을 수신하는 것이 보장되며, 이후의 구독자는 replay 수만큼 가장 최근에 저장된 값들을 받게 됨
    - 모든 구독자가 사라져도 업스트림 (데이터를 방출하는) 플로우는 액티브 상태지만, 구독자가 없으면 replay 수만큼 가장 최근의 값들만 캐싱함

    ```kotlin
    suspend fun main(): Unit =
        coroutineScope {
            val flow1 = flowOf("A", "B", "C")
            val flow2 =
                flowOf("D")
                    .onEach { delay(1000) }

            val sharedFlow =
                merge(flow1, flow2).shareIn(
                    scope = this,
                    started = SharingStarted.Lazily,
                )

            delay(100)
            launch {
                sharedFlow.collect { println("#1 $it") }
            }
            delay(1000)
            launch {
                sharedFlow.collect { println("#2 $it") }
            }
        }

    // (0.1 sec)
    // #1 A
    // #1 B
    // #1 C
    // (1 sec)
    // #2 D
    // #1 D

    ```

  - WhileSubscribed()
    - 첫번째 구독자가 나올 때 감시하기 시작함
    - 마지막 구독자가 사라지면 플로우도 멈춤
      - 마지막 구독자가 사라지고 난 뒤 감지할 시간을 나타내는 파라미터 (stopTimeoutMillis)
      - 멈춘 뒤 리플레이 값을 가지고 있는 시간을 나타내는 파라미터 (replayExpirationMillis)
  - SharingStarted 인터페이스를 구현하여 커스텀화된 전략을 정의하는 것도 가능

  ```kotlin
  suspend fun main(): Unit =
      coroutineScope {
          val flow =
              flowOf("A", "B", "C", "D")
                  .onStart { println("Started") }
                  .onCompletion { println("Finished") }
                  .onEach { delay(1000) }

          val sharedFlow =
              flow.shareIn(
                  scope = this,
                  started = SharingStarted.WhileSubscribed(),
              )

          delay(3000)
          launch {
              println("#1 ${sharedFlow.first()}")
          }
          launch {
              println("#2 ${sharedFlow.take(2).toList()}")
          }
          delay(3000)
          launch {
              println("#3 ${sharedFlow.first()}")
          }
      }

  // (3 sec)
  // Started
  // (1 sec)
  // #1 A
  // (1 sec)
  // #2 [A, B]
  // Finished
  // (1 sec)
  // Started
  // (1 sec)
  // #3 A
  // Finished

  ```

- 동일한 변화를 감지하려고 하는 서비스가 여러 개일 때 shareIn 을 사용하면 편리함

## 상태 플로우

- 상태플로우는 공유플로우의 개념을 확장시킨 것
- replay 인자 값이 1인 공유플로우와 비슷하게 작동함
- 상태플로우는 value 프로퍼티로 접근 가능한 값 하나를 항상 가지고 있음
  - 초기 값은 생성자를 통해 전달되어야 함
  - value 프로퍼티로 값을 얻어올 수도 있고 설정할 수도 있음

```kotlin
public interface StateFlow<out T> : SharedFlow<T> {
    /**
     * The current value of this state flow.
     */
    public val value: T
}

public interface MutableStateFlow<T> : StateFlow<T>, MutableSharedFlow<T> {
    public override var value: T
    public fun compareAndSet(expect: T, update: T): Boolean
}
```

- MutableStateFlow 는 값을 감지할 수 있는 보관소
- 상태플로우는 데이터가 덮어 씌워지기 때문에, 관찰이 느린 경우 상태의 중간 변화를 받을 수 없는 경우도 있음
  - 모든 이벤트를 다 받으려면 공유플로우를 사용해야 함

```kotlin
suspend fun main() =
    coroutineScope {
        val state = MutableStateFlow("A")
        println(state.value) // A
        launch {
            state.collect { println("Value changed to $it") }
            // Value changed to A
        }

        delay(1000)
        state.value = "B" // Value changed to B

        delay(1000)
        launch {
            state.collect { println("and now it is $it") }
            // and now it is B
        }

        delay(1000)
        state.value = "C" // Value changed to C and now it is C
    }

```

### stateIn

- stateIn 은 Flow<T> 를 StateFlow<T> 로 변환하는 함수
- 스코프에서만 호출 가능하지만 중단 함수이기도 함
- StateFlow 는 항상 값을 가져야 하기 때문에 값을 명시하지 않았을 때는 첫 번째 값이 계산될 때까지 기다려야 함

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val flow =
            flowOf("A", "B", "C")
                .onEach { delay(1000) }
                .onEach { println("Produced $it") }
        val stateFlow: StateFlow<String> = flow.stateIn(this)

        println("Listening")
        println(stateFlow.value)
        stateFlow.collect { println("Received $it") }
    }

// (1 sec)
// Produced A
// Listening
// A
// Received A
// (1 sec)
// Produced B
// Received B
// (1 sec)
// Produced C
// Received C

```

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val flow =
            flowOf("A", "B")
                .onEach { delay(1000) }
                .onEach { println("Produced $it") }

        val stateFlow: StateFlow<String> =
            flow.stateIn(
                scope = this,
                started = SharingStarted.Lazily,
                initialValue = "Empty",
            )

        println(stateFlow.value)

        delay(2000)
        stateFlow.collect { println("Received $it") }
    }

// Empty
// (2 sec)
// Received Empty
// (1 sec)
// Produced A
// Received A
// (1 sec)
// Produced B
// Received B

```

- 하나의 데이터 소스에서 값이 변경된 걸 감지하는 경우에 주로 stateIn 함수를 사용함

## 요약

- 안드로이드 개발자에게 특히 중요함
