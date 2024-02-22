+++ 
date = 2024-02-23T02:00:00+09:00
title = "[Kotlin Coroutines] 18장. 핫 데이터 소스와 콜드 데이터 소스"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## introduction

- 코틀린 코루틴은 처음에는 채널만 가지고 있었음
- 채널은 값을 ‘핫(hot)’ 스트림으로 가지지만, ‘콜드(cold)’ 스트림이 필요할 때가 있음
  - https://github.com/Kotlin/kotlinx.coroutines/issues/254
- 우리가 사용하는 대부분의 데이터 소스는 두 가지 종류로 구분할 수 있기 때문에
  - 핫 스트림 데이터와 콜드 스트림 데이터의 차이를 이해하는 것이 소프트웨어 측면에서 상당히 유용하다고 할 수 있음

| 핫                 | 콜드                |
| ------------------ | ------------------- |
| 컬렉션 (List, Set) | Sequence, Stream    |
| Channel            | Flow, RxJava 스트림 |

## 핫 vs 콜드

- 핫 데이터 스트림은 열정적이라 데이터를 소비하는 것과 무관하게 원소를 생성
- 콜드 데이터 스트림은 게을러서 요청이 있을 때만 작업을 수행하며 아무것도 저장하지 않음
- 리스트(hot)와 시퀀스(cold)를 사용할 때 그 차이가 드러남
- 핫 데이터 스트림의 빌더와 연산은 즉각 실행됨
- 콜드 데이터 스트림에서는 원소가 필요할 때까지 실행되지 않음

```kotlin
fun main() {
    val l =
        buildList {
            repeat(3) {
                add("User$it")
                println("L: Added User")
            }
        }

    val l2 =
        l.map {
            println("L: Processing")
            "Processed $it"
        }

    val s =
        sequence {
            repeat(3) {
                yield("User$it")
                println("S: Added User")
            }
        }

    val s2 =
        s.map {
            println("S: Processing")
            "Processed $it"
        }
}

// L: Added User
// L: Added User
// L: Added User
// L: Processing
// L: Processing
// L: Processing
```

- 그 결과 (Sequence, Stream 또는 Flow 와 같은) 콜드 데이터 스트림은
  - 무한할 수 있음
  - 최소한의 연산만 수행함
  - (중간에 생성되는 값들을 보관할 필요가 없기 때문에) 메모리를 적게 사용함
- Sequence 는 원소를 지연 처리하기 때문에 더 적은 연산을 수행
  - 중간 연산은 이전에 만든 시퀀스에 새로운 연산을 첨가할 뿐
  - 최종 연산이 모든 작업을 실행함

```kotlin
private fun m(i: Int): Int {
    print("m$i ")
    return i * i
}

private fun f(i: Int): Boolean {
    print("f$i ")
    return i >= 10
}

fun main() {
    listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
        .map { m(it) }
        .find { f(it) }
        .let { print(it) }
    // m1 m2 m3 m4 m5 m6 m7 m8 m9 m10 f1 f4 f9 f16 16

    println()

    sequenceOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
        .map { m(it) }
        .find { f(it) }
        .let { print(it) }
    // m1 f1 m2 f4 m3 f9 m4 f16 16
}
```

- 리스트는 원소의 컬렉션이지만, 시퀀스는 원소를 어떻게 계산할지 정의한 것에 불과함
- 핫 데이터 스트림은
  - 항상 사용 가능한 상태
    - 각 연산이 최종 연산이 될 수 있음
  - 여러 번 사용되었을 때 매번 결과를 다시 계산할 필요가 없음

```kotlin
private fun m(i: Int): Int {
    print("m$i ")
    return i * i
}

fun main() {
    val l =
        listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
            .map { m(it) } // m1 m2 m3 m4 m5 m6 m7 m8 m9 m10

    println(l) // [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
    println(l.find { it > 10 }) // 16
    println(l.find { it > 10 }) // 16
    println(l.find { it > 10 }) // 16

    val s =
        sequenceOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
            .map { m(it) }

    println(s.toList())
    // [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
    println(s.find { it > 10 }) // m1 m2 m3 m4 16
    println(s.find { it > 10 }) // m1 m2 m3 m4 16
    println(s.find { it > 10 }) // m1 m2 m3 m4 16
}
```

## 핫 채널, 콜드 플로우

- 플로우를 생성하는 가장 일반적인 방법은 produce 함수와 비슷한 형태의 빌더를 사용하는 것
- 이 빌더가 바로 `flow`

```kotlin
val channel = produce {
    while (true) {
        val x = computeNextValue()
        send(x)
    }
}

val flow = flow {
    while (true) {
        val x = computeNextValue()
        emit(x)
    }
}
```

- 두 빌더는 개념적으로 동일하지만, **채널과 플로우의 방식이 아주 다르기 때문에 두 함수에도 중요한 차이가 있음**

### 핫 채널

- 채널은 핫이라 값을 곧바로 계산
- 별도의 코루틴에서 계산을 수행
- 아래 예제에서 계산은 곧바로 시작되지만, (랑데뷰 채널이라) 버퍼의 기본 크기가 0이기 때문에 곧 중단되며, 수신자가 준비될 때까지 재개되지 않음
- 수신자가 없을 때 데이터 생성이 중단되는 것과 요청할 때 데이터 생성하는 것의 차이에 대해 알아야 함
- 채널은 핫 데이터 스트림이기 때문에 소비되는 것과 상관없이 값을 생성한 뒤에 가지게 됨
  - 수신자가 얼마나 많은지에 대해서는 신경 쓰지 않음
- 각 원소는 단 한 번만 받을 수 있기 때문에, 첫 번째 수신자가 모든 원소를 소비하고 나면 두 번째 소비자는 채널이 비어 있으며 이미 닫혀 있다는 걸 발견하게 됨
  - 따라서 두 번째 소비자는 어떤 원소도 받을 수가 없음

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
private fun CoroutineScope.makeChannel() =
    produce {
        println("Channel started")
        for (i in 1..3) {
            delay(1000)
            send(i)
        }
    }

suspend fun main() =
    coroutineScope {
        val channel = makeChannel()

        delay(1000)
        println("Calling channel...")
        for (value in channel) {
            println(value)
        }
        println("Consuming again...")
        for (value in channel) {
            println(value)
        }
    }

// Channel started
// (1 sec)
// Calling channel...
// 1
// (1 sec)
// 2
// (1 sec)
// 3
// Consuming again...
```

### 콜드 플로우

- 플로우는 콜드 데이터 소스이기 때문에 값이 필요할 때만 생성함
- **따라서 flow는 빌더가 아니며 어떤 처리도 하지 않음**
- 그래서 **flow 빌더는 CoroutineScope 가 필요하지 않음**
- flow 빌더는 빌더를 호출한 최종 연산의 스코프에서 실행됨
- 플로우의 각 최종 연산은 처음부터 데이터를 처리하기 시작함

```kotlin
private fun makeFlow() =
    flow {
        println("Flow started")
        for (i in 1..3) {
            delay(1000)
            emit(i)
        }
    }

suspend fun main() =
    coroutineScope {
        val flow = makeFlow()

        delay(1000)
        println("Calling flow...")
        flow.collect { value -> println(value) }
        println("Consuming again...")
        flow.collect { value -> println(value) }
    }

// (1 sec)
// Calling flow...
// Flow started
// (1 sec)
// 1
// (1 sec)
// 2
// (1 sec)
// 3
// Consuming again...
// Flow started
// (1 sec)
// 1
// (1 sec)
// 2
// (1 sec)
// 3
```

## 요약

- 대부분의 데이터 소스는 핫이거나 콜드
- 핫 데이터 소스
  - 열정적
  - 가능한 빨리 원소를 만들고 저장
  - 원소가 소비되는 것과 무관하게 생성함
  - 컬렉션 (List, Set) 과 Channel
- 콜드 데이터 소스
  - 게으름
  - 최종 연산에서 값이 필요할 때가 되어서야 처리
  - 중간 과정의 모든 함수는 무엇을 해야 할지만 정의한 것
    - 대부분 데코레이터 패턴을 사용
  - 일반적으로 원소를 저장하지 않으며 필요할 때 원소를 생성
  - 연산을 최소한으로 수행
    - 무한정일 수 있음
  - 원소의 생성과 소비는 대개 소비와 같은 과정으로 이뤄짐
  - Sequence, 자바의 Stream, Flow, (Observable, Single 과 같은) RxJava 스트림
