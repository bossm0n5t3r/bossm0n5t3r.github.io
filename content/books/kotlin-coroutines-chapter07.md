+++ 
date = 2024-01-06T23:40:21+09:00
title = "[Kotlin Coroutines] 7장. 코루틴 컨텍스트" 
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## 개요

- CoroutineScope 는 코루틴 빌더의 정의에서 리시버뿐만 아니라 마지막 인자의 리시버
- 중요한 개념처럼 보이니 정의를 확인

```kotlin
public interface CoroutineScope {
    /**
     * The context of this scope.
     * Context is encapsulated by the scope and used for implementation of coroutine builders that are extensions on the scope.
     * Accessing this property in general code is not recommended for any purposes except accessing the [Job] instance for advanced usages.
     *
     * By convention, should contain an instance of a [job][Job] to enforce structured concurrency.
     */
    public val coroutineContext: CoroutineContext
}
```

- CoroutineContext 를 감싸는 래퍼처럼 보임
- Continuation 또한 CoroutineContext 를 포함
- 코틀린 코루틴에서 가장 중요한 요소들이 CoroutineContext 를 사용하고 있는 걸 알 수 있음
- 도대체 뭘까?

## CoroutineContext 인터페이스

- CoroutineContext 는 원소나 원소들의 집합을 나타내는 인터페이스
- Collection 이랑 개념이 비슷
- 특이한 점은 각 Element 또한 CoroutineContext
  - 따라서 컬랙션 내 모든 원소는 그 자체 만으로 컬렉션이라 할 수 있음
- 원소가 원소의 컬렉션이 되는 건 확실히 직관적인 개념
  - 머그잔을 생각해보자.
  - 머그잔은 하나의 원소지만, 단 하나의 원소를 포함하는 컬렉션이기도 함
  - 머그잔 하나를 더하면 두 개의 원소를 가진 컬렉션이 됨
- 컨텍스트의 지정과 변경을 편리하게 하기 위해 CoroutineContext 의 모든 원소가 CoroutineContext 로 되어 있음
- 컨텍스트를 지정하고 더하는 건 명시적인 집합을 만드는 것보다 훨씬 쉽다.
- 컨텍스트에서 모든 원소는 식별할 수 있는 유일한 Key 를 가지고 있음
  - **각 키는 주소로 비교**
- CoroutineName 이나 CoroutineContext 인터페이스를 구현한 CoroutineContext.Element 를 구현

```kotlin
fun main() {
    val name: CoroutineName = CoroutineName("A name")
    val element: CoroutineContext.Element = name
    val context: CoroutineContext = element

    val job: Job = Job()
    val jobElement: CoroutineContext.Element = job
    val jobContext: CoroutineContext = jobElement
}
```

## CoroutineContext 에서 원소 찾기

- CoroutineContext 는 컬렉션과 비슷하기 때문에 get 을 이용해 유일한 키를 가진 원소를 찾을 수 있음
  - 대괄호도 가능
- 원소가 컨텍스트에 있으면 반환된다는 점에서 Map 과 비슷
  - 원소가 없으면 null 로 반환

```kotlin
fun main() {
    val name = "A name"
    val ctx: CoroutineContext = CoroutineName(name)

    val coroutineName: CoroutineName? = ctx[CoroutineName]
    // or ctx.get(CoroutineName)
    assert(coroutineName?.name == name) // A name
    val job: Job? = ctx[Job] // or ctx.get(Job)
    assert(job == null) // null
}
```

```kotlin
public data class CoroutineName(
    /**
     * User-defined coroutine name.
     */
    val name: String
) : AbstractCoroutineContextElement(CoroutineName) {
    /**
     * Key for [CoroutineName] instance in the coroutine context.
     */
    public companion object Key : CoroutineContext.Key<CoroutineName>

    /**
     * Returns a string representation of the object.
     */
    override fun toString(): String = "CoroutineName($name)"
}
```

- 키는 (CoroutineName 과 같은) 클래스나 Job과 SupervisorJob 처럼 같은 키를 사용하는 클래스가 구현한 (Job과 같은) 인터페이스를 가리킴

```kotlin
public interface Job : CoroutineContext.Element {
    /**
     * Key for [Job] instance in the coroutine context.
     */
    public companion object Key : CoroutineContext.Key<Job>
```

## 컨텍스트 더하기

- CoroutineContext 의 정말 유용한 기능
  - 두 개의 CoroutineContext 를 합쳐 하나의 CoroutineContext 로 만들 수 있는 것!
  - 다른 키를 가진 두 원소를 더하면 만들어진 컨텍스트는 두 가지 키를 모두 가진다.

```kotlin
fun main() {
    val name1 = "Name1"
    val ctx1: CoroutineContext = CoroutineName(name1)
    assert(ctx1[CoroutineName]?.name == name1) // Name1
    assert(ctx1[Job]?.isActive == null) // null

    val ctx2: CoroutineContext = Job()
    assert(ctx2[CoroutineName]?.name == null) // null
    assert(ctx2[Job]?.isActive == true) // true, because "Active"
    // is the default state of a job created this way

    val ctx3 = ctx1 + ctx2
    assert(ctx3[CoroutineName]?.name == name1) // Name1
    assert(ctx3[Job]?.isActive == true) // true
}
```

- 만약 같은 키를 가진 또 다른 원소가 더해지면?
  - 맵 처럼 새로운 원소가 기존 원소를 대체하게 됨

```kotlin
fun main() {
    val name1 = "Name1"
    val ctx1: CoroutineContext = CoroutineName(name1)
    assert(ctx1[CoroutineName]?.name == name1) // Name1, 'CoroutineName' 가 키

    val name2 = "Name2"
    val ctx2: CoroutineContext = CoroutineName(name2)
    assert(ctx2[CoroutineName]?.name == name2) // Name2, 'CoroutineName' 가 키

    val ctx3 = ctx1 + ctx2
    assert(ctx3[CoroutineName]?.name == name2) // Name2
}
```

## 비어 있는 코루틴 컨텍스트

- CoroutineContext 는 컬렉션이므로 빈 컨텍스트 또한 생성 가능
- 당연히 원소가 없어서 더해도 변화가 없다.

```kotlin
fun main() {
    val empty: CoroutineContext = EmptyCoroutineContext
    assert(empty[CoroutineName] == null) // null
    assert(empty[Job] == null) // null

    val name1 = "Name1"
    val ctxName = empty + CoroutineName(name1) + empty
    assert(ctxName[CoroutineName] == CoroutineName(name1)) // CoroutineName(Name1)
}
```

```kotlin
@SinceKotlin("1.3")
public object EmptyCoroutineContext : CoroutineContext, Serializable {
    private const val serialVersionUID: Long = 0
    private fun readResolve(): Any = EmptyCoroutineContext

    public override fun <E : Element> get(key: Key<E>): E? = null
    public override fun <R> fold(initial: R, operation: (R, Element) -> R): R = initial
    public override fun plus(context: CoroutineContext): CoroutineContext = context
    public override fun minusKey(key: Key<*>): CoroutineContext = this
    public override fun hashCode(): Int = 0
    public override fun toString(): String = "EmptyCoroutineContext"
}
```

## 원소 제거

- minusKey 를 통해 해당 원소를 컨텍스트에서 제거 가능

```kotlin
fun main() {
    val name1 = "Name1"
    val ctx = CoroutineName(name1) + Job()
    assert(ctx[CoroutineName]?.name == name1) // Name1
    assert(ctx[Job]?.isActive == true) // true

    val ctx2 = ctx.minusKey(CoroutineName)
    assert(ctx2[CoroutineName]?.name == null) // null
    assert(ctx2[Job]?.isActive == true) // true

    val name2 = "Name2"
    val ctx3 =
        (ctx + CoroutineName(name2))
            .minusKey(CoroutineName)
    assert(ctx3[CoroutineName]?.name == null) // null
    assert(ctx3[Job]?.isActive == true) // true
}
```

## 컨텍스트 폴딩

- 컬렉션의 fold 를 컨텍스트에서도 유사하게 사용할 수 있다.
- fold 에는 다음 값이 필요
  - 누산기의 첫 번째 값
  - 누산기의 현재 상태와 현재 실행되고 있는 원소로 누산기의 다음 상태를 계산할 연산

```kotlin
fun main() {
    val ctx = CoroutineName("Name1") + Job()

    ctx.fold("") { acc, element -> "$acc$element " }
        .also(::println) // CoroutineName(Name1) JobImpl{Active}@2b71fc7e

    val empty = emptyList<CoroutineContext>()
    ctx.fold(empty) { acc, element -> acc + element }
        .joinToString()
        .also(::println) // CoroutineName(Name1), JobImpl{Active}@2b71fc7e
}
```

## 코루틴 컨텍스트와 빌더

- CoroutineContext 는 **코루틴의 데이터를 저장하고 전달하는 방법**
- 부모 - 자식 관계의 영향 중 하나
  - 부모는 기본적으로 컨텍스트를 자식에게 전달
  - 자식은 부모로부터 컨텍스트를 상속

```kotlin
private fun CoroutineScope.log(msg: String) {
    val name = coroutineContext[CoroutineName]?.name
    println("[$name] $msg")
}

fun main() =
    runBlocking(CoroutineName("main")) {
        log("Started") // [main] Started
        val v1 =
            async {
                delay(500)
                log("Running async") // [main] Running async
                42
            }
        launch {
            delay(1000)
            log("Running launch") // [main] Running launch
        }
        log("The answer is ${v1.await()}")
        // [main] The answer is 42
    }
```

- 모든 자식은 빌더의 인자에서 정의된 특정 컨텍스트를 가질 수 있다.
- 인자로 전달된 컨텍스트는 부모로부터 상속받은 컨텍스트를 대체

```kotlin
private fun CoroutineScope.log(msg: String) {
    val name = coroutineContext[CoroutineName]?.name
    println("[$name] $msg")
}

fun main() =
    runBlocking(CoroutineName("main")) {
        log("Started") // [main] Started
        val v1 =
            async(CoroutineName("c1")) {
                delay(500)
                log("Running async") // [c1] Running async
                42
            }
        launch(CoroutineName("c2")) {
            delay(1000)
            log("Running launch") // [c2] Running launch
        }
        log("The answer is ${v1.await()}")
        // [main] The answer is 42
    }
```

- 코루틴 컨텍스트를 계산하는 간단한 공식
  - defaultContext + parentContext + childContext
- 새로운 원소가 같은 키를 가졌으면 해당 원소를 대체하므로
  - 자식 컨텍스트는 부모 컨텍스트로부터 상속받은 컨텍스트 중 같은 키를 가진 원소를 대체
- 현재 디폴트로 설정되는 원소는 Dispatchers.Default
- 애플리케이션이 디버그 모드일 때는 CoroutineId 도 디폴트로 설정됨
- Job 은 변경이 가능하며, 코루틴이 자식과 부모가 소통하기 위해 사용되는 특별한 컨텍스트

## 중단 함수에서 컨텍스트에 접근하기

- CoroutineScope 는 컨텍스트에 접근할 때 사용하는 coroutineContext 프로퍼티를 가지고 있음
- 일반적인 중단 함수에서는 어떻게 컨텍스트에 접근할 수 있을까?
- 컨텍스트는 중단 함수 사이에 전달되는 컨티뉴에이션 객체가 참조하고 있음
  - 따라서 중단 함수에서 부모 컨텍스트에 접근하는 것이 가능
- coroutineContext 프로퍼티는 모든 중단 스코프에서 사용 가능하며, 이를 통해 컨텍스트에 접근 가능

```kotlin
private suspend fun printName() {
    println(coroutineContext[CoroutineName]?.name)
}

suspend fun main() =
    withContext(CoroutineName("Outer")) {
        printName() // Outer
        launch(CoroutineName("Inner")) {
            printName() // Inner
        }
        delay(10)
        printName() // Outer
    }
```

## 컨텍스트를 개별적으로 생성하기

- 커스텀하게 만드는 경우는 흔치 않지만, 방법은 간단함
- `CoroutineContext.Element` 인터페이스를 구현하는 클래스를 만드는 것
- 이러한 클래스는 `CoroutineContext.Key<*>` 타입의 `Key` 프로퍼티를 필요로 함
  - 이 키는 컨텍스트를 식별하는 그 키
  - 가장 전형적인 사용 방법은 클래스의 컴패니언 객체를 키로 사용하는 것

```kotlin
class CounterContext(
    private val name: String,
) : CoroutineContext.Element {
    override val key: CoroutineContext.Key<*> = Key
    private var nextNumber = 0

    fun printNext() {
        println("$name: $nextNumber")
        nextNumber++
    }

    companion object Key : CoroutineContext.Key<CounterContext>
}

private suspend fun printNext() {
    coroutineContext[CounterContext]?.printNext()
}

suspend fun main(): Unit =
    withContext(CounterContext("Outer")) {
        printNext() // Outer: 0
        launch {
            printNext() // Outer: 1
            launch {
                printNext() // Outer: 2
            }
            launch(CounterContext("Inner")) {
                printNext() // Inner: 0
                printNext() // Inner: 1
                launch {
                    printNext() // Inner: 2
                }
            }
        }
        printNext() // Outer: 3
    }
```

- 테스트 환경과 프로덕션 환경에서 서로 다른 값을 쉽게 주입하기 위해 커스텀 컨텍스트를 사용하는 경우도 있지만, 흔한 방법은 아닐 것 같다.

```kotlin
private data class User(val id: String, val name: String)

private abstract class UuidProviderContext :
    CoroutineContext.Element {
    abstract fun nextUuid(): String

    override val key: CoroutineContext.Key<*> = Key

    companion object Key :
        CoroutineContext.Key<UuidProviderContext>
}

private class RealUuidProviderContext : UuidProviderContext() {
    override fun nextUuid(): String = UUID.randomUUID().toString()
}

private class FakeUuidProviderContext(
    private val fakeUuid: String,
) : UuidProviderContext() {
    override fun nextUuid(): String = fakeUuid
}

private suspend fun nextUuid(): String =
    checkNotNull(coroutineContext[UuidProviderContext]) {
        "UuidProviderContext not present"
    }
        .nextUuid()

// function under test
private suspend fun makeUser(name: String) =
    User(
        id = nextUuid(),
        name = name,
    )

suspend fun main() {
    // production case
    withContext(RealUuidProviderContext()) {
        println(makeUser("Michał"))
        // e.g. User(id=d260482a-..., name=Michał)
    }

    // test case
    withContext(FakeUuidProviderContext("FAKE_UUID")) {
        val user = makeUser("Michał")
        println(user) // User(id=FAKE_UUID, name=Michał)
        assert(User("FAKE_UUID", "Michał") == user)
    }
}
```

## 요약

- CoroutineContext 는 맵이나 집합과 같은 컬렉션과 개념적으로 비슷
- CoroutineContext 는 Element 인터페이스의 인덱싱된 집합
  - Element 또한 CoroutineContext
- CoroutineContext 안의 모든 원소는 식별할 수 있는 유일한 Key 를 가짐
  - 같은 Key 를 가진 원소가 추가되면, Map 처럼 대체
- CoroutineContext 는 코루틴에 관련된 정보를 객체로 그룹화하고 전달하는 보편적인 방법
- CoroutineContext 는 코루틴에 저장
- CoroutineContext 를 사용해
  - 코루틴의 상태가 어떤지 확인 가능
  - 어떤 스레드를 선택할 지 가능
- CoroutineContext 을 사용해서 코루틴의 작동 방식을 정할 수 있다.
