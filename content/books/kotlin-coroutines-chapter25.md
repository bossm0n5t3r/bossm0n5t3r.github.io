+++ 
date = 2024-03-24T15:40:00+09:00
title = "[Kotlin Coroutines] 25장. 플로우 테스트하기"
+++

![](/images/books/kotlin-coroutines/cover.webp)

## Note

- 소스코드에 책에 기재된 코드 외에 다른 코드가 없어서 필요한 코드들은 직접 구현했다.
- 자세한 내용은 https://github.com/bossm0n5t3r/kotlin-coroutines/ 에 올라가있으니 참고바란다.

## 변환 함수

- Flow 를 반환하는 대부분의 함수는 Flow 를 반환하는 다른 함수를 호출함
- 가장 흔하고 간단한 경우이므로, 이러한 함수를 어떻게 테스트하는지부터 시작해보자

```kotlin
class ObserveAppointmentsService(
    private val appointmentRepository: AppointmentRepository,
) {
    fun observeAppointments(): Flow<List<Appointment>> =
        appointmentRepository
            .observeAppointments()
            .filterIsInstance<AppointmentsUpdate>()
            .map { it.appointments }
            .distinctUntilChanged()
            .retry {
                it is ApiException && it.code in 500..599
            }
}

```

- 이 메서드에 대해서 아래와 같은 테스트가 필요하다.

### 갱신된 약속만 유지

```kotlin
@Test
fun `should keep only appointments from updates`() =
    runTest {
        // given
        val repo =
            FakeAppointmentRepository(
                flowOf(
                    AppointmentsConfirmed,
                    AppointmentsUpdate(listOf(anAppointment1)),
                    AppointmentsUpdate(listOf(anAppointment2)),
                    AppointmentsConfirmed,
                ),
            )
        val service = ObserveAppointmentsService(repo)

        // when
        val result = service.observeAppointments().toList()

        // then
        assertEquals(
            listOf(
                listOf(anAppointment1),
                listOf(anAppointment2),
            ),
            result,
        )
    }
```

### 이전 원소와 동일한 원소는 제거

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
@Test
fun `should eliminate elements that same as the previous one`() =
    runTest {
        // given
        val repo =
            FakeAppointmentRepository(
                flow {
                    delay(1000)
                    emit(AppointmentsUpdate(listOf(anAppointment1)))
                    emit(AppointmentsUpdate(listOf(anAppointment1)))
                    delay(1000)
                    emit(AppointmentsUpdate(listOf(anAppointment2)))
                    delay(1000)
                    emit(AppointmentsUpdate(listOf(anAppointment2)))
                    emit(AppointmentsUpdate(listOf(anAppointment1)))
                },
            )
        val service = ObserveAppointmentsService(repo)

        // when
        val result =
            service.observeAppointments()
                .map { currentTime to it }
                .toList()

        // then
        assertEquals(
            listOf(
                1000L to listOf(anAppointment1),
                2000L to listOf(anAppointment2),
                3000L to listOf(anAppointment1),
            ),
            result,
        )
    }
```

### 5XX 에러 코드를 가진 API 예외가 발생한다면 재시도해야 함

```kotlin
@Test
fun `should retry when API exception`() =
    runTest {
        // given
        val repo =
            FakeAppointmentRepository(
                flow {
                    emit(AppointmentsUpdate(listOf(anAppointment1)))
                    throw ApiException(502, "Some message")
                },
            )
        val service = ObserveAppointmentsService(repo)

        // when
        val result =
            service.observeAppointments()
                .take(3)
                .toList()

        // then
        assertEquals(
            listOf(
                listOf(anAppointment1),
                listOf(anAppointment1),
                listOf(anAppointment1),
            ),
            result,
        )
    }

@Test
fun `should retry when API exception with the code 5XX`() =
    runTest {
        // given
        var retried = false
        val someException = object : Exception() {}
        val repo =
            FakeAppointmentRepository(
                flow {
                    emit(AppointmentsUpdate(listOf(anAppointment1)))
                    if (!retried) {
                        retried = true
                        throw ApiException(502, "Some message")
                    } else {
                        throw someException
                    }
                },
            )
        val service = ObserveAppointmentsService(repo)

        // when
        val result =
            service.observeAppointments()
                .catch<Any> { emit(it) }
                .toList()

        // then
        assertTrue(retried)
        assertEquals(
            listOf(
                listOf(anAppointment1),
                listOf(anAppointment1),
                someException,
            ),
            result,
        )
    }
```

## 끝나지 않는 플로우 테스트하기

- 상태플로우와 공유플로우를 사용하는 클래스를 테스트하는 건 훨씬 더 복잡함
- 첫 번째 이유는 상태플로우와 공유플로우는 스코프를 필요로 하기 때문
  - runTest 를 사용해 테스트를 할 경우 스코프는 this 가 아닌 backgroundScope 가 되므로, 테스트에서 스코프가 끝나는 걸 기다릴 수 없음
- 두 번째는 상태플로우와 공유플로우는 무한정이기 때문에 스코프가 취소되지 않는 한 플로우도 완료되지 않는다는 것

### 특정 사용자로부터 온 메시지를 감지하는 서비스

```kotlin
class MessagesService(
    messagesSource: Flow<Message>,
    scope: CoroutineScope,
) {
    private val source = messagesSource
        .shareIn(
            scope = scope,
            started = SharingStarted.WhileSubscribed()
        )

    fun observeMessages(fromUserId: String) = source
        .filter { it.fromUserId == fromUserId }
}
```

### 이해하기 쉽게 실패하는 테스트

```kotlin
@Disabled("Failing test!")
@Test
fun `should emit messages from user`() =
    runTest {
        // given
        val source =
            flowOf(
                Message(fromUserId = "0", text = "A"),
                Message(fromUserId = "1", text = "B"),
                Message(fromUserId = "0", text = "C"),
            )
        val service =
            MessagesService(
                messagesSource = source,
                scope = backgroundScope,
            )

        // when
        val result =
            service.observeMessages("0")
                .toList() // Here we'll wait forever!

        // then
        assertEquals(
            listOf(
                Message(fromUserId = "0", text = "A"),
                Message(fromUserId = "0", text = "C"),
            ),
            result,
        )
    }
```

### take 를 사용하는 방법

- 그래서 take 등을 통해 테스트할 수 있지만, 많은 정보를 잃게 된다.
- 테스트가 구현에 얽매여 있어서 실패할 경우 원인을 찾기 힘들어진다.
  - 테스트 내구성이 별로임!

```kotlin
@Test
fun `should emit messages from user using take`() =
    runTest {
        // given
        val source =
            flowOf(
                Message(fromUserId = "0", text = "A"),
                Message(fromUserId = "1", text = "B"),
                Message(fromUserId = "0", text = "C"),
            )
        val service =
            MessagesService(
                messagesSource = source,
                scope = backgroundScope,
            )

        // when
        val result =
            service.observeMessages("0")
                .take(2)
                .toList()

        // then
        assertEquals(
            listOf(
                Message(fromUserId = "0", text = "A"),
                Message(fromUserId = "0", text = "C"),
            ),
            result,
        )
  }
```

### backgroundScope 를 사용하는 방법

- 다음 방법은 backgroundScope 에서 플로우를 시작하고 플로우가 방출하는 모든 원소를 컬렉션에 저장하는 것
  - 실패하는 경우에 명확히 분석 가능
  - 테스트 시간을 유연하게 설정할 수 있게 해줌

```kotlin
@Test
fun `should emit messages from user using backgroundScope`() =
    runTest {
        // given
        val source =
            flow {
                emit(Message(fromUserId = "0", text = "A"))
                delay(1000)
                emit(Message(fromUserId = "1", text = "B"))
                emit(Message(fromUserId = "0", text = "C"))
            }
        val service =
            MessagesService(
                messagesSource = source,
                scope = backgroundScope,
            )

        // when
        val emittedMessages = mutableListOf<Message>()
        service.observeMessages("0")
            .onEach { emittedMessages.add(it) }
            .launchIn(backgroundScope)
        delay(1)

        // then
        assertEquals(
            listOf(
                Message(fromUserId = "0", text = "A"),
            ),
            emittedMessages,
        )

        // when
        delay(1000)

        // then
        assertEquals(
            listOf(
                Message(fromUserId = "0", text = "A"),
                Message(fromUserId = "0", text = "C"),
            ),
            emittedMessages,
        )
    }
```

### 짧은 시간 동안만 감지할 수 있는 toList 함수를 사용하는 방법

- 또 다른 좋은 방법으로는 짧은 시간 동안만 감지할 수 있는 toList 함수를 사용하는 방법
  - 유연성은 떨어짐
  - 간단하고 가독성이 좋아 필자가 선호하는 방법

```kotlin
private suspend fun <T> Flow<T>.toListDuring(duration: Duration): List<T> =
    coroutineScope {
        val result = mutableListOf<T>()
        val job =
            launch {
                this@toListDuring.collect(result::add)
            }
        delay(duration)
        job.cancel()
        return@coroutineScope result
    }

@Test
fun `should emit messages from user using toListDuring`() =
    runTest {
        // given
        val source =
            flow {
                emit(Message(fromUserId = "0", text = "A"))
                emit(Message(fromUserId = "1", text = "B"))
                emit(Message(fromUserId = "0", text = "C"))
            }
        val service =
            MessagesService(
                messagesSource = source,
                scope = backgroundScope,
            )

        // when
        val emittedMessages =
            service.observeMessages("0")
                .toListDuring(1.milliseconds)

        // then
        assertEquals(
            listOf(
                Message(fromUserId = "0", text = "A"),
                Message(fromUserId = "0", text = "C"),
            ),
            emittedMessages,
        )
    }
```

### Turbine 과 같은 라이브러리를 사용하는 방법

- https://github.com/cashapp/turbine

```kotlin
repositories {
		mavenCentral()
}

dependencies {
		testImplementation("app.cash.turbine:turbine:1.1.0")
}
```

```kotlin
@Test
fun `should emit messages from user using turbine`() =
    runTest {
        turbineScope {
            // given
            val source =
                flow {
                    emit(Message(fromUserId = "0", text = "A"))
                    emit(Message(fromUserId = "1", text = "B"))
                    emit(Message(fromUserId = "0", text = "C"))
                }
            val service =
                MessagesService(
                    messagesSource = source,
                    scope = backgroundScope,
                )

            // when
            val messagesTurbine =
                service
                    .observeMessages("0")
                    .testIn(backgroundScope)

            // then
            assertEquals(
                Message(fromUserId = "0", text = "A"),
                messagesTurbine.awaitItem(),
            )
            assertEquals(
                Message(fromUserId = "0", text = "C"),
                messagesTurbine.awaitItem(),
            )
            messagesTurbine.expectNoEvents()
        }
    }
```

## 개방할 연결 개수 정하기

- MessageService 에서 가장 중요한 기능 중 하나는 얼마나 많은 관찰자가 있든지 상관없이 소스에 단 하나의 연결만 시작해야 한다는 것

```kotlin
class MessagesService(
    private val messagesSource: Flow<Message>,
    scope: CoroutineScope,
) {
    private val source =
        messagesSource
            .shareIn(
                scope = scope,
                started = SharingStarted.WhileSubscribed(),
            )

    fun observeMessages(fromUserId: String) =
        source
            .filter { it.fromUserId == fromUserId }

    fun observeMessagesUsingMessagesSource(fromUserId: String) =
        messagesSource
            .filter { it.fromUserId == fromUserId }
}
```

```kotlin
private val infiniteFlow =
    flow<Nothing> {
        while (true) {
            delay(100)
        }
    }

@Test
fun `should start at most one connection`() =
    runTest {
        // given
        var connectionsCounter = 0
        val source =
            infiniteFlow
                .onStart { connectionsCounter++ }
                .onCompletion { connectionsCounter-- }
        val service =
            MessagesService(
                messagesSource = source,
                scope = backgroundScope,
            )

        // when
        service.observeMessages("0")
            .launchIn(backgroundScope)
        service.observeMessages("1")
            .launchIn(backgroundScope)
        service.observeMessages("0")
            .launchIn(backgroundScope)
        service.observeMessages("2")
            .launchIn(backgroundScope)
        delay(1000)

        // then
        assertEquals(1, connectionsCounter)
    }

@Test
fun `should start multiple connections to the source`() =
    runTest {
        // given
        var connectionsCounter = 0
        val source =
            infiniteFlow
                .onStart { connectionsCounter++ }
                .onCompletion { connectionsCounter-- }
        val service =
            MessagesService(
                messagesSource = source,
                scope = backgroundScope,
            )

        // when
        service.observeMessagesUsingMessagesSource("0")
            .launchIn(backgroundScope)
        service.observeMessagesUsingMessagesSource("1")
            .launchIn(backgroundScope)
        service.observeMessagesUsingMessagesSource("0")
            .launchIn(backgroundScope)
        service.observeMessagesUsingMessagesSource("2")
            .launchIn(backgroundScope)
        delay(1000)

        // then
        assertEquals(4, connectionsCounter)
    }
```

## 뷰 모델 테스트하기

- 뷰 모델은 안친해서 스킵

## 요약

- 테스트하는 원리는 중단 함수와 비슷하지만, 플로우는 고유한 특징을 가지고 있으며, 플로우의 특징을 어떻게 테스트할 수 있는지 살펴보았다.
