+++ 
date = 2024-02-17T21:50:00+09:00
title = "[Kotlin Coroutines] 17장. 셀렉트"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## introduction

- 코루틴은 가장 먼저 완료되는 코루틴의 결과를 기다리는 select 함수를 제공
- 또한 여러 개의 채널 중 버퍼에 남은 공간이 있는 채널을 먼저 확인하여 데이터를 보내거나, 이용 가능한 원소가 있는 채널로부터 데이터를 받을 수 있는지 여부도 확인 가능 `how?`
- 코루틴 사이에 경합을 일으키거나 `how?`, 여러 개의 데이터 소스로부터 나오는 결괏값을 합칠 수 도 있음
- select 는 여전히 실험용이라 변경될 수 있음

## 지연되는 값 선택하기

- 여러 개의 소스에서 데이터를 요청한 뒤, 가장 빠른 응답만 얻는 경우를 생각
- 가장 쉬운 방법
  - 요청을 여러 개의 비동기 프로세스로 시작한 뒤, select 함수를 표현식으로 사용하고 표현식 내부에서 값을 기다리는 것
  - select 내부에서는 셀렉트 표현식에서 나올 수 있는 결괏값을 명시하는 `Deferred` 값의 `onAwait` 함수를 호출
  - 람다식 내부에서 값을 변환할 수 도 있음

```kotlin
private suspend fun requestData1(): String {
    delay(100_000)
    return "Data1"
}

private suspend fun requestData2(): String {
    delay(1000)
    return "Data2"
}

private val scope = CoroutineScope(SupervisorJob())

private suspend fun askMultipleForData(): String {
    val defData1 = scope.async { requestData1() }
    val defData2 = scope.async { requestData2() }
    return select {
        defData1.onAwait { it }
        defData2.onAwait { it }
    }
}

suspend fun main(): Unit =
    coroutineScope {
        println(askMultipleForData())
    }

// (1 sec)
// Data2
```

- 비동기 결괏값 하나만 반환하는 걸 볼 수 있음
- select 표현식이 하나의 비동기 작업이 완료됨과 동시에 끝나게 되어 결괏값을 반환한다는 것을 알 수 있음
- 외부의 스코프로부터 async 가 시작됨

  - askMultipleForData 를 시작하는 코루틴을 취소하면, 외부의 스코프인 비동기 테스크는 취소가 되지 않음
  - 구현 방식에 문제가 있지만, 이것보다 나은 방식을 찾지 못함 `why?`
  - coroutineScope 를 사용하면 자식 코루틴도 기다리게 되며, 아래의 경우 10초 후에 결과 받음

    ```kotlin
    private suspend fun requestData1(): String {
        delay(10_000)
        return "Data1"
    }

    private suspend fun requestData2(): String {
        delay(1000)
        return "Data2"
    }

    private suspend fun askMultipleForData(): String =
        coroutineScope {
            select {
                async { requestData1() }.onAwait { it }
                async { requestData2() }.onAwait { it }
            }
        }

    suspend fun main(): Unit =
        coroutineScope {
            println(askMultipleForData())
        }

    // (10 sec)
    // Data2
    ```

    - repo 의 예제가 잘못 되어있음…

- async 와 select 를 사용하면 코루틴끼리 경합하는 상황을 쉽게 구현 가능, 하지만 스코프를 명시적으로 취소해야 함
- select 가 값을 생성하고 나서 also 를 호출한 뒤 다른 코루틴을 취소할 수 있음

```kotlin
private suspend fun requestData1(): String {
    delay(10_000)
    return "Data1"
}

private suspend fun requestData2(): String {
    delay(1000)
    return "Data2"
}

private suspend fun askMultipleForData(): String =
    coroutineScope {
        select {
            async { requestData1() }.onAwait { it }
            async { requestData2() }.onAwait { it }
        }.also { coroutineContext.cancelChildren() }
    }

suspend fun main(): Unit =
    coroutineScope {
        println(askMultipleForData())
    }

// (1 sec)
// Data2
```

- 위 해결책은 약간 복잡해서 헬퍼 함수를 사용하기도 함
  - raceOf 같은 메서드

## 채널에서 값 선택하기

- select 함수는 채널에서도 사용 가능
- 셀렉트 표현식에서 사용하는 주요 함수는 다음과 같음
- `onReceive`
  - 채널이 값을 가지고 있을 때 선택됨
  - (receive 메서드처럼) 값을 받은 뒤 람다식의 인자로 사용함
  - `onReceive` 가 선택되었을 때, `select` 는 람다식의 결괏값을 반환함
- `onReceiveCatching`
  - 채널이 값을 가지고 있거나 닫혔을 때 선택됨
  - 값을 나타내거나 채널이 닫혔다는 걸 알려주는 `ChannelResult` 를 받음
    - 이 값을 람다식의 인자로 사용함
  - `onReceiveCatching` 이 선택되었을 때, `select` 는 람다식의 결괏값을 반환함
- `onSend`
  - 채널의 버퍼에 공간이 있을 때 선택됨
  - 채널에 값을 보낸 뒤, 채널의 참조값으로 람다식을 수행함
  - `onSend` 이 선택되었을 때, `select` 는 Unit 을 반환함

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
private fun CoroutineScope.produceString( // <-- suspend 없어도 잘 실행됨
    s: String,
    time: Long,
) = produce {
    while (true) {
        delay(time)
        send(s)
    }
}

fun main() =
    runBlocking {
        val fooChannel = produceString("foo", 210L)
        val barChannel = produceString("BAR", 500L)

        repeat(7) {
            select {
                fooChannel.onReceive {
                    println("From fooChannel: $it")
                }
                barChannel.onReceive {
                    println("From barChannel: $it")
                }
            }
        }

        coroutineContext.cancelChildren()
    }

// From fooChannel: foo
// From fooChannel: foo
// From barChannel: BAR
// From fooChannel: foo
// From fooChannel: foo
// From barChannel: BAR
// From fooChannel: foo
```

- select 함수에서 onSend 를 호출하면 버퍼에 공간이 있는 채널을 선택해 데이터를 전송하는 용도로 사용 가능

```kotlin
fun main(): Unit =
    runBlocking {
        val c1 = Channel<Char>(capacity = 2)
        val c2 = Channel<Char>(capacity = 2)

        // Send values
        launch {
            for (c in 'A'..'H') {
                delay(400)
                select {
                    c1.onSend(c) { println("Sent $c to 1") }
                    c2.onSend(c) { println("Sent $c to 2") }
                }
            }
        }

        // Receive values
        launch {
            while (true) {
                delay(1000)
                val c =
                    select {
                        c1.onReceive { "$it from 1" }
                        c2.onReceive { "$it from 2" }
                    }
                println("Received $c")
            }
        }
    }

// Sent A to 1
// Sent B to 1
// Received A from 1
// Sent C to 1
// Sent D to 2
// Received B from 1
// Sent E to 1
// Sent F to 2
// Received C from 1
// Sent G to 1
// Received E from 1
// Sent H to 1
// Received G from 1
// Received H from 1
// Received D from 2
// Received F from 2
// (Not terminated)
```

## 요약

- select 는 가장 먼저 완료되는 코루틴의 결괏값을 기다릴 때나, 여러 개의 채널 중 전송 또는 수신 가능한 채널을 선택할 때 유용
- 주로 채널에서 동작하는 다양한 패턴을 구현할 때 사용하지만, async 코루틴의 경합을 구현할 때도 사용 가능
