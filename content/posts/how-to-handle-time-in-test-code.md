+++
date = 2024-07-15T22:00:00+09:00
lastmod = 2024-09-01
title = "테스트 코드에서 시간을 자유롭게 다뤄보자"
authors = ["Ji-Hoon Kim"]
tags = ["Kotlin", "Testing"]
categories = ["Kotlin", "Testing"]
series = ["Kotlin", "Testing"]
+++

![](/images/logos/kotlin-logo.png)

## 개요

- 테스트 코드를 작성하면서 마주치게 되는 흔한 상황 중 하나는 시간이다.
- 테스트 환경에서만 자유롭게 시간을 다룰 수 있으면 얼마나 편할까? 라는 생각에 글을 작성해본다.

## Clock Wrapper 를 사용하기

- 한 가지 방법은 `Clock Wrapper` 를 사용하는 방법이다.
- 이 방법을 사용하면 `Clock Wrapper` 를 생성자로 주입한 뒤에 사용하게 되고, `Clock Wrapper` 를 mocking 처리하면 되기 때문에 다루기 쉬워진다.
- 이런 내용 또한 Martin Fowler 는 이미 써놓았었다.
  - https://martinfowler.com/bliki/ClockWrapper.html

```kotlin
class Clock {
    fun now(): LocalDate = LocalDate.now()
}

class ChristmasDiscount(
    private val clock: Clock, // Clock 을 가져다가 쓰도록 한다.
) {
    fun applyDiscount(rawAmount: Double): Double {
        val today: LocalDate = clock.now()

        var discountPercentage = 0.0
        val isChristmas = today.month == Month.DECEMBER && today.dayOfMonth == 25

        if (isChristmas) discountPercentage = 0.15

        return rawAmount - (rawAmount * discountPercentage)
    }
}

class ChristmasDiscountTest {
    private val clock: Clock = mockk<Clock>()
    private val sut = ChristmasDiscount(clock)

    @Test
    fun christmas() {
        val christmas: LocalDate = LocalDate.of(2015, Month.DECEMBER, 25)
        every { clock.now() } returns christmas // ClockWrapper 를 mocking 하여 사용하면 된다.

        val finalValue = sut.applyDiscount(100.0)
        assertThat(finalValue).isCloseTo(85.0, offset(0.001))
    }

    @Test
    fun notChristmas() {
        val notChristmas: LocalDate = LocalDate.of(2015, Month.DECEMBER, 26)
        every { clock.now() } returns notChristmas

        val finalValue = sut.applyDiscount(100.0)
        assertThat(finalValue).isCloseTo(100.0, offset(0.001))
    }
}
```

## Clock Wrapper 없이 사용하기

- 그런데 매번 서비스에 `Clock Wrapper` 를 주입해서 사용하는건 어렵다.
  - 물론 서비스적으로 주입해서 사용하는거라면 전혀 문제가 없지만,
    - 글로벌 서비스에서는 주입해서 써야하지 않을까?
  - 테스트를 위해서 서비스 로직을 바꾸는건 너무 위험하다.
- 그러면 어떻게 해야할까? 🤔
- LocalDate, LocalDateTime 자체를 mocking 하면 된다.
- 일단 `Clock Wrapper` 를 주입하지 않은 서비스 로직을 보자.

```kotlin
class ChristmasDiscountWithoutClock {
    fun applyDiscount(rawAmount: Double): Double {
        val today: LocalDate = LocalDate.now()

        var discountPercentage = 0.0
        val isChristmas = today.month == Month.DECEMBER && today.dayOfMonth == 25

        if (isChristmas) discountPercentage = 0.15

        return rawAmount - (rawAmount * discountPercentage)
    }
}
```

- 우리가 일반적으로 보는 서비스 로직이다.
- 이제 테스트 코드를 작성해보자.

```kotlin
class ChristmasDiscountWithoutClockTest {
    private val sut = ChristmasDiscountWithoutClock()

    @Test
    fun christmas() {
        val christmas: LocalDate = LocalDate.of(2015, Month.DECEMBER, 25)

        val finalValue =
            resetClock(christmas) {
                sut.applyDiscount(100.0)
            }

        assertThat(finalValue).isCloseTo(85.0, offset(0.001))
    }

    @Test
    fun notChristmas() {
        val notChristmas: LocalDate = LocalDate.of(2015, Month.DECEMBER, 26)

        val finalValue =
            resetClock(notChristmas) {
                sut.applyDiscount(100.0)
            }

        assertThat(finalValue).isCloseTo(100.0, offset(0.001))
    }
}

fun <T> resetClock(
    targetLocalDate: LocalDate,
    block: () -> T,
): T {
    mockkStatic(LocalDate::class)
    every { LocalDate.now() } returns targetLocalDate
    return block.invoke().also { unmockkStatic(LocalDate::class) }
}
```

- `resetClock` 이라는 별도의 메서드를 작성해서 처리해보았다.
- 인자로 받은 `targetLocalDate` 를 리턴하도록 모킹한 다음,
- 주입받은 메서드를 실행한 결과를 리턴하고,
- 마지막에 static mocking 처리한 걸 풀어줘서 다른 테스트 코드에 영향을 끼치지 않도록 하였다.

## References

- https://martinfowler.com/bliki/ClockWrapper.html
