+++ 
draft = true
date = 2024-03-09T22:40:00+09:00
title = "[Kotlin Coroutines] 23장. 플로우 처리"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## Introduction

- **플로우 생성과 최종 연산 사이의 연산들을 플로우 처리 (flow processing) 이라고 함**

## map

- 플로우의 각 원소를 변환 함수에 따라 변환

```kotlin
suspend fun main() {
    flowOf(1, 2, 3) // [1, 2, 3]
        .map { it * it } // [1, 4, 9]
        .collect { print(it) } // 149
}
```

## filter

- 플로우에서 주어진 조건에 맞는 값들만 가진 플로우를 반환
- 관심 없는 원소를 제거할 때 주로 사용

```kotlin
suspend fun main() {
    (1..10).asFlow() // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        .filter { it <= 5 } // [1, 2, 3, 4, 5]
        .filter { isEven(it) } // [2, 4]
        .collect { print(it) } // 24
}

private fun isEven(num: Int): Boolean = num % 2 == 0
```

## take 와 drop

### take

- 특정 수의 원소만 통과

```kotlin
suspend fun main() {
    ('A'..'Z').asFlow()
        .take(5) // [A, B, C, D, E]
        .collect { print(it) } // ABCDE
}
```

### drop

- 특정 수의 원소를 무시

```kotlin
suspend fun main() {
    ('A'..'Z').asFlow()
        .drop(20) // [U, V, W, X, Y, Z]
        .collect { print(it) } // UVWXYZ
}
```

## 컬렉션 처리는 어떻게 작동할까?

- 아래는 플로우 처리 과정 및 map 과 flowOf 를 간단하게 구현한 예제

```kotlin
suspend fun main() {
    flowOf('a', 'b')
        .map { it.uppercase() }
        .collect { print(it) } // AB
}

private fun <T, R> Flow<T>.map(transform: suspend (value: T) -> R): Flow<R> =
    flow {
        collect { value ->
            emit(transform(value))
        }
    }

private fun <T> flowOf(vararg elements: T): Flow<T> =
    flow {
        for (element in elements) {
            emit(element)
        }
    }

```

- 단계별 분석

```kotlin
suspend fun main() {
    flow map@{ // 1
        flow flowOf@{ // 2
            for (element in arrayOf('a', 'b')) { // 3
                this@flowOf.emit(element) // 4
            }
        }.collect { value -> // 5
            this@map.emit(value.uppercase()) // 6
        }
    }.collect { // 7
        print(it) // 8
    }
}
```

## merge, zip, combine

### merge

- 두 개의 플로우에서 생성된 원소들을 하나로 합치는 것
- 어떤 변경도 필요 없으며, 플로우의 원소가 어디서부터 왔는지도 중요하지 않음
- merge 를 사용하면 한 플로우의 원소가 다른 플로우를 기다리지 않는다는 것이 중요
- 다음 예제에서 첫 번째 플로우의 원소 생성이 지연된다고 해서 두 번째 플로우의 원소 생성이 중단되지는 않음

```kotlin
suspend fun main() {
    val ints: Flow<Int> = flowOf(1, 2, 3)
    val doubles: Flow<Double> = flowOf(0.1, 0.2, 0.3)

    val together: Flow<Number> = merge(ints, doubles)
    print(together.toList())
    // [1, 2, 3, 0.1, 0.2, 0.3]
    // or [1, 0.1, 0.2, 0.3, 2, 3]
    // or [1, 0.1, 0.2, 0.3, 2, 3]
    // or [0.1, 1, 2, 3, 0.2, 0.3]
    // or any other combination
}
```

- 여러 개의 이벤트들을 똑같은 방법으로 처리할 때 사용

```kotlin
suspend fun main() {
    val ints: Flow<Int> =
        flowOf(1, 2, 3)
            .onEach { delay(1000) }
    val doubles: Flow<Double> = flowOf(0.1, 0.2, 0.3)

    val together: Flow<Number> = merge(ints, doubles)
    together.collect { println(it) }
}

// 0.1
// 0.2
// 0.3
// (1 sec)
// 1
// (1 sec)
// 2
// (1 sec)
// 3

```

### zip

- 두 플로우로부터 쌍을 만듦
- 원소가 쌍을 이루는 방법을 정하는 함수도 필요
- 각 원소는 한 쌍의 일부가 되므로 쌍이 될 원소를 기다려야 함
- 쌍을 이루지 못하고 남은 원소는 유실되므로, 한 플로우에서 zipping 이 완료되면 생성되는 플로우 또한 완료됨
  - 다른 플로우도 마찬가지

```kotlin
suspend fun main() {
    val flow1 =
        flowOf("A", "B", "C")
            .onEach { delay(400) }
    val flow2 =
        flowOf(1, 2, 3, 4)
            .onEach { delay(1000) }
    flow1.zip(flow2) { f1, f2 -> "${f1}_$f2" }
        .collect { println(it) }
}

// (1 sec)
// A_1
// (1 sec)
// B_2
// (1 sec)
// C_3

```

### combine

- zip 처럼 원소들로 쌍을 형성하기 때문에 첫 번째 쌍을 만들기 위해 느린 플로우를 기다려야 함
- combine 을 사용하면 모든 새로운 원소가 전임자를 대체하게 됨
- 첫 번째 쌍이 이미 만들어졌다면, 다른 플로우의 이전 원소와 함께 새로운 쌍이 만들어짐
- 두 플로우가 모두 닫힐 때까지 원소를 내보냄

```kotlin
suspend fun main() {
    val flow1 =
        flowOf("A", "B", "C")
            .onEach { delay(400) }
    val flow2 =
        flowOf(1, 2, 3, 4)
            .onEach { delay(1000) }
    flow1.combine(flow2) { f1, f2 -> "${f1}_$f2" }
        .collect { println(it) }
}

// (1 sec)
// B_1
// (0.2 sec)
// C_1
// (0.8 sec)
// C_2
// (1 sec)
// C_3
// (1 sec)
// C_4

```

- 두 데이터 소스의 변화를 능동적으로 감지할 때 주로 사용됨
- 변화가 발생할 때마다 원소가 내보내지길 원한다면 (첫 쌍을 가지도록) 합쳐질 각 플로우에 초기 값을 더하면 됨

## fold 와 scan

### fold

- 초기 값부터 시작하여 주어진 원소 각각에 대해 두 개의 값을 하나로 합치는 연산을 적용
- 컬렉션의 모든 값을 하나로 합침

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4)
    val res = list.fold(0) { acc, i -> acc + i }
    println(res) // 10
    val res2 = list.fold(1) { acc, i -> acc * i }
    println(res2) // 24
}
```

- fold 는 최종 연산
- 플로우에서도 사용할 수 있으며, collect 처럼 플로우가 완료될 때까지 중단됨

```kotlin
suspend fun main() {
    val list =
        flowOf(1, 2, 3, 4)
            .onEach { delay(1000) }
    val res = list.fold(0) { acc, i -> acc + i }
    println(res)
}

// (4 sec)
// 10
```

### scan

- 누적되는 과정의 모든 값을 생성하는 중간 연산

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4)
    val res = list.scan(0) { acc, i -> acc + i }
    println(res) // [0, 1, 3, 6, 10]
}

```

- 이전 단계에서 값을 받은 즉시 새로운 값을 만들기 때문에 Flow 에서 유용하게 사용됨

```kotlin
suspend fun main() {
    flowOf(1, 2, 3, 4)
        .onEach { delay(1000) }
        .scan(0) { acc, v -> acc + v }
        .collect { println(it) }
}

// 0
// (1 sec)
// 1
// (1 sec)
// 3
// (1 sec)
// 6
// (1 sec)
// 10
```

- 변경해야 할 사항을 플로우로 가지고 있으며, 변경 내역에 대한 객체가 필요할 때 주로 사용

## flatMapConcat, flapMapMerge, flatMapLatest

- flatMap
  - 변환 함수가 평탄화된 컬렉션을 반환해야 한다는 점이 다름
- 플로우에서 flapMap 은 어떻게 봐야 할까?
  - 변환 함수가 평탄화된 플로우를 반환한다고 생각하는 것이 직관적
  - 문제는 플로우 원소가 나오는 시간이 다르다는 것
  - 이런 이유 때문에 Flow 에는 flatMap 함수가 없으며, flatMapConcat, flapMapMerge, flatMapLatest 과 같은 다양한 함수가 있음

### flatMapConcat

- 생성된 플로우를 하나씩 처리
- 두 번째 플로우는 첫 번째 플로우가 완료되었을 때 시작할 수 있음

```kotlin
private fun flowFrom(elem: String) =
    flowOf(1, 2, 3)
        .onEach { delay(1000) }
        .map { "${it}_$elem " }

@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main() {
    flowOf("A", "B", "C")
        .flatMapConcat { flowFrom(it) }
        .collect { println(it) }
}

// (1 sec)
// 1_A
// (1 sec)
// 2_A
// (1 sec)
// 3_A
// (1 sec)
// 1_B
// (1 sec)
// 2_B
// (1 sec)
// 3_B
// (1 sec)
// 1_C
// (1 sec)
// 2_C
// (1 sec)
// 3_C

```

### flapMapMerge

- 만들어진 플로우를 동시에 처리

```kotlin
private fun flowFrom(elem: String) =
    flowOf(1, 2, 3)
        .onEach { delay(1000) }
        .map { "${it}_$elem " }

@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main() {
    flowOf("A", "B", "C")
        .flatMapMerge { flowFrom(it) }
        .collect { println(it) }
}

// (1 sec)
// 1_A
// 1_B
// 1_C
// (1 sec)
// 2_A
// 2_B
// 2_C
// (1 sec)
// 3_A
// 3_B
// 3_C

```

- concurrency 인자를 사용해 동시에 처리할 수 있는 플로우의 수를 설정 가능
- 인자의 기본 값은 16이지만, JVM 에서 DEFAULT_CONCURRENCY_PROPERTY_NAME 프로퍼티를 사용해 변경 가능
- 여러 개의 원소를 가진 플로우에서 flatMapMerge 를 사용하면 기본 값으로 제한되어 있어, 동시에 16개만 처리 가능하다는 걸 유념해야 함

```kotlin
private fun flowFrom(elem: String) =
    flowOf(1, 2, 3)
        .onEach { delay(1000) }
        .map { "${it}_$elem " }

@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main() {
    flowOf("A", "B", "C")
        .flatMapMerge(concurrency = 2) { flowFrom(it) }
        .collect { println(it) }
}

// (1 sec)
// 1_A
// 1_B
// (1 sec)
// 2_A
// 2_B
// (1 sec)
// 3_A
// 3_B
// (1 sec)
// 1_C
// (1 sec)
// 2_C
// (1 sec)
// 3_C

```

- 플로우의 각 원소에 대한 데이터를 요청할 때 주로 사용됨
- async 대신에 플로우와 함께 flatMapMerge 를 사용하면 두 가지 이점
  - 동시성 인자를 제어하고 (같은 시간에 수백 개의 요청을 보내는 걸 피하기 위해) 같은 시간에 얼마만큼의 종류를 처리할 지 결정할 수 있음
  - Flow 를 반환하여 데이터가 생성될 때마다 다음 원소를 내보낼 수 있음
    - 함수를 사용하는 측면에서 보면 데이터를 즉시 처리 가능

### flatMapLatest

- 새로운 플로우가 나타나면 이전에 처리하던 플로우를 잊어버림
- 새로운 값이 나올 때마다 이전 플로우처리는 사라져 버림

```kotlin
private fun flowFrom(elem: String) =
    flowOf(1, 2, 3)
        .onEach { delay(1000) }
        .map { "${it}_$elem " }

@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main() {
    flowOf("A", "B", "C")
        .flatMapLatest { flowFrom(it) }
        .collect { println(it) }
}

// (1 sec)
// 1_C
// (1 sec)
// 2_C
// (1 sec)
// 3_C

```

- 시작 플로우의 원소를 생성할 때 지연이 발생하면 더 재미있는 상황이 발생

```kotlin
private fun flowFrom(elem: String) =
    flowOf(1, 2, 3)
        .onEach { delay(1000) }
        .map { "${it}_$elem " }

@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main() {
    flowOf("A", "B", "C")
        .onEach { delay(1200) }
        .flatMapLatest { flowFrom(it) }
        .collect { println(it) }
}

// (2.2 sec)
// 1_A
// (1.2 sec)
// 1_B
// (1.2 sec)
// 1_C
// (1 sec)
// 2_C
// (1 sec)
// 3_C
```

## 재시도 (retry)

- 예외는 플로우를 따라 흐르면서 각 단계를 하나씩 종료
- 종료된 단계는 비활성화 되기 때문에, 예외가 발생한 뒤 메시지를 보내는 건 불가능하지만, 각 단계가 이전 단계에 대한 참조를 가지고 있으며, 플로우를 다시 시작하기 위해 참조를 사용할 수 있음
- 이 원리에 기반하여, retry, retryWhen 함수를 제공
- retry (source code)

```kotlin
public fun <T> Flow<T>.retry(
    retries: Long = Long.MAX_VALUE,
    predicate: suspend (cause: Throwable) -> Boolean = { true }
): Flow<T> {
    require(retries > 0) { "Expected positive amount of retries, but had $retries" }
    return retryWhen { cause, attempt -> attempt < retries && predicate(cause) }
}
```

- retryWhen (source code)

```kotlin
public fun <T> Flow<T>.retryWhen(predicate: suspend FlowCollector<T>.(cause: Throwable, attempt: Long) -> Boolean): Flow<T> =
    flow {
        var attempt = 0L
        var shallRetry: Boolean
        do {
            shallRetry = false
            val cause = catchImpl(this)
            if (cause != null) {
                if (predicate(cause, attempt)) {
                    shallRetry = true
                    attempt++
                } else {
                    throw cause
                }
            }
        } while (shallRetry)
    }

```

- retry example

```kotlin
@Suppress("UNREACHABLE_CODE")
suspend fun main() {
    flow {
        emit(1)
        emit(2)
        error("E")
        emit(3)
    }.retry(3) {
        print(it.message)
        true
    }.collect { print(it) } // 12E12E12E12(exception thrown)
}

```

## 중복 제거 함수

### distinctUntilChanged

- 반복되는 원소가 동일하다고 판단되면 제거하는 distinctUntilChanged 함수도 아주 유용
- **바로 이전의 원소와 동일한 원소만 제거**

```kotlin
suspend fun main() {
    flowOf(1, 2, 2, 3, 2, 1, 1, 3)
        .distinctUntilChanged()
        .collect { print(it) } // 123213
}

```

- distinctUntilChanged (source code)

```kotlin
public fun <T> Flow<T>.distinctUntilChanged(): Flow<T> =
    when (this) {
        is StateFlow<*> -> this // state flows are always distinct
        else -> distinctUntilChangedBy(keySelector = defaultKeySelector, areEquivalent = defaultAreEquivalent)
    }

```

```kotlin
private fun <T> Flow<T>.distinctUntilChangedBy(
    keySelector: (T) -> Any?,
    areEquivalent: (old: Any?, new: Any?) -> Boolean
): Flow<T> = when {
    this is DistinctFlowImpl<*> && this.keySelector === keySelector && this.areEquivalent === areEquivalent -> this // same
    else -> DistinctFlowImpl(this, keySelector, areEquivalent)
}
```

### distinctUntilChangedBy

- 두 원소가 동일한지 판단하기 위해 비교할 키 선택자를 인자로 받음
- distinctUntilChanged 는 람다 표현식을 받아 두 원소가 비교되는 방법을 정의함

```kotlin
private data class User(val id: Int, val name: String) {
    override fun toString(): String = "[$id] $name"
}

suspend fun main() {
    val users =
        flowOf(
            User(1, "Alex"),
            User(1, "Bob"),
            User(2, "Bob"),
            User(2, "Celine"),
        )

    println(users.distinctUntilChangedBy { it.id }.toList())
    // [[1] Alex, [2] Bob]
    println(users.distinctUntilChangedBy { it.name }.toList())
    // [[1] Alex, [1] Bob, [2] Celine]
    println(
        users.distinctUntilChanged { prev, next ->
            prev.id == next.id || prev.name == next.name
        }.toList(),
    ) // [[1] Alex, [2] Bob]
    // [2] Bob was emitted,
    // because we compare to the previous emitted
}

```

## 최종 연산

- 플로우 처리를 끝내는 연산
- 지금까지는 collect 만 사용했지만, count, first, firstOrNull, fold, reduce 또한 최종 연산
- 최종 연산은 중단 가능하며 플로우가 완료되었을 때 값을 반환
  - 또는 최종 연산 자체가 플로우를 완료시켰을 때

```kotlin
suspend fun main() {
    val flow =
        flowOf(1, 2, 3, 4) // [1, 2, 3, 4]
            .map { it * it } // [1, 4, 9, 16]

    println(flow.first()) // 1
    println(flow.count()) // 4

    println(flow.reduce { acc, value -> acc * value }) // 576
    println(flow.fold(0) { acc, value -> acc + value }) // 30
}

```

## 요약

- 플로우 처리를 잘 알아두자

## References

- https://flowmarbles.com/
