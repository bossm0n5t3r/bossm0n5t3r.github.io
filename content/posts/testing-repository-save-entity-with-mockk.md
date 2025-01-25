+++
date = 2025-01-25T23:45:00+09:00
title = "MockK 에서 Repository Entity 저장 테스트하기: Slot Capture 완벽 가이드"
authors = ["Ji-Hoon Kim"]
tags = ["Kotlin", "Testing"]
categories = ["Kotlin", "Testing"]
series = ["Kotlin", "Testing"]
+++

![](/images/logos/kotlin-logo.png)

## Introduction

- 최근 테스트 코드를 작성하면서 `repository.save(entity)` 를 mocking 하고 그 결과를 검증해야 하는 코드를 작성해야 했다.
- 그런데 생각해보니 아직까지 MockK 라이브러리를 통해서 작성했던 기억이 없었다.
- 그래서 그 과정을 공유해보려고 한다.
- 부제에서 알 수 있다시피, Slot Capture를 활용한 다양한 테스트 방법을 소개해보려고 한다.

## 기본 설정

- 의존성은 아래와 같이 추가해주면 된다.

```kotlin
dependencies {
    testImplementation("io.mockk:mockk:1.13.16")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa:3.4.2")
    testImplementation("org.assertj:assertj-core:3.27.3")
}
```

## 테스트할 도메인 클래스 준비

```kotlin
data class UserEntity(
    val id: Long? = null,
    val name: String,
    val age: Int,
    val updatedAt: LocalDateTime? = null
)

interface UserRepository : JpaRepository<UserEntity, Long>

class UserService(
    private val userRepository: UserRepository
) {
    fun saveUser(user: UserEntity): UserEntity {
        return userRepository.save(user)
    }
}
```

## 기본적인 Entity 저장 테스트

- 가장 간단한 형태의 테스트는 아래와 같다.

```kotlin
@Test
fun `사용자 저장 테스트`() {
    // given
    val entitySlot = slot<UserEntity>()
    val repository = mockk<UserRepository>()
    every { repository.save(capture(entitySlot)) } answers { entitySlot.captured }

    val userService = UserService(repository)
    val user = UserEntity(name = "홍길동", age = 25)

    // when
    userService.saveUser(user)

    // then
    verify { repository.save(any()) }
    assertThat(entitySlot.captured).run {
        assertThat(actual().name).isEqualTo("홍길동")
        assertThat(actual().age).isEqualTo(25)
    }
}
```

- 아래처럼 작성해도 된다.

```kotlin
@Test
fun `사용자 저장 테스트`() {
    // given
    val entitySlot = slot<UserEntity>()
    val repository = mockk<UserRepository>()
    every { repository.save(capture(entitySlot)) } answers { entitySlot.captured }

    val userService = UserService(repository)
    val user = UserEntity(name = "홍길동", age = 25)

    // when
    val saved = userService.saveUser(user)

    // then
    verify { repository.save(any()) }
    assertThat(saved).run {
        assertThat(actual().name).isEqualTo("홍길동")
        assertThat(actual().age).isEqualTo(25)
    }
}
```

## 다중 Entity 저장 테스트

- 여러 Entity를 저장하고 검증해야 하는 경우

```kotlin
@Test
fun `여러 사용자 저장 테스트`() {
    // given
    val capturedEntities = mutableListOf<UserEntity>()
    val repository = mockk<UserRepository>()
    every { repository.save(capture(capturedEntities)) } answers { lastArg() }

    val userService = UserService(repository)

    // when
    val user1 = UserEntity(name = "홍길동", age = 25)
    val user2 = UserEntity(name = "김철수", age = 30)

    userService.saveUser(user1)
    userService.saveUser(user2)

    // then
    verify(exactly = 2) { repository.save(any()) }
    assertThat(capturedEntities).hasSize(2)
    assertThat(capturedEntities[0].name).isEqualTo("홍길동")
    assertThat(capturedEntities[1].name).isEqualTo("김철수")
}

```

- 각각의 entity 를 검증하고 싶은 경우 아래처럼 작성할 수도 있다.

```kotlin
@Test
fun `여러 사용자 저장 테스트`() {
    // given
    val capturedEntities = mutableListOf<UserEntity>()
    val repository = mockk<UserRepository>()
    every { repository.save(capture(capturedEntities)) } answers { lastArg() }

    val userService = UserService(repository)

    // when
    val user1 = UserEntity(name = "홍길동", age = 25)
    val user2 = UserEntity(name = "김철수", age = 30)

    val saved1 = userService.saveUser(user1)
    val saved2 = userService.saveUser(user2)

    // then
    verify(exactly = 2) { repository.save(any()) }
    assertThat(capturedEntities).hasSize(2)
    assertThat(capturedEntities[0].name).isEqualTo("홍길동")
    assertThat(capturedEntities[1].name).isEqualTo("김철수")

    assertThat(saved1.name).isEqualTo("홍길동")
    assertThat(saved2.name).isEqualTo("김철수")
}
```

## Entity 수정이 포함된 저장 테스트

- 저장 시점에 Entity의 일부 필드가 수정되는 경우를 테스트

```kotlin
@Test
fun `저장 시 업데이트 시간이 설정되는지 테스트`() {
    // given
    val entitySlot = slot<UserEntity>()
    val now = LocalDateTime.now()

    val repository = mockk<UserRepository>()
    every { repository.save(capture(entitySlot)) } answers {
        entitySlot.captured.copy(
            updatedAt = now
        )
    }

    val userService = UserService(repository)

    // when
    val user = UserEntity(name = "홍길동", age = 25)
    val savedUser = userService.saveUser(user)

    // then
    verify { repository.save(any()) }
    assertThat(savedUser.updatedAt).isEqualTo(now)
}

```

## 예외 상황 테스트

- 저장 실패 시의 예외 처리를 테스트

```kotlin
@Test
fun `저장 실패 시 예외 발생 테스트`() {
    // given
    val entitySlot = slot<UserEntity>()
    val repository = mockk<UserRepository>()
    every { repository.save(capture(entitySlot)) } throws
        RuntimeException("데이터베이스 저장 실패")

    val userService = UserService(repository)
    val user = UserEntity(name = "홍길동", age = 25)

    // when & then
    assertThrows<RuntimeException> {
        userService.saveUser(user)
    }

    verify { repository.save(any()) }
}

```

## 테스트 작성 시 주의사항

1. **`Slot` 재사용**: `slot` 은 한 번만 캡처할 수 있으므로, 여러 호출을 캡처하려면 `mutableListOf` 를 사용해야 한다.
2. **테스트 격리**: 각 테스트마다 새로운 `slot` 을 생성하여 테스트 간 격리를 보장
3. **검증 순서**: `verify` 는 일반적으로 테스트의 마지막에 수행한다.
4. **명확한 given-when-then**: 테스트 구조를 명확히 하여 가독성을 높인다.

## 결론

- `Mockk` 의 `Slot Capture` 기능을 활용하면 `Repository` 계층의 `Entity` 저장 로직을 효과적으로 테스트할 수 있다.
  - 특히 저장되는 `Entity` 의 값을 검증하거나, 저장 시점에 발생하는 부수 효과를 테스트하는데 유용하다.
- 이러한 테스트를 통해 비즈니스 로직의 정확성을 검증하고, 코드의 품질을 향상시킬 수 있다.
