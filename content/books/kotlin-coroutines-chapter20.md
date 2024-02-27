+++ 
date = 2024-02-23T02:05:00+09:00
title = "[Kotlin Coroutines] 20장. 플로우의 실제 구현"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## introduction

- **플로우는 어떤 연산을 실행할 지 정의한 것**
- 중단 가능한 람다식에 몇 가지 요소를 추가한 거라고 생각하면 됨

## Flow 이해하기

- 간단한 람다식
- 각 람다식은 한 번만 정의되고 여러 번 호출할 수 있음

```kotlin
fun main() {
    val f: () -> Unit = {
        print("A")
        print("B")
        print("C")
    }
    f() // ABC
    f() // ABC
}
```

- 좀 더 재미있게 하기 위해 내부에 지연이 있는 람다식 `suspend` 를 만들어보자
- 람다식은 순차적으로 호출되기 때문에, 이전 호출이 완료되기 전에 같은 람다식을 추가적으로 호출할 수 없음

```kotlin
suspend fun main() {
    val f: suspend () -> Unit = {
        print("A")
        delay(1000)
        print("B")
        delay(1000)
        print("C")
    }
    f()
    f()
}
// A
// (1 sec)
// B
// (1 sec)
// C
// A
// (1 sec)
// B
// (1 sec)
// C
```

- 람다식은 함수를 나타내는 파라미터를 가질 수 있음
- 이 파라미터를 `emit` 이라고 해보자
- 람다식 `f` 를 호출할 때 `emit` 으로 사용될 또 다른 람다식을 명시해야 함

```kotlin
suspend fun main() {
    val f: suspend ((String) -> Unit) -> Unit = { emit ->
        emit("A")
        emit("B")
        emit("C")
    }
    f { print(it) } // ABC
    f { print(it) } // ABC
}
```

- 이 때 `emit` 은 중단 함수가 되어야 함
- 함수형이 많이 복잡해진 상태이므로, `emit` 이라는 추상 메서드를 가진 `FlowCollector` 함수형 인터페이스를 정의해 간단히 만들어 보자
- 이제 복잡한 함수형 대신 함수형 인터페이스를 사용하면 됨
- 함수형 인터페이스는 람다식으로 정의할 수 있으므로 `f` 호출을 바꿀 필요가 없음

```kotlin
fun interface FlowCollector {
    suspend fun emit(value: String)
}

suspend fun main() {
    val f: suspend (FlowCollector) -> Unit = {
        it.emit("A")
        it.emit("B")
        it.emit("C")
    }
    f { print(it) } // ABC <-- 여기는 그대로
    f { print(it) } // ABC <-- 여기는 그대로
}
```

- `it` 에서 `emit` 을 호출하는 것 또한 불편 → `FlowCollector` 를 **리시버**로 만들자
  - 이렇게 하면 람다식 내부에 `FlowCollector` 타입의 (`this` 로 지정 가능한) **리시버가 생김**
- 이제 `this.emit` 또는 `emit` 만 호출하면 됨
  - `f` 를 실행하는 방법은 여전히 동일

```kotlin
fun interface FlowCollector {
    suspend fun emit(value: String)
}

suspend fun main() {
    val f: suspend FlowCollector.() -> Unit = {
        emit("A")
        emit("B")
        emit("C")
    }
    f { print(it) } // ABC
    f { print(it) } // ABC
}
```

- 람다식을 전달 → 인터페이스를 구현한 객체를 만드는 편이 나음
- 이때 인터페이스를 `Flow` 라 하고, 해당 인터페이스의 정의는 객체 표현식으로 래핑하면 됨

```kotlin
fun interface FlowCollector {
    suspend fun emit(value: String)
}

interface Flow {
    suspend fun collect(collector: FlowCollector)
}

suspend fun main() {
    val builder: suspend FlowCollector.() -> Unit = {
        emit("A")
        emit("B")
        emit("C")
    }
    val flow: Flow = object : Flow {
        override suspend fun collect(
            collector: FlowCollector
        ) {
            collector.builder()
        }
    }
    flow.collect { print(it) } // ABC
    flow.collect { print(it) } // ABC
}
```

- 마지막으로 플로우 생성을 간단하게 만들기 위해 `flow` 빌더를 정의

```kotlin
fun interface FlowCollector {
    suspend fun emit(value: String)
}

interface Flow {
    suspend fun collect(collector: FlowCollector)
}

fun flow(
    builder: suspend FlowCollector.() -> Unit
) = object : Flow {
    override suspend fun collect(collector: FlowCollector) {
        collector.builder()
    }
}

suspend fun main() {
    val f: Flow = flow {
        emit("A")
        emit("B")
        emit("C")
    }
    f.collect { print(it) } // ABC
    f.collect { print(it) } // ABC
}
```

- 마지막으로 타입에 상관없이 값을 방출하고 모으기 위해 `String` 을 제네릭 타입으로 바꿈

```kotlin
fun interface FlowCollector<T> {
    suspend fun emit(value: T)
}

interface Flow<T> {
    suspend fun collect(collector: FlowCollector<T>)
}

fun <T> flow(
    builder: suspend FlowCollector<T>.() -> Unit
) = object : Flow<T> {
    override suspend fun collect(
        collector: FlowCollector<T>
    ) {
        collector.builder()
    }
}

suspend fun main() {
    val f: Flow<String> = flow {
        emit("A")
        emit("B")
        emit("C")
    }
    f.collect { print(it) } // ABC
    f.collect { print(it) } // ABC
}
```

- 이제 됐다.
  - 위에서 플로우를 구현한 방식은 `Flow`, `FlowCollector`, `flow` 가 실제 구현한 방식과 거의 동일
- `collect` 를 호출하면, `flow` 빌더를 호출할 때 넣은 람다식이 실행됨
- 빌더의 람다식이 `emit` 을 호출하면 `collect` 가 호출되었을 때 명시된 람다식이 실행됨
- 이것이 플로우가 작동하는 원리
- 빌더는 플로우를 생성하는 가장 기본적인 방법
  - 다른 빌더 또한 내부에서 flow 를 사용함

```kotlin
public fun <T> Iterator<T>.asFlow(): Flow<T> = flow {
    forEach { value ->
        emit(value)
    }
}

public fun <T> Sequence<T>.asFlow(): Flow<T> = flow {
    forEach { value ->
        emit(value)
    }
}

public fun <T> flowOf(vararg elements: T): Flow<T> = flow {
    for (element in elements) {
        emit(element)
    }
}
```

## Flow 처리 방식

- **플로우의 강력한 점은 플로우를 생성하고, 처리하고, 그리고 감지하기 위해 정의한 함수에서 찾을 수 있음**
- 플로우의 각 원소를 변환하는 map 함수
  - 이 함수는 새로운 플로우를 만들기 때문에, flow 빌더를 사용
  - 플로우가 시작되면 래핑하고 있는 플로우를 시작하게 되므로, 빌더 내부에서 collect 메서드를 호출함
  - 원소를 받을 때마다, map 은 원소를 변환하고 새로운 플로우로 방출함

```kotlin
private fun <T, R> Flow<T>.map(transformation: suspend (T) -> R): Flow<R> =
    flow {
        collect {
            emit(transformation(it))
        }
    }

suspend fun main() {
    flowOf("A", "B", "C")
        .map {
            delay(1000)
            it.lowercase()
        }
        .collect { println(it) }
}

// (1 sec)
// a
// (1 sec)
// b
// (1 sec)
// c
```

- 플로우의 원리를 이해하면 다음 장에서 배울 대부분의 코드가 어떻게 작동하는지 쉽게 이해 할 수 있고, 비슷한 함수를 작성하는 데 도움이 됨

```kotlin
fun <T> Flow<T>.filter(
    predicate: suspend (T) -> Boolean
): Flow<T> = flow {
    collect {
        if (predicate(it)) {
            emit(it)
        }
    }
}

fun <T> Flow<T>.onEach(
    action: suspend (T) -> Unit
): Flow<T> = flow {
    collect {
        action(it)
        emit(it)
    }
}

// simplified implementation
fun <T> Flow<T>.onStart(
    action: suspend () -> Unit
): Flow<T> = flow {
    action()
    collect {
        emit(it)
    }
}
```

## 동기로 작동하는 Flow

- 플로우 또한 중단 함수처럼 동기로 작동
  - 플로우가 완료될 때까지 collect 호출이 중단됨
  - **즉, 플로우는 새로운 코루틴을 시작하지 않음**
- 중단 함수가 코루틴을 시작할 수 있는 것처럼, 플로우의 각 단계에서도 코루틴을 시작할 수 있지만, 중단 함수의 기본 동작은 아님
- **플로우에서 각각의 처리 단계는 동기로 실행되기 때문에, onEach 내부에 delay 가 있으면 모든 원소가 처리되기 전이 아닌 각 원소 사이에 지연이 생김**

```kotlin
suspend fun main() {
    flowOf("A", "B", "C")
        .onEach { delay(1000) }
        .collect { println(it) }
}
// (1 sec)
// A
// (1 sec)
// B
// (1 sec)
// C
```

## 플로우와 공유 상태

- 플로우 처리를 통해 좀 더 복잡한 알고리즘을 구현할 때는 언제 변수에 대한 접근을 동기화해야 하는지 알아야 함
- 가장 중요한 예제
  - 커스텀한 플로우 처리 함수를 구현할 때, 플로우의 각 단계가 동기로 작동하기 때문에 동기화 없이도 플로우 내부에 변경 가능한 상태를 정의할 수 있음
  ```kotlin
  fun <T, K> Flow<T>.distinctBy(
      keySelector: (T) -> K
  ) = flow {
      val sentKeys = mutableSetOf<K>()
      collect { value ->
          val key = keySelector(value)
          if (key !in sentKeys) {
              sentKeys.add(key)
              emit(value)
          }
      }
  }
  ```
- 다음은 플로우 단계에서 사용되는 예제

  - 일정한 결괏값을 생성함
  - 카운터 변수가 항상 1000 으로 증가함

  ```kotlin
  fun Flow<*>.counter() = flow<Int> {
      var counter = 0
      collect {
          counter++
          // to make it busy for a while
          List(100) { Random.nextLong() }.shuffled().sorted()
          emit(counter)
      }
  }

  suspend fun main(): Unit = coroutineScope {
      val f1 = List(1000) { "$it" }.asFlow()
      val f2 = List(1000) { "$it" }.asFlow()
          .counter()




      launch { println(f1.counter().last()) } // 1000
      launch { println(f1.counter().last()) } // 1000
      launch { println(f2.last()) } // 1000
      launch { println(f2.last()) } // 1000
  }
  ```

- 플로우 단계 외부의 변수를 추출해서 함수에서 사용하는 것이 흔히 저지르는 실수 중 하나
- 외부 변수는 같은 플로우가 모으는 모든 코루틴이 공유하게 됨
- 이런 경우 동기화가 필수이며, 플로우 컬렉션이 아니라 플로우에 종속되게 됨
- 따라서 두 개의 코루틴이 병렬로 원소를 세게 되고, f2.last() 는 1000 이 아니라 2000을 반환하게 됨

```kotlin
fun Flow<*>.counter(): Flow<Int> {
    var counter = 0
    return this.map {
        counter++
        // to make it busy for a while
        List(100) { Random.nextLong() }.shuffled().sorted()
        counter
    }
}

suspend fun main(): Unit = coroutineScope {
    val f1 = List(1_000) { "$it" }.asFlow()
    val f2 = List(1_000) { "$it" }.asFlow()
        .counter()

    launch { println(f1.counter().last()) } // 1000
    launch { println(f1.counter().last()) } // 1000
    launch { println(f2.last()) } // less than 2000
    launch { println(f2.last()) } // less than 2000
}
```

- 마지막으로 같은 변수를 사용하는 중단 함수들에서 동기화가 필요한 것처럼, 플로우에서 사용하는 변수가 함수 외부, 클래스의 스코프, 최상위 레벨에서 정의되어 있으면 동기화가 필요함

```kotlin
var counter = 0

fun Flow<*>.counter(): Flow<Int> = this.map {
    counter++
    // to make it busy for a while
    List(100) { Random.nextLong() }.shuffled().sorted()
    counter
}

suspend fun main(): Unit = coroutineScope {
    val f1 = List(1_000) { "$it" }.asFlow()
    val f2 = List(1_000) { "$it" }.asFlow()
        .counter()

    launch { println(f1.counter().last()) } // less than 4000
    launch { println(f1.counter().last()) } // less than 4000
    launch { println(f2.last()) } // less than 4000
    launch { println(f2.last()) } // less than 4000
}
```

## 요약

- Flow 는 리시버를 가진 중단 람다식보다 조금 더 복잡하다고 볼 수 있음
- 플로우의 처리 함수들은 플로우를 새로운 연산으로 데코레이트함
- Flow 와 플로우의 메서드가 정의된 방식은 간단하고 직관적이기 때문에 가능한 일
