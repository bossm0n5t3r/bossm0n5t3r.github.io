+++
date = 2025-04-09T03:15:00+09:00
title = "Dispatchers.IO 하드코딩된 코루틴 테스트: Kotlin 비동기 코드 검증하기"
authors = ["Ji-Hoon Kim"]
tags = ["Kotlin", "Coroutine", "Testing"]
categories = ["Kotlin", "Coroutine", "Testing"]
series = ["Kotlin", "Coroutine", "Testing"]
+++

![](/images/logos/kotlin-logo.png)

## Introduction

- 코틀린에서 비동기 코드를 테스트할 때 `Dispatchers.IO` 가 하드코딩된 경우, 다음과 같은 전략으로 테스트를 작성할 수 있다.
- 이 가이드는 프로덕션 코드를 최소한으로 수정하면서 안정적인 검증을 수행하는 방법을 설명해보겠다.

## 문제 분석

```kotlin
package coroutines

class AService {
    fun nonSuspendingFunction() {
        println("AService nonSuspendingFunction")
    }
}
```

```kotlin
package coroutines

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class BService(
    private val aService: AService,
) {
    fun nonSuspendingFunction() {
        println("BService nonSuspendingFunction")
        CoroutineScope(Dispatchers.IO).launch {
            aService.nonSuspendingFunction()
        }
    }
}
```

- 문제점은 아래와 같다.
  - `Dispatchers.IO` 는 실제 스레드 풀을 사용하므로 테스트에서 코루틴 완료 시점을 제어할 수 없다.
- 따라서 `aService.nonSuspendingFunction()` 호출 여부를 검증할 때 랜덤 실패가 발생한다.

## 해결 방법 1: Static Mocking (추천)

### 1. 의존성 추가

```kotlin
// build.gradle.kts
testImplementation("io.mockk:mockk:1.13.17")
testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.10.1")

```

### 2. 테스트 코드

```kotlin
package coroutines

import io.mockk.every
import io.mockk.mockk
import io.mockk.mockkStatic
import io.mockk.unmockkAll
import io.mockk.verify
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import kotlin.test.Test

class BServiceTest {
    @OptIn(ExperimentalCoroutinesApi::class)
    private val testDispatcher = UnconfinedTestDispatcher()
    private val aService = mockk<AService>(relaxed = true)
    private val bService = BService(aService)

    @BeforeEach
    fun setup() {
        // Dispatchers.IO 를 테스트 Dispatcher 로 대체
        mockkStatic(Dispatchers::class)
        every { Dispatchers.IO } returns testDispatcher
    }

    @AfterEach
    fun tearDown() {
        unmockkAll() // mocking 해제
    }

    @OptIn(ExperimentalCoroutinesApi::class)
    @Test
    fun testNonSuspendingFunction() =
        runTest(testDispatcher) {
            // When
            bService.nonSuspendingFunction()

            // Then: 모든 코루틴 작업 완료 보장
            advanceUntilIdle()
            verify(exactly = 1) { aService.nonSuspendingFunction() }
        }
}
```

- 동작 원리는 아래와 같다.
- `mockkStatic(Dispatchers::class)` 로 정적 클래스 모킹
- `every { Dispatchers.IO } returns testDispatcher` 로 실제 IO Dispatcher 를 테스트용으로 교체
- `advanceUntilIdle()` 로 코루틴이 완료될 때까지 가상 시간을 진행

## 해결 방법 2: CoroutineScope 재정의 (점진적 리팩토링)

### 1. 프로덕션 코드 수정

```kotlin
package coroutines

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class RefactoredBService(
    private val aService: AService,
) {
    // 기본값은 Dispatchers.IO, 테스트에서 재정의 가능
    var coroutineScope = CoroutineScope(Dispatchers.IO)

    fun nonSuspendingFunction() {
        println("BService nonSuspendingFunction")
        coroutineScope.launch {
            aService.nonSuspendingFunction()
        }
    }
}
```

### 2. 테스트 코드

```kotlin
package coroutines

import io.mockk.mockk
import io.mockk.verify
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runTest
import kotlin.test.Test

class RefactoredBServiceTest {
    @OptIn(ExperimentalCoroutinesApi::class)
    @Test
    fun testNonSuspendingFunction() =
        runTest {
            // Given
            val testScope = this
            val aService = mockk<AService>(relaxed = true)
            val bService =
                RefactoredBService(aService).apply {
                    coroutineScope = testScope // 테스트에서 재정의 가능
                }

            // When
            bService.nonSuspendingFunction()

            // Then: 모든 코루틴 작업 완료 보장
            advanceUntilIdle()
            verify(exactly = 1) { aService.nonSuspendingFunction() }
        }
}

```

- 이렇게 수정하면 아래와 같은 장점이 있다.
- **점진적 개선 가능**: 기존 코드 변경을 최소화하면서 테스트 가능
- **명시적 제어**: 테스트에서 코루틴 스코프를 완전히 제어할 수 있음

## 실패 사례 vs 성공 사례

### 실패 사례 (주의해야 할 패턴)

```kotlin
@Test
fun `잘못된 테스트`() {
    // X runTest 블록 없음
    bService.nonSuspendFunction()
    // X advanceUntilIdle() 누락
    verify { aService.nonSuspendingFunction() } // 검증 실패
}

```

- 원인: 코루틴이 백그라운드 스레드에서 실행 중일 때 검증이 먼저 수행된다.

### 성공 사례

```kotlin
@Test
fun `올바른 테스트`() = runTest {
    // 1. Dispatchers.IO를 TestDispatcher로 교체
    // 2. advanceUntilIdle()로 모든 작업 완료
    verify { aService.nonSuspendingFunction() } // 성공
}
```

## 고급 주제: DI 방식으로 전환

- 장기적인 솔루션으로 **의존성 주입**을 도입하는 것이 가장 좋다.

### 1. Dispatcher 제공 클래스 생성

```kotlin
package coroutines

import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers

class CoroutineDispatchers(
    val io: CoroutineDispatcher = Dispatchers.IO,
)

```

```kotlin
package coroutines

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

class DependencyInjectedBService(
    private val aService: AService,
    private val dispatchers: CoroutineDispatchers = CoroutineDispatchers(),
) {
    fun nonSuspendingFunction() {
        println("BService nonSuspendingFunction")
        CoroutineScope(dispatchers.io).launch {
            aService.nonSuspendingFunction()
        }
    }
}

```

### 2. 테스트 코드

```kotlin
package coroutines

import io.mockk.mockk
import io.mockk.verify
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runTest
import kotlin.test.Test

@OptIn(ExperimentalCoroutinesApi::class)
class DependencyInjectedBServiceTest {
    private val testDispatcher = UnconfinedTestDispatcher()
    private val aService = mockk<AService>(relaxed = true)
    private val bService = DependencyInjectedBService(aService, CoroutineDispatchers(testDispatcher))

    @Test
    fun testNonSuspendingFunction() =
        runTest {
            // When
            bService.nonSuspendingFunction()

            // Then: 모든 코루틴 작업 완료 보장
            advanceUntilIdle()
            verify(exactly = 1) { aService.nonSuspendingFunction() }
        }
}

```

## 결론

- **즉시 적용 가능한 방법**: Static Mocking을 사용해 기존 코드 변경 없이 테스트
- **장기적인 해결책**: DI 패턴을 도입하여 코루틴 디스패처를 주입받도록 리팩토링
- **공통 핵심**: `advanceUntilIdle()` 로 코루틴 완료를 보장하고 `verify` 로 검증
- 이 가이드를 통해 하드코딩된 `Dispatchers.IO` 를 사용하는 코드도 안정적으로 테스트할 수 있다.
- 테스트가 실패할 경우 **코루틴 완료 시점**과 **디스패처 교체 여부**를 반드시 확인해보자.
