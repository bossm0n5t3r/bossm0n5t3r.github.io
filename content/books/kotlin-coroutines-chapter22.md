+++ 
date = 2024-03-02T04:20:00+09:00
title = "[Kotlin Coroutines] 22장. 플로우 생존주기 함수"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## Introduction

- 플로우는 요청이 한쪽 방향으로 흐르고 요청에 의해 생성된 값이 다른 방향으로 흐르는 파이프
- 플로우가 완료되거나 예외가 발생했을 때, 이러한 정보가 전달되어 중단 단계가 종료됨
- 모든 정보가 플로우로 전달되므로, 값, 예외 및 (시작 또는 완료와 같은) 다른 특정 이벤트를 감지할 수 있음

## onEach

- 플로우의 값을 하나씩 받을 때

```kotlin
suspend fun main() {
    flowOf(1, 2, 3, 4)
        .onEach { print(it) }
        .collect {} // 1234
}
```

- onEach 에 중단함수를 넣으면 각각의 값이 흐를 때마다 지연됨

```kotlin
suspend fun main() {
    flowOf(1, 2)
        .onEach { delay(1000) }
        .collect { println(it) }
}

// (1 sec)
// 1
// (1 sec)
// 2

```

## onStart

- 플로우가 시작되는 경우에 호출되는 리스너를 설정
- 첫 번째 원소가 생성되는걸 기다렸다 호출되는게 아니라는 것이 중요
- 첫 번째 원소를 요청했을 때 호출되는 함수

```kotlin
suspend fun main() {
    flowOf(1, 2)
        .onEach { delay(1000) }
        .onStart { println("Before") }
        .collect { println(it) }
}

// Before
// (1 sec)
// 1
// (1 sec)
// 2

```

- onStart 에서도 원소를 내보낼 수 있음
  - 원소들은 onStart 부터 아래로 흐르게 됨

```kotlin
suspend fun main() {
    flowOf(1, 2)
        .onEach { delay(1000) }
        .onStart { emit(0) }
        .collect { println(it) }
}

// 0
// (1 sec)
// 1
// (1 sec)
// 2

```

## onCompletion

- 플로우를 완료할 수 있는 가장 흔한 방법은 플로우 빌더가 끝났을 때
  - 예를 들어 마지막 원소가 전송되었을 때
- onCompletion 메서드를 사용해 플로우가 완료되었을 때 호출되는 리스너를 추가할 수 있음

```kotlin
suspend fun main() =
    coroutineScope {
        flowOf(1, 2)
            .onEach { delay(1000) }
            .onCompletion { println("Completed") }
            .collect { println(it) }
    }

// (1 sec)
// 1
// (1 sec)
// 2
// Completed
```

## onEmpty

- 원소를 내보내기 전에 플로우가 완료되면 실행
- 기본 값을 내보내기 위한 목적으로 사용될 수 있음

```kotlin
suspend fun main() =
    coroutineScope {
        flow<List<Int>> { delay(1000) }
            .onEmpty { emit(emptyList()) }
            .collect { println(it) }
    }

// (1 sec)
// []

```

## catch

- 플로우를 만들거나 처리하는 도중에 예외가 발생할 수 있음
- 예외가 발생하면 아래로 흐르면서 처리하는 단계를 하나씩 닫음
- catch 메서드의 경우 예외를 잡고 관리할 수도 있음
- 리스너는 예외를 인자로 받고, 정리를 위한 연산을 수행할 수 있음

```kotlin
private class MyError : Throwable("My error")

private val flowInCatch1: Flow<Int> =
    flow {
        emit(1)
        emit(2)
        throw MyError()
    }

suspend fun main() {
    flowInCatch1
        .onEach { println("Got $it") }
        .catch { println("Caught $it") }
        .collect { println("Collected $it") }
}

// Got 1
// Collected 1
// Got 2
// Collected 2
// Caught MyError: My error

```

- onEach 는 예외에 반응하지 않고, 오직 onCompletion 핸들러만 예외가 발생했을 때 호출됨
- catch 메서드는 예외를 잡아 전파되는 걸 멈춤
  - 이전 단계는 이미 완료된 상태지만, catch 는 새로운 값을 여전히 내보낼 수 있어 남은 플로우를 지속할 수 있음

```kotlin
private class MyErrorInCatch2 : Throwable("My error")

private val flowInCatch2 =
    flow {
        emit("Message1")
        throw MyErrorInCatch2()
    }

suspend fun main() {
    flowInCatch2
        .catch { emit("Error") }
        .collect { println("Collected $it") }
}

// Collected Message1
// Collected Error

```

- catch 함수의 윗부분에서 던진 예외에만 반응함
- 예외는 아래로 흐를 때 잡는다고 생각하면 됨

## 잡히지 않은 예외

- 플로우에서 잡히지 않은 예외는 플로우를 즉시 취소함
- collect 는 예외를 다시 던짐
- 중단 함수가 예외를 처리하는 방식과 같으며, coroutineScope 또한 같은 방식으로 예외를 처리함
- 플로우 바깥에서 전통적인 try-catch 블록을 사용해서 예외를 잡을 수도 있음

```kotlin
private class MyErrorInUncaughtExceptions1 : Throwable("My error")

private val flowInUncaughtExceptions1 =
    flow {
        emit("Message1")
        throw MyErrorInUncaughtExceptions1()
    }

suspend fun main() {
    try {
        flowInUncaughtExceptions1.collect { println("Collected $it") }
    } catch (e: MyErrorInUncaughtExceptions1) {
        println("Caught")
    }
}

// Collected Message1
// Caught

```

- catch 를 사용하는 건 (마지막 연산 뒤에 catch 가 올 수 없기 때문에) 최종 연산에서 발생한 예외를 처리하는데 전혀 도움이 되지 않음
- 따라서 collect 에서 예외가 발생하면 예외를 잡지 못하게 되어 블록 밖으로 예외가 전달됨

```kotlin
private class MyErrorInUncaughtExceptions2 : Throwable("My error")

private val flowInUncaughtExceptions2 =
    flow {
        emit("Message1")
        emit("Message2")
    }

suspend fun main() {
    flowInUncaughtExceptions2
        .onStart { println("Before") }
        .catch { println("Caught $it") }
        .collect { throw MyErrorInUncaughtExceptions2() }
}

// Before
// Exception in thread "..." MyError: My error

```

- 그러므로 collect 의 연산을 onEach 로 옮기고, catch 이전에 두는 방법이 자주 사용됨
  - collect 가 예외를 발생시킬 여지가 있다면 특히 유용
- collect 의 연산을 옮긴다면 catch 가 모든 예외를 잡을 거라고 확신할 수 있음

```kotlin
private class MyErrorInUncaughtExceptions3 : Throwable("My error")

private val flowInUncaughtExceptions3 =
    flow {
        emit("Message1")
        emit("Message2")
    }

suspend fun main() {
    flowInUncaughtExceptions3
        .onStart { println("Before") }
        .onEach { throw MyErrorInUncaughtExceptions3() }
        .catch { println("Caught $it") }
        .collect {}
}

// Before
// Caught MyError: My error

```

## flowOn

- 플로우 함수들은 collect 가 호출되는 곳의 컨텍스트를 얻어온다.

```kotlin
private fun usersFlow(): Flow<String> =
    flow {
        repeat(2) {
            val ctx = currentCoroutineContext()
            val name = ctx[CoroutineName]?.name
            emit("User$it in $name")
        }
    }

suspend fun main() {
    val users = usersFlow()
    withContext(CoroutineName("Name1")) {
        users.collect { println(it) }
    }
    withContext(CoroutineName("Name2")) {
        users.collect { println(it) }
    }
}

// User0 in Name1
// User1 in Name1
// User0 in Name2
// User1 in Name2

```

- 최종 연산을 호출하면 상위에 있는 모든 원소를 요청하면서 코루틴 컨텍스트를 전달
- 하지만 flowOn 함수로 컨텍스트를 변경할 수도 있음

```kotlin
private suspend fun present(
    place: String,
    message: String,
) {
    val ctx = coroutineContext
    val name = ctx[CoroutineName]?.name
    println("[$name] $message on $place")
}

private fun messagesFlow(): Flow<String> =
    flow {
        present("flow builder", "Message")
        emit("Message")
    }

suspend fun main() {
    val users = messagesFlow()
    withContext(CoroutineName("Name1")) {
        users
            .flowOn(CoroutineName("Name3"))
            .onEach { present("onEach", it) }
            .flowOn(CoroutineName("Name2"))
            .collect { present("collect", it) }
    }
}

// [Name3] Message on flow builder
// [Name2] Message on onEach
// [Name1] Message on collect

```

- flowOn 은 플로우에서 윗부분에 있는 함수에서만 작동하는걸 기억해야 함

## launchIn

- collect 는 플로우가 완료될 때까지 코루틴을 중단하는 중단 연산
- launch 빌더로 collect 를 래핑하면 플로우를 다른 코루틴에서 처리할 수 있음
- 플로우의 확장 함수인 launchIn 을 사용하면 유일한 인자로 스코프를 받아 collect 를 새로운 코루틴에서 시작할 수 있음

```kotlin
public fun <T> Flow<T>.launchIn(scope: CoroutineScope): Job = scope.launch {
    collect() // tail-call
}
```

- 별도의 코루틴에서 플로우를 시작하기 위해 launchIn 을 주로 사용

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        flowOf("User1", "User2")
            .onStart { println("Users:") }
            .onEach { println(it) }
            .launchIn(this)
    }

// Users:
// User1
// User2

```

## 요약

- 플로우의 여러 가지 기능에 대해 정리
