+++
date = 2024-10-29T03:00:00+09:00
title = "JVM 예외 처리 최적화: 스택 트레이스 비용 줄이기"
authors = ["Ji-Hoon Kim"]
tags = ["JVM", "Kotlin", "Exception", "Optimization"]
categories = ["JVM", "Kotlin", "Exception", "Optimization"]
series = ["JVM", "Kotlin", "Exception", "Optimization"]
+++

## Introduction

- 예외 처리는 프로그램의 안정성을 위해 필수적이지만, 때로는 성능에 상당한 영향을 미칠 수 있다.
- 특히 스택 트레이스 생성은 예외 처리 과정에서 상당한 비용을 차지한다.
- 이번 글에서는 JVM에서 예외 처리를 최적화하는 방법, 특히 스택 트레이스 생성 비용을 줄이는 기법에 대해 알아보겠다.
- 이 글에서는 Kotlin을 주요 예시로 사용하지만, 여기서 다루는 개념들은 대부분의 JVM 기반 언어에 적용될 수 있다.

## 문제: 스택 트레이스 생성 비용

- 일반적인 예외 처리에서는 예외가 발생할 때마다 전체 스택 트레이스가 생성된다.
- 이 과정은 CPU와 메모리를 많이 사용하며, 특히 예외가 자주 발생하는 시스템에서는 전체 성능에 큰 영향을 미칠 수 있다.

## 해결책: 사용자 정의 예외로 스택 트레이스 최적화

- 이 문제를 해결하기 위해, 우리는 `fillInStackTrace()` 메서드를 오버라이드하는 사용자 정의 예외 클래스를 만들 수 있다.
- 이 방법을 통해 스택 트레이스 생성을 최소화하고 성능을 향상시킬 수 있다.

```kotlin
class CustomException(
    message: String? = null,
    cause: Throwable? = null,
) : Exception(message, cause) {
    constructor(cause: Throwable) : this(null, cause)

    override fun fillInStackTrace(): Throwable = this
}
```

## 성능 비교: 벤치마크 테스트

- 이 최적화의 효과를 측정하기 위해, `kotlinx.benchmark` 를 사용하여 벤치마크 테스트를 수행해봤다.

```kotlin
package benchmark

import kotlinx.benchmark.Benchmark
import kotlinx.benchmark.BenchmarkMode
import kotlinx.benchmark.BenchmarkTimeUnit
import kotlinx.benchmark.Blackhole
import kotlinx.benchmark.Measurement
import kotlinx.benchmark.Mode
import kotlinx.benchmark.OutputTimeUnit
import kotlinx.benchmark.Scope
import kotlinx.benchmark.State
import kotlinx.benchmark.Warmup
import kotlin.random.Random

@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(BenchmarkTimeUnit.NANOSECONDS)
@Warmup(iterations = 10, time = 500, timeUnit = BenchmarkTimeUnit.NANOSECONDS)
@Measurement(iterations = 100, time = 1, timeUnit = BenchmarkTimeUnit.NANOSECONDS)
@State(Scope.Benchmark)
class ExceptionBenchmark {
    class CustomException(
        message: String? = null,
        cause: Throwable? = null,
    ) : Exception(message, cause) {
        constructor(cause: Throwable) : this(null, cause)

        override fun fillInStackTrace(): Throwable = this
    }

    class RegularException(
        message: String? = null,
        cause: Throwable? = null,
    ) : Exception(message, cause) {
        constructor(cause: Throwable) : this(null, cause)
    }

    @Benchmark
    fun customExceptionCaught() {
        try {
            try {
                check(Random.nextBoolean())
            } catch (e: IllegalStateException) {
                throw CustomException("Custom exception occurred!")
            }
        } catch (e: CustomException) {
            // Do nothing
        }
    }

    @Benchmark
    fun regularExceptionCaught() {
        try {
            try {
                check(Random.nextBoolean())
            } catch (e: IllegalStateException) {
                throw RegularException("Regular exception occurred!")
            }
        } catch (e: RegularException) {
            // Do nothing
        }
    }

    @Benchmark
    fun throwAndCatchCustomException(blackhole: Blackhole) {
        try {
            throw CustomException("Custom exception occurred!")
        } catch (e: CustomException) {
            blackhole.consume(e)
        }
    }

    @Benchmark
    fun throwAndCatchRegularException(blackhole: Blackhole) {
        try {
            throw RegularException("Regular exception occurred!")
        } catch (e: RegularException) {
            blackhole.consume(e)
        }
    }

    @Benchmark
    fun throwCustomExceptionAndUnwindStackTrace(blackhole: Blackhole) {
        try {
            throw CustomException("Custom exception occurred!")
        } catch (e: CustomException) {
            blackhole.consume(e.fillInStackTrace())
        }
    }

    @Benchmark
    fun throwRegularExceptionAndUnwindStackTrace(blackhole: Blackhole) {
        try {
            throw RegularException("Regular exception occurred!")
        } catch (e: RegularException) {
            blackhole.consume(e.fillInStackTrace())
        }
    }
}
```

## 벤치마크 결과

- 벤치마크 실행 결과는 다음과 같다.

```
main summary:
Benchmark                                                    Mode  Cnt     Score      Error  Units
ExceptionBenchmark.customExceptionCaught                     avgt  100  2703.668 ± 2097.856  ns/op
ExceptionBenchmark.regularExceptionCaught                    avgt  100  4432.898 ± 3822.089  ns/op
ExceptionBenchmark.throwAndCatchCustomException              avgt  100   372.947 ±  456.352  ns/op
ExceptionBenchmark.throwAndCatchRegularException             avgt  100  1941.444 ±  625.122  ns/op
ExceptionBenchmark.throwCustomExceptionAndUnwindStackTrace   avgt  100   341.263 ±  299.158  ns/op
ExceptionBenchmark.throwRegularExceptionAndUnwindStackTrace  avgt  100  3484.684 ± 1228.608  ns/op
```

- 이 결과를 통해 우리는 다음과 같은 결론을 도출할 수 있다.
- 성능 향상
  - 모든 시나리오에서 사용자 정의 예외(`CustomException`)가 일반 예외(`RegularException`)보다 현저히 빠른 처리 속도를 보여준다.
  - 예외를 발생시키고 잡는 경우(`throwAndCatch`), 사용자 정의 예외가 일반 예외보다 `약 5.2배` 빠르다.
  - 스택 트레이스를 언와인드하는 경우, 사용자 정의 예외가 일반 예외보다 `약 10.2배` 빠르다.
- 변동성
  - 모든 벤치마크에서 상당한 오차 범위가 관찰된다.
    - 이는 예외 처리 시간이 실행마다 크게 변할 수 있음을 시사
  - 특히 예외를 잡는 작업(caught)에서 변동성이 더 크다.
- 최적화 효과
  - 사용자 정의 예외(`CustomException`)는 일반 예외(`RegularException`)에 비해 모든 시나리오에서 현저한 성능 향상을 보여준다.
  - 이는 스택 트레이스 생성 및 처리가 예외 처리 과정에서 상당한 비중을 차지함을 명확히 보여준다.

## 단점: 디버깅의 어려움

- 스택 트레이스를 최적화할 경우 디버깅이 어려워지는 주요 이유는 다음과 같다.
  - 정보 손실
    - 스택 트레이스 최적화는 일반적으로 스택 트레이스의 크기를 줄이거나 일부 정보를 생략하는 방식으로 이루어진다.
    - 이로 인해 예외가 발생한 정확한 위치나 호출 경로에 대한 상세 정보가 누락될 수 있다.
  - 컨텍스트 부족
    - 최적화된 스택 트레이스는 전체 실행 컨텍스트를 제공하지 않을 수 있어, 문제의 근본 원인을 파악하기 어려워질 수 있다.
  - 비동기 실행 추적 어려움
    - 특히 리액티브 프로그래밍 환경에서는 여러 스레드에 걸쳐 실행되는 작업의 전체 흐름을 파악하기 어려워질 수 있다.
  - 간접적인 오류 위치
    - 최적화로 인해 실제 오류 발생 지점과 스택 트레이스에 표시된 위치가 일치하지 않을 수 있어, 문제의 정확한 위치를 특정하기 어려워진다.
  - 라이브러리 및 프레임워크 내부 정보 부족
    - 사용 중인 라이브러리나 프레임워크 내부에서 발생한 문제를 추적하기 어려워질 수 있다.
  - 예외 연쇄 정보 손실
    - 여러 예외가 연쇄적으로 발생한 경우, 최적화로 인해 이러한 연쇄 정보가 손실될 수 있다.
- 실제로 어떤 식으로 정보가 손실되고 정확한 위치를 특정하기 어려워지는 걸까?
- 코드를 통해 확인해보자.

```kotlin
package exception

import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import java.io.IOException

// 최적화된 사용자 정의 예외
class OptimizedException(
    message: String? = null,
    throwable: Throwable? = null,
) : Exception(message, throwable) {
    constructor(throwable: Throwable) : this(null, throwable)

    override fun fillInStackTrace(): Throwable = this
}

// 일반적인 예외를 사용하는 함수
fun regularExceptionExample() {
    try {
        throwRegularException()
    } catch (e: IOException) {
        println("Regular Exception:")
        e.printStackTrace()
    }
}

fun throwRegularException(): Unit = throw IOException("Regular IO Exception")

// 최적화된 예외를 사용하는 함수
fun optimizedExceptionExample() {
    try {
        throwOptimizedException()
    } catch (e: OptimizedException) {
        println("Optimized Exception:")
        e.printStackTrace()
    }
}

fun throwOptimizedException(): Unit = throw OptimizedException("Optimized Exception")

// 간접적인 오류 위치를 보여주는 함수
fun indirectErrorExample() {
    try {
        someOperation()
    } catch (e: OptimizedException) {
        println("Indirect Error Example:")
        e.printStackTrace()
    }
}

fun someOperation() {
    anotherOperation()
}

fun anotherOperation(): Unit = throw OptimizedException("Error in another operation")

fun main() =
    runBlocking {
        regularExceptionExample()
        delay(1000)
        println("\n")
        optimizedExceptionExample()
        delay(1000)
        println("\n")
        indirectErrorExample()
    }

```

- 실행하면 아래와 같이 나오게 된다.

```bash
Regular Exception:
java.io.IOException: Regular IO Exception
	at exception.ExceptionOptimizationKt.throwRegularException(ExceptionOptimization.kt:27)
	at exception.ExceptionOptimizationKt.regularExceptionExample(ExceptionOptimization.kt:20)
	at exception.ExceptionOptimizationKt$main$1.invokeSuspend(ExceptionOptimization.kt:59)
	at kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)
	at kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:102)
	at kotlinx.coroutines.EventLoopImplBase.processNextEvent(EventLoop.common.kt:263)
	at kotlinx.coroutines.BlockingCoroutine.joinBlocking(Builders.kt:95)
	at kotlinx.coroutines.BuildersKt__BuildersKt.runBlocking(Builders.kt:69)
	at kotlinx.coroutines.BuildersKt.runBlocking(Unknown Source)
	at kotlinx.coroutines.BuildersKt__BuildersKt.runBlocking$default(Builders.kt:47)
	at kotlinx.coroutines.BuildersKt.runBlocking$default(Unknown Source)
	at exception.ExceptionOptimizationKt.main(ExceptionOptimization.kt:58)
	at exception.ExceptionOptimizationKt.main(ExceptionOptimization.kt)

Optimized Exception:
exception.OptimizedException: Optimized Exception

Indirect Error Example:
exception.OptimizedException: Error in another operation

```

- `regularExceptionExample()`에서는 전체 스택 트레이스가 표시되어 예외가 발생한 정확한 위치와 호출 경로를 볼 수 있다.
- `optimizedExceptionExample()`에서는 스택 트레이스 정보가 거의 없어, 예외가 어디서 발생했는지 알기 어렵다.
- `indirectErrorExample()`에서는 예외가 `anotherOperation()` 함수에서 발생했지만, 스택 트레이스 최적화로 인해 이 정보를 알 수 없다.
- 실제 오류가 발생한 `anotherOperation()` 함수나 이를 호출한 `someOperation()` 함수에 대한 정보가 스택 트레이스에 나타나지 않는다.

## 결론

- 스택 트레이스 생성을 최적화함으로써 예외 처리의 성능을 상당히 개선할 수 있다.
- 특히 예외 처리가 빈번하거나 성능에 민감한 시스템에서 큰 이점을 얻을 수 있다.
- 하지만 이 최적화를 적용할 때는 다음 사항을 고려해야 한다.
  1. 디버깅의 어려움
     1. 스택 트레이스가 없으면 문제 추적이 어려울 수 있다.
  2. 선택적 적용
     1. 모든 예외에 이 기법을 적용하기보다는, 성능 크리티컬한 부분에만 선택적으로 적용하는 것이 좋다.
  3. 로깅 전략
     1. 스택 트레이스 대신 다른 방법으로 문제를 추적할 수 있는 로깅 전략을 수립해야 한다.
- 성능 향상이 명확하지만, 스택 트레이스 정보의 손실로 인한 디버깅 어려움을 고려해야 한다.
- 성능이 중요한 부분에 선택적으로 적용하고, 적절한 로깅 전략을 함께 구현하는 것이 바람직하다.
- 개발 및 테스트 환경에서는 전체 스택 트레이스를 유지하고, 프로덕션 환경에서 선택적으로 최적화를 적용하는 전략이 효과적일 수 있다.
- 이 최적화 기법을 적절히 활용하면, 애플리케이션의 전반적인 성능을 향상시키면서도 안정성을 유지할 수 있다.

## References

- https://www.baeldung.com/java-exceptions-performance
