+++ 
date = 2024-02-08T15:10:00+09:00
title = "[Kotlin Coroutines] 15장. 코틀린 코루틴 테스트하기"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## introduction

- 대부분의 경우 중단 함수를 테스트하는 건 일반적인 함수를 테스트하는 것과 별반 다르지 않음
- 아래 예제는 mock 과 assertion 으로 쉽게 확인 가능

```kotlin
class FetchUserUseCase(
    private val repo: UserDataRepository,
) {

    suspend fun fetchUserData(): User = coroutineScope {
        val name = async { repo.getName() }
        val friends = async { repo.getFriends() }
        val profile = async { repo.getProfile() }
        User(
            name = name.await(),
            friends = friends.await(),
            profile = profile.await()
        )
    }
}
```

```kotlin
class FetchUserDataTest {
    @Test
    fun `should construct user`() =
        runBlocking {
            // given
            val repo = FakeUserDataRepository()
            val useCase = FetchUserUseCase(repo)

            // when
            val result = useCase.fetchUserData()

            // then
            val expectedUser =
                User(
                    name = "Ben",
                    friends = listOf(Friend("some-friend-id-1")),
                    profile = Profile("Example description"),
                )
            assertEquals(expectedUser, result)
        }

    class FakeUserDataRepository : UserDataRepository {
        override suspend fun getName(): String = "Ben"

        override suspend fun getFriends(): List<Friend> = listOf(Friend("some-friend-id-1"))

        override suspend fun getProfile(): Profile = Profile("Example description")
    }
}
```

- 코루틴을 사용하는 경우에도 중단 함수의 동작이 궁금하면 runBlocking 과 assert 를 지원하는 도구만 사용해도 충분함
- 통합 테스트도 같은 방법으로 구현 가능

## 시간 의존성 테스트하기

- 시간 의존성 테스트는 기존 테스트와 다른 점이 존재

```kotlin
suspend fun produceCurrentUserSeq(): User {
    val profile = repo.getProfile()
    val friends = repo.getFriends()
    return User(profile, friends)
}

suspend fun produceCurrentUserSym(): User = coroutineScope {
    val profile = async { repo.getProfile() }
    val friends = async { repo.getFriends() }
    User(profile.await(), friends.await())
}
```

- 두 함수는 같은 듯 하지만 다름
- 첫 번째 함수
  - 순차적으로 생성
  - 2초정도 걸림
- 두 번째 함수
  - 동시에 생성
  - 1초정도 걸림
- 이 두 함수의 차이를 어떻게 테스트할까?
- `getProfile` , `getFriends` 의 실행 기간이 길 경우에만 차이가 생김
  - 즉시 실행되면 구분이 안감
  - 차이를 만들자
  - delay 를 사용한 가짜 함수

```kotlin
class FakeDelayedUserDataRepository : UserDataRepository {

    override suspend fun getProfile(): Profile {
        delay(1000)
        return Profile("Example description")
    }

    override suspend fun getFriends(): List<Friend> {
        delay(1000)
        return listOf(Friend("some-friend-id-1"))
    }
}
```

- 이제 된 듯 하나 문제가 하나 생김
- **하나의 단위 테스트에서 시간이 오래 걸리는 것 또한 문제가 됨**
  - 보통 한 프로젝트에 수 천 개의 단위 테스트가 존재
  - 전체를 수행하는데 걸리는 시간이 길면 안됨
- 코루틴에서는 시간을 조작하여 테스트에 걸리는 시간을 줄일 수 있음
  - kotlinx-coroutines-test 라이브러리가 제공하는 StandardTestDispatcher 를 사용하면 됨

## TestCoroutineScheduler 와 StandardTestDispatcher

- delay 를 호출하면 코루틴이 중단되고 설정한 시간 후에 재개됨
- TestCoroutineScheduler 는 delay 를 가상 시간 동안 실행하여 실제 시간이 흘러간 상황과 동일하게 작동
  - 따라서 정해진 시간만큼 기다리지 않아도 됨!

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class TestCoroutineSchedulerTest {
    @Test
    fun `TestCoroutineScheduler example`() {
        val scheduler = TestCoroutineScheduler()

        assertEquals(0, scheduler.currentTime)

        scheduler.advanceTimeBy(1_000)
        assertEquals(1_000, scheduler.currentTime)

        scheduler.advanceTimeBy(1_000)
        assertEquals(2_000, scheduler.currentTime)
    }
}
```

- 코루틴에서 TestCoroutineScheduler 를 사용하려면, 이를 지원하는 디스패처를 사용해야함
  - 일반적으로 StandardTestDispatcher
- StandardTestDispatcher 코루틴이 실행되어야 할 스레드를 결정할 때만 사용되는 것은 아님
- 테스트 디스패처로 시작된 코루틴은 가상 시간만큼 진행되기 전까지 실행되지 않음
- 코루틴을 시작하는 일반적인 방법은 실제 시간처럼 작동하는 가상 시간을 흐르게 하여, 그 시간 동안 호출되었을 모든 작업을 실행하는 advanceUntilIdle 을 사용하는 것

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class StandardTestDispatcherTest {
    @Test
    fun `StandardTestDispatcher example`() {
        val scheduler = TestCoroutineScheduler()
        val testDispatcher = StandardTestDispatcher(scheduler)

        CoroutineScope(testDispatcher).launch {
            println("Some work 1")
            delay(1000)
            println("Some work 2")
            delay(1000)
            println("Coroutine done")
        }

        assertEquals("[0] Before", "[${scheduler.currentTime}] Before")
        scheduler.advanceUntilIdle()
        assertEquals("[2000] After", "[${scheduler.currentTime}] After")
    }
}
```

- 기본적으로 StandardTestDispatcher 는 TestCoroutineScheduler 를 만들기 때문에 명시적으로 만들지 않아도 됨

```kotlin
@Suppress("FunctionName")
public fun StandardTestDispatcher(
    scheduler: TestCoroutineScheduler? = null,
    name: String? = null
): TestDispatcher = StandardTestDispatcherImpl(
    scheduler ?: TestMainDispatcher.currentTestScheduler ?: TestCoroutineScheduler(), name)

private class StandardTestDispatcherImpl(
    override val scheduler: TestCoroutineScheduler = TestCoroutineScheduler(),
    private val name: String? = null
) : TestDispatcher() {

    override fun dispatch(context: CoroutineContext, block: Runnable) {
        scheduler.registerEvent(this, 0, block, context) { false }
    }

    override fun toString(): String = "${name ?: "StandardTestDispatcher"}[scheduler=$scheduler]"
}
```

- 디스패처의 scheduler 프로퍼티로 해당 스케쥴러에 접근 가능

```kotlin
@Test
fun `StandardTestDispatcher can access TestCoroutineScheduler with the scheduler property`() {
    val dispatcher = StandardTestDispatcher()

    CoroutineScope(dispatcher).launch {
        println("Some work 1")
        delay(1000)
        println("Some work 2")
        delay(1000)
        println("Coroutine done")
    }

    assertEquals("[0] Before", "[${dispatcher.scheduler.currentTime}] Before")
    dispatcher.scheduler.advanceUntilIdle()
    assertEquals("[2000] After", "[${dispatcher.scheduler.currentTime}] After")
}
```

- StandardTestDispatcher 는 직접 시간을 흐르게 하지는 않음
  - 시간을 흐르게 하지 않으면 코루틴이 다시 재개되지 않음
- 아래는 종료되지 않는 코드

```kotlin
fun main() {
    val testDispatcher = StandardTestDispatcher()

    runBlocking(testDispatcher) {
        delay(1)
        println("Coroutine done")
    }
}
// (code runs forever)
```

- 시간을 흐르게 하는 또 다른 방법은 advanceTimeBy 에 일정 밀리초를 인자로 넣어주는 것
- **advanceTimeBy 는 시간을 흐르게 하고, 그동안 일어났을 모든 연산을 수행**
- 정확히 일치하는 시간에 예정된 연산을 재개하려면 runCurrent 함수를 추가로 호출하면 됨

```kotlin
@Test
fun `advanceTimeBy and runCurrent example`() {
    val testDispatcher = StandardTestDispatcher()

    CoroutineScope(testDispatcher).launch {
        delay(1)
        println("Done1")
    }
    CoroutineScope(testDispatcher).launch {
        delay(2)
        println("Done2")
    }

    testDispatcher.scheduler.advanceTimeBy(2) // Done
    testDispatcher.scheduler.runCurrent() // Done2
}
```

```kotlin
@Test
fun `advanceTimeBy and runCurrent complex example`() {
    val testDispatcher = StandardTestDispatcher()

    CoroutineScope(testDispatcher).launch {
        delay(2)
        print("Done")
    }

    CoroutineScope(testDispatcher).launch {
        delay(4)
        print("Done2")
    }

    CoroutineScope(testDispatcher).launch {
        delay(6)
        print("Done3")
    }

    for (i in 1..5) {
        print(".")
        testDispatcher.scheduler.advanceTimeBy(1)
        testDispatcher.scheduler.runCurrent()
    } // ..Done..Done2.
}
```

- 가상 시간은 어떻게 작동할까?
  - delay 가 호출되면 디스패처 (ContinuationInterceptor 키를 가진 클래스) 가 Delay 인터페이스를 구현했는지 확인
    - StandardTestDispatcher 가 Delay 인터페이스를 구현
  - 디스패처에서는 실제 시간만큼 기다리는 DefaultDelay 대신 디스패처가 가진 scheduleResumeAfterDelay 함수를 호출함
- 다음 예제를 통해 가상 시간이 실제 시간과 무관하다는 걸 확인해보자
- Thread.sleep 은 StandardTestDispatcher 의 코루틴에 영향을 주지 않음
- advanceUntilIdle 을 호출하면 몇 밀리초밖에 걸리지 않기 때문에 실제 시간만큼 기다리지 않는 것을 확인 가능
  - advanceUntilIdle 은 가상 시간을 즉시 흐르게 하고 코루틴 연산을 실행

```kotlin
@Test
fun `advanceUntilIdle example`() {
    val dispatcher = StandardTestDispatcher()

    CoroutineScope(dispatcher).launch {
        delay(1000)
        println("Coroutine done")
    }

    Thread.sleep(Random.nextLong(2000)) // Does not matter
    // how much time we wait here, it will not influence
    // the result

    val time =
        measureTimeMillis {
            println("[${dispatcher.scheduler.currentTime}] Before")
            dispatcher.scheduler.advanceUntilIdle()
            println("[${dispatcher.scheduler.currentTime}] After")
        }

    assertThat(time).isLessThan(50)
}
```

- 이전 예시에서 StandardTestDispatcher 를 사용했고, 스코프로 디스패처를 래핑함
- 이 방법 대신에 같은 역할을 수행하는 (또한 CoroutineExceptionHandler 로 모든 예외를 모으는) TestScope 를 사용할 수 있음
  - 스코프가 사용하는 스케줄러에 advanceUntilIdle, advanceTimeBy 또는 currentTime 프로퍼티가 위임되기 때문에 스코프만으로도 해당 함수와 프로퍼티를 사용할 수 있음
  - 매우 편리함!

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class TestScopeTest {
    @Test
    fun `TestScope example`() {
        val scope = TestScope()

        scope.launch {
            delay(1000)
            println("First done")
            delay(1000)
            println("Coroutine done")
        }

        println("[${scope.currentTime}] Before") // [0] Before
        assertEquals(0, scope.currentTime)

        scope.advanceTimeBy(1000)
        scope.runCurrent() // First done
        println("[${scope.currentTime}] Middle") // [1000] Middle
        assertEquals(1000, scope.currentTime)

        scope.advanceUntilIdle() // Coroutine done
        println("[${scope.currentTime}] After") // [2000] After
        assertEquals(2000, scope.currentTime)
    }
}
```

## runTest

- runTest 는 kotlinx-coroutines-test 의 함수 중 가장 흔하게 사용됨
- TestScope 에서 코루틴을 시작하고 즉시 유휴 상태가 될 때까지 시간을 흐르게 함
- 코루틴에서는 스코프가 TestScope 타입이므로 아무 때나 currentTime 을 사용할 수 있음
- 코루틴에서 시간이 얼마나 흘렀는지 확인할 수 있으며, 테스트하는 데는 몇 밀리초밖에 걸리지 않음

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class RunTestTest {
    @Test
    fun `runTest example`() =
        runTest {
            assertEquals(0, currentTime)
            delay(1000)
            assertEquals(1000, currentTime)
        }

    @Test
    fun `runTest example 2`() =
        runTest {
            assertEquals(0, currentTime)
            coroutineScope {
                launch { delay(1000) }
                launch { delay(1500) }
                launch { delay(2000) }
            }
            assertEquals(2000, currentTime)
        }
}
```

- runTest 를 사용하면 데이터를 순차적으로 그리고 동시에 가져오는 테스트를 아주 쉽게 할 수 있다.
  - 가짜 저장소가 각 함수를 호출하는 데 1초가 걸린다고 가정하면, 연속적인 처리는 2초가 걸리고 동시 처리는 1초면 됨
  - 가상 시간을 사용하기 때문에 테스트는 즉시 끝나게 되며 currentTime 의 값도 정확

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class FetchUserDataTest {
    @Test
    fun `should load data concurrently`() =
        runTest {
            // given
            val userRepo = FakeUserDataRepository()
            val useCase = FetchUserUseCase(userRepo)

            // when
            useCase.fetchUserData()

            // then
            assertEquals(1000, currentTime)
        }

    @Test
    fun `should construct user`() =
        runBlocking {
            // given
            val repo = FakeUserDataRepository()
            val useCase = FetchUserUseCase(repo)

            // when
            val result = useCase.fetchUserData()

            // then
            val expectedUser =
                User(
                    name = "Ben",
                    friends = listOf(Friend("some-friend-id-1")),
                    profile = Profile("Example description"),
                )
            assertEquals(expectedUser, result)
        }

    class FakeUserDataRepository : UserDataRepository {
        override suspend fun getName(): String {
            delay(1000)
            return "Ben"
        }

        override suspend fun getFriends(): List<Friend> {
            delay(1000)
            return listOf(Friend("some-friend-id-1"))
        }

        override suspend fun getProfile(): Profile {
            delay(1000)
            return Profile("Example description")
        }
    }
}
```

## 백그라운드 스코프

- runTest 함수는 다른 함수처럼 스코프를 만듦
  - 자식 코루틴이 끝날 때까지 기다림
- 절대 끝나지 않는 프로세스를 시작한다면 테스트 또한 종료되지 않음

```kotlin
@Test
fun `should increment counter`() = runTest {
    var i = 0
    launch {
        while (true) {
            delay(1000)
            i++
        }
    }

    delay(1001)
    assertEquals(1, i)
    delay(1000)
    assertEquals(2, i)

    // Test would pass if we added
    // coroutineContext.job.cancelChildren()
}
```

- 이런 경우를 대비해서 runTest 는 backgroundScope 를 제공함
- 백그라운드 스코프 또한 가상 시간을 지원하지만, runTest 가 스코프가 종료될 때까지 기다리지 않음
- 따라서 아래 테스트가 문제 없이 통과함
- backgroundScope 는 테스트가 기다릴 필요 없는 모든 프로세스를 시작할 때 사용함

```kotlin
class BackgroundScopeTest {
    @Test
    fun `should increment counter`() =
        runTest {
            var i = 0
            backgroundScope.launch {
                while (true) {
                    delay(1000)
                    i++
                }
            }

            delay(1001)
            assertEquals(1, i)
            delay(1000)
            assertEquals(2, i)
        }
}
```

- backgroundScope 는 어떻게 구성되어 있을까 궁금해서 찾아봄

```kotlin
internal class TestScopeImpl(context: CoroutineContext) :
    AbstractCoroutine<Unit>(context, initParentJob = true, active = true), TestScope {

    override val testScheduler get() = context[TestCoroutineScheduler]!!

    private var entered = false
    private var finished = false
    private val uncaughtExceptions = mutableListOf<Throwable>()
    private val lock = SynchronizedObject()

    **override val backgroundScope: CoroutineScope =
        CoroutineScope(coroutineContext + BackgroundWork + ReportingSupervisorJob {
            if (it !is CancellationException) reportException(it)
        })**

    /** Called upon entry to [runTest]. Will throw if called more than once. */
    fun enter() {
        val exceptions = synchronized(lock) {
            if (entered)
                throw IllegalStateException("Only a single call to `runTest` can be performed during one test.")
            entered = true
            check(!finished)
            /** the order is important: [reportException] is only guaranteed not to throw if [entered] is `true` but
             * [finished] is `false`.
             * However, we also want [uncaughtExceptions] to be queried after the callback is registered,
             * because the exception collector will be able to report the exceptions that arrived before this test but
             * after the previous one, and learning about such exceptions as soon is possible is nice. */
            @Suppress("INVISIBLE_REFERENCE", "INVISIBLE_MEMBER")
            run { ensurePlatformExceptionHandlerLoaded(ExceptionCollector) }
            if (catchNonTestRelatedExceptions) {
                ExceptionCollector.addOnExceptionCallback(lock, this::reportException)
            }
            uncaughtExceptions
        }
        if (exceptions.isNotEmpty()) {
            throw UncaughtExceptionsBeforeTest().apply {
                for (e in exceptions)
                    addSuppressed(e)
            }
        }
    }

    /** Called at the end of the test. May only be called once. Returns the list of caught unhandled exceptions. */
    fun leave(): List<Throwable> = synchronized(lock) {
        check(entered && !finished)
        /** After [finished] becomes `true`, it is no longer valid to have [reportException] as the callback. */
        ExceptionCollector.removeOnExceptionCallback(lock)
        finished = true
        uncaughtExceptions
    }

    /** Called at the end of the test. May only be called once. */
    fun legacyLeave(): List<Throwable> {
        val exceptions = synchronized(lock) {
            check(entered && !finished)
            /** After [finished] becomes `true`, it is no longer valid to have [reportException] as the callback. */
            ExceptionCollector.removeOnExceptionCallback(lock)
            finished = true
            uncaughtExceptions
        }
        val activeJobs = children.filter { it.isActive }.toList() // only non-empty if used with `runBlockingTest`
        if (exceptions.isEmpty()) {
            if (activeJobs.isNotEmpty())
                throw UncompletedCoroutinesError(
                    "Active jobs found during the tear-down. " +
                        "Ensure that all coroutines are completed or cancelled by your test. " +
                        "The active jobs: $activeJobs"
                )
            if (!testScheduler.isIdle())
                throw UncompletedCoroutinesError(
                    "Unfinished coroutines found during the tear-down. " +
                        "Ensure that all coroutines are completed or cancelled by your test."
                )
        }
        return exceptions
    }

    /** Stores an exception to report after [runTest], or rethrows it if not inside [runTest]. */
    fun reportException(throwable: Throwable) {
        synchronized(lock) {
            if (finished) {
                throw throwable
            } else {
                @Suppress("INVISIBLE_MEMBER")
                for (existingThrowable in uncaughtExceptions) {
                    // avoid reporting exceptions that already were reported.
                    if (unwrap(throwable) == unwrap(existingThrowable))
                        return
                }
                uncaughtExceptions.add(throwable)
                if (!entered)
                    throw UncaughtExceptionsBeforeTest().apply { addSuppressed(throwable) }
            }
        }
    }

    /** Throws an exception if the coroutine is not completing. */
    fun tryGetCompletionCause(): Throwable? = completionCause

    override fun toString(): String =
        "TestScope[" + (if (finished) "test ended" else if (entered) "test started" else "test not started") + "]"
}
```

## 취소와 컨텍스트 전달 테스트하기

- 특정 함수가 구조화된 동시성을 지키고 있는지 테스트하려면,
  - 중단 함수로부터 컨텍스트를 받은 뒤, 컨텍스트가 기대한 값을 가지고 있는지와
  - 잡이 적절한 상태인지 확인하는 것이 가장 쉬운 방법
- 아래 함수는 순서를 보장하면서 비동기적으로 원소를 매핑함

```kotlin
private suspend fun <T, R> Iterable<T>.mapAsync(transformation: suspend (T) -> R): List<R> =
    coroutineScope {
        this@mapAsync.map { async { transformation(it) } }
            .awaitAll()
    }
```

- 아래 테스트를 보면 해당 동작을 확인할 수 있음

```kotlin
@Test
fun `should map async and keep elements order`() =
    runTest {
        val transforms =
            listOf(
                suspend {
                    delay(3000)
                    "A"
                },
                suspend {
                    delay(2000)
                    "B"
                },
                suspend {
                    delay(4000)
                    "C"
                },
                suspend {
                    delay(1000)
                    "D"
                },
            )

        val res = transforms.mapAsync { it() }
        assertEquals(listOf("A", "B", "C", "D"), res)
        assertEquals(4000, currentTime)
    }
```

- 추가적으로 구조화된 동시성을 지키는 중단 함수가 정확하게 구현되어야 함
- 이를 확인하는 가장 쉬운 방법은 부모 코루틴에서 CoroutineName 과 같은 특정 컨텍스트를 명시하여 transformation 함수에서 그대로인지 확인하는 것
- 중단 함수에서 컨텍스트를 확인하려면, currentCoroutineContext 함수나 coroutineContext 프로퍼티를 사용하면 됨
  - 코루틴 빌더의 람다식이나 스코프 함수에서는 currentCoroutineContext 함수를 사용해야 하는데, CoroutineScope 의 coroutineContext 프로퍼티가 현재 코루틴 컨텍스트를 제공하는 프로퍼티보다 우선하기 때문

```kotlin
@Test
fun `should support context propagation`() =
    runTest {
        var ctx: CoroutineContext? = null

        val name1 = CoroutineName("Name 1")
        withContext(name1) {
            listOf("A").mapAsync {
                // in transformation
                ctx = currentCoroutineContext() // should be name1
                it
            }
            assertEquals(name1, ctx?.get(CoroutineName))
        }

        val name2 = CoroutineName("Some name 2")
        withContext(name2) {
            listOf(1, 2, 3).mapAsync {
                // in transformation
                ctx = currentCoroutineContext() // should be name2
                it
            }
            assertEquals(name2, ctx?.get(CoroutineName))
        }
    }
```

- 취소를 확인하는 가장 쉬운 방법은 내부 함수에서 잡을 참조하고, 외부 코루틴에서 코루틴을 취소한 뒤, 참조된 잡이 취소된 것을 확인하는 것

```kotlin
@Test
fun `should support cancellation`() =
    runTest {
        var job: Job? = null

        val parentJob =
            launch {
                listOf("A").mapAsync {
                    job = currentCoroutineContext().job // refer to a job
                    delay(Long.MAX_VALUE)
                }
            }

        delay(1000)
        parentJob.cancel()
        assertEquals(true, job?.isCancelled) // referred job should be cancelled
    }
```

- 대부분 애플리케이션에서는 이런 테스트가 필요하지 않음
  - 라이브러리에서는 쓸모가 있음
- 구조화된 동시성을 지키고 있는지는 명확하게 드러나지 않음
- async 를 외부 스코프에서 시작했다면 위 두 가지 테스트 모두 실패했을 것
- 아래는 잘못 구현된 mayAsync

```kotlin
// Incorrect implementation, that would make above tests fail
suspend fun <T, R> Iterable<T>.mapAsync(
    transformation: suspend (T) -> R
): List<R> =
    this@mapAsync
        .map { GlobalScope.async { transformation(it) } }
        .awaitAll()
```

## UnconfinedTestDispatcher

- UnconfinedTestDispatcher 는 코루틴을 시작했을 때 첫 번째 지연이 일어나기 전까지 모든 연산을 즉시 수행
- 앞에 나온 StandardTestDispatcher 는 스케줄러를 사용하기 전까지 어떤 연산도 수행하지 않음

```kotlin
@Test
fun `StandardTestDispatcher vs UnconfinedTestDispatcher`() {
    CoroutineScope(StandardTestDispatcher()).launch {
        print("A")
        delay(1)
        print("B")
    }
    CoroutineScope(UnconfinedTestDispatcher()).launch {
        print("C")
        delay(1)
        print("D")
    }
    // only C will be printed
}
```

- 이전에는 runTest 와 아주 비슷한 UnconfinedTestDispatcher 의 runBlockingTest 를 사용함
- runBlockingTest 에서 runTest 를 곧바로 이식하고 싶다면 테스트는 다음과 같다.

```kotlin
@Test
fun testName() = runTest(UnconfinedTestDispatcher()) {
    //...
}
```

## 목(mock) 사용하기

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class MockTest {
    private fun generateRandomString() = UUID.randomUUID().toString()

    @Test
    fun `should load data concurrently`() =
        runTest {
            // given
            val userRepo = mockk<UserDataRepository>()
            val aName = generateRandomString()
            val someFriends =
                listOf(
                    Friend(generateRandomString()),
                    Friend(generateRandomString()),
                    Friend(generateRandomString()),
                )
            val aProfile = Profile(generateRandomString())
            coEvery { userRepo.getName() } coAnswers {
                delay(600)
                aName
            }
            coEvery { userRepo.getFriends() } coAnswers {
                delay(700)
                someFriends
            }
            coEvery { userRepo.getProfile() } coAnswers {
                delay(800)
                aProfile
            }
            val useCase = FetchUserUseCase(userRepo)

            // when
            useCase.fetchUserData()

            // then
            assertEquals(800, currentTime)
        }
}
```

## 디스패처를 바꾸는 함수 테스트하기

- 디스패처를 사용한 경우 runBlocking 을 사용해 테스트 하는 것이 일반적
- 함수가 실제로 디스패처를 바꾸는 건 어떻게 확인할 수 있을까?
  - 호출하는 함수를 모킹해서 사용한 스레드의 이름을 가지고 오는 방법으로 확인 가능

```kotlin
@Test
fun `should change dispatcher`() =
    runBlocking {
        // given
        val csvReader = mockk<CsvReader>()
        val startThreadName = "MyName"
        var usedThreadName: String? = null
        val aFileName = generateRandomString()
        val aGameState = GameState()
        every {
            csvReader.readCsvBlocking(
                aFileName,
                GameState::class.java,
            )
        } coAnswers {
            usedThreadName = Thread.currentThread().name
            aGameState
        }
        val saveReader = SaveReader(csvReader)

        // when
        withContext(newSingleThreadContext(startThreadName)) {
            saveReader.readSave(aFileName)
        }

        // then
        assertNotNull(usedThreadName)
        val expectedPrefix = "DefaultDispatcher-worker-"
        assert(usedThreadName!!.startsWith(expectedPrefix))
    }
```

- 하지만 디스패처를 바꾸는 함수에서 시간 의존성을 테스트해야 하는 극히 드문 경우
- 새로운 디스패처가 StandardTestDispatcher 를 대체하면 가상 시간에서의 작동이 멈추게 됨
- 좀 더 자세히 알아보기 위해 아래처럼 래핑해보자

```kotlin
suspend fun fetchUserData() = withContext(Dispatchers.IO) {
    val name = async { userRepo.getName() }
    val friends = async { userRepo.getFriends() }
    val profile = async { userRepo.getProfile() }
    User(
        name = name.await(),
        friends = friends.await(),
        profile = profile.await()
    )
}
```

- 이전에 구현했던 모든 테스트가 실제 시간만큼 기다리고, currentTime 은 0 으로 유지됨
- 가상 시간 문제를 해결하는 가장 쉬운 방법은 생성자를 통해 디스패처를 주입하고 단위 테스트에서 디스패처를 교체하는 것

```kotlin
class FetchUserUseCase(
    private val userRepo: UserDataRepository,
    private val ioDispatcher: CoroutineDispatcher = // <-- 생성자를 통해 주입
        Dispatchers.IO
) {

    suspend fun fetchUserData() = withContext(ioDispatcher) {
        val name = async { userRepo.getName() }
        val friends = async { userRepo.getFriends() }
        val profile = async { userRepo.getProfile() }
        User(
            name = name.await(),
            friends = friends.await(),
            profile = profile.await()
        )
    }
}
```

- 이제 단위 테스트에서 Dispatchers.IO 를 사용하는 대신 runTest 의 StandardTestDispatcher 를 사용해야 함
- ContinuationInterceptor 키를 사용해 coroutineContext 로부터 디스패처를 얻을 수 있음

```kotlin
val testDispatcher = this
    .coroutineContext[ContinuationInterceptor]
    as CoroutineDispatcher

val useCase = FetchUserUseCase(
    userRepo = userRepo,
    ioDispatcher = testDispatcher,
)
```

- ioDispatcher 를 CoroutineContext 로 캐스팅하고, 단위 테스트에서 EmptyCoroutineContext 로 대체하는 방법도 있음
- 두 경우 모두 함수의 디스패처를 바꾸지 않는다는 점에서 동일

```kotlin
val useCase = FetchUserUseCase(
    userRepo = userRepo,
    ioDispatcher = EmptyCoroutineContext,
)
```

## 함수 실행 중에 일어나는 일 테스트하기

- 실행 중에 프로그레스 바를 먼저 보여주고, 나중에 이를 숨기는 함수
  - 최종 결과만 확인한다면 함수 실행 중에 프로그레스 바가 상태를 변경했는지 확인할 방법이 없음
- 이런 경우 함수를 새로운 코루틴에서 시작하고 바깥에서 가상 시간을 조절하는 방법이 도움이 됨
- runTest 는 코루틴 디스패처로 StandardTestDispatcher 를 지정하며 대기 상태가 될 때까지 시간이 흐르게 함
  - advanceUntilIdle 함수!
  - 자식 코루틴의 시간은 함수 본체의 실행이 끝냈을 때(부모가 자식을 기다릴 때)가 되서야 흐르므로 그 이전에는 가상 시간을 우리가 조절 가능

```kotlin
@Test
fun `should show progress bar when sending data`() = runTest {
    // given
    val database = FakeDatabase()
    val vm = UserViewModel(database)

    // when
    launch {
        vm.sendUserData()
    }

    // then
    assertEquals(false, vm.progressBarVisible.value)

    // when
    advanceTimeBy(1000)

    // then
    assertEquals(false, vm.progressBarVisible.value)

    // when
    runCurrent()

    // then
    assertEquals(true, vm.progressBarVisible.value)

    // when
    advanceUntilIdle()

    // then
    assertEquals(false, vm.progressBarVisible.value)
}
```

- delay 를 써도 비슷한 효과를 얻을 수 있음
  - 별개의 프로세스를 두 개 가지고 있는 것과 비슷
  - 하나의 프로세스가 작업, 나머지 프로세스가 작업을 하는 프로세스가 정확히 작동하는지 확인

```kotlin
@Test
fun `should show progress bar when sending data`() =
    runTest {
        val database = FakeDatabase()
        val vm = UserViewModel(database)
        launch {
            vm.showUserData()
        }

        // then
        assertEquals(false, vm.progressBarVisible.value)
        delay(1000)
        assertEquals(true, vm.progressBarVisible.value)
        delay(1000)
        assertEquals(false, vm.progressBarVisible.value)
    }
```

## 새로운 코루틴을 시작하는 함수 테스트하기

- 코루틴은 어딘가에서 시작해야 함
  - 백엔드는 프레임워크에 의해 주로 시작됨
- 직접 만든 스코프 내부에서 코루틴을 시작하는 경우도 있음

```kotlin
@Scheduled(fixedRate = 5000) // why?
fun sendNotifications() {
    notificationsScope.launch {
        val notifications = notificationsRepository
            .notificationsToSend()
        for (notification in notifications) {
            launch {
                notificationsService.send(notification)
                notificationsRepository
                    .markAsSent(notification.id)
            }
        }
    }
}
```

- 어떻게 실제로 동시에 알림을 전송하는지 테스트할 수 있을까?
  - StandardTestDispatcher 를 사용할 수 있음
    - send 와 markAsSent 사이에 지연을 걸어서

```kotlin
@Test
fun testSendNotifications() {
    // given
    val notifications = List(100) { Notification(it) }
    val repo = FakeNotificationsRepository(
        delayMillis = 200,
        notifications = notifications,
    )
    val service = FakeNotificationsService(
        delayMillis = 300,
    )
    val testScope = TestScope()
    val sender = NotificationsSender(
        notificationsRepository = repo,
        notificationsService = service,
        notificationsScope = testScope
    )

    // when
    sender.sendNotifications()
    testScope.advanceUntilIdle()

    // then all notifications are sent and marked
    assertEquals(
        notifications.toSet(),
        service.notificationsSent.toSet()
    )
    assertEquals(
        notifications.map { it.id }.toSet(),
        repo.notificationsMarkedAsSent.toSet()
    )

    // and notifications are sent concurrently
    assertEquals(700, testScope.currentTime) // why?
}
```

## 메인 디스패처 교체하기

## 코루틴을 시작하는 안드로이드 함수 테스트하기

## 룰이 있는 테스트 디스패처 설정하기

- JUnit 4 는 룰 클래스의 사용을 허용
  - 근데 지금은 JUnit 5…
- 룰은 테스트 클래스의 수명 동안 반드시 실행되어야 할 로직을 포함하는 클래스
- 룰은 모든 테스트가 시작 되기 전과 끝난 뒤에 실행해야 할 것들을 정의할 수 있기 때문에, 테스트 디스패처를 설정하고 나중에 이를 해제하는 데 사용할 수 있음
- JUnit 5 의 방식도 확장 클래스를 정의한다는 점에서 크게 차이 나지 않음

## 요약

- 테스트할 때 우리가 알아야 할 몇 가지 규칙만 익히면, 테스트 코드를 깔끔하게 작성할 수 있음
- 아자아자 화이팅!
