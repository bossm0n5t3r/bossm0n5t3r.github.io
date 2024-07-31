+++
date = 2024-08-01T01:30:00+09:00
title = "For Loop Comparison in Kotlin"
authors = ["Ji-Hoon Kim"]
tags = ["Kotlin"]
categories = ["Kotlin"]
series = ["Kotlin"]
+++

## Introduction

- Kotlin 에는 for loop 을 쓸 수도 있지만, forEach 를 통해서도 동일한 기능을 할 수 있다.
- 그러던 도중 둘 사이에 성능 차이가 있다고 들었고, 실제로 그러한지 검증하고자 벤치마크 코드를 작성해여 실행 해보았다.
- 전체 개수는 `15_000_000` 개로 설정한 뒤에 실행했다.

## Benchmark Result

### for loop

```
Warm-up 1: 1.834 ms/op
Warm-up 2: 1.744 ms/op
Warm-up 3: 1.741 ms/op
Warm-up 4: 1.743 ms/op
Warm-up 5: 1.733 ms/op
Warm-up 6: 1.737 ms/op
Warm-up 7: 1.731 ms/op
Warm-up 8: 1.730 ms/op
Warm-up 9: 1.732 ms/op
Warm-up 10: 1.732 ms/op
Iteration 1: 1.736 ms/op
Iteration 2: 1.736 ms/op
Iteration 3: 1.739 ms/op
Iteration 4: 1.742 ms/op
Iteration 5: 1.795 ms/op
Iteration 6: 1.738 ms/op
Iteration 7: 1.732 ms/op
Iteration 8: 1.735 ms/op
Iteration 9: 1.736 ms/op
Iteration 10: 1.734 ms/op
Iteration 11: 1.743 ms/op
Iteration 12: 1.740 ms/op
Iteration 13: 1.739 ms/op
Iteration 14: 1.738 ms/op
Iteration 15: 1.738 ms/op
Iteration 16: 1.797 ms/op
Iteration 17: 1.733 ms/op
Iteration 18: 1.740 ms/op
Iteration 19: 1.765 ms/op
Iteration 20: 1.737 ms/op

1.745 ±(99.9%) 0.016 ms/op [Average]
  (min, avg, max) = (1.732, 1.745, 1.797), stdev = 0.019
  CI (99.9%): [1.728, 1.761] (assumes normal distribution)
```

### forEach

```
Warm-up 1: 13.094 ms/op
Warm-up 2: 12.564 ms/op
Warm-up 3: 12.566 ms/op
Warm-up 4: 12.551 ms/op
Warm-up 5: 12.541 ms/op
Warm-up 6: 12.543 ms/op
Warm-up 7: 12.560 ms/op
Warm-up 8: 12.563 ms/op
Warm-up 9: 12.546 ms/op
Warm-up 10: 12.641 ms/op
Iteration 1: 12.593 ms/op
Iteration 2: 12.617 ms/op
Iteration 3: 12.634 ms/op
Iteration 4: 12.697 ms/op
Iteration 5: 12.612 ms/op
Iteration 6: 12.552 ms/op
Iteration 7: 12.551 ms/op
Iteration 8: 12.552 ms/op
Iteration 9: 12.551 ms/op
Iteration 10: 12.550 ms/op
Iteration 11: 12.552 ms/op
Iteration 12: 12.555 ms/op
Iteration 13: 12.552 ms/op
Iteration 14: 12.548 ms/op
Iteration 15: 12.553 ms/op
Iteration 16: 12.555 ms/op
Iteration 17: 12.548 ms/op
Iteration 18: 12.554 ms/op
Iteration 19: 12.553 ms/op
Iteration 20: 12.553 ms/op

12.572 ±(99.9%) 0.034 ms/op [Average]
  (min, avg, max) = (12.548, 12.572, 12.697), stdev = 0.040
  CI (99.9%): [12.537, 12.606] (assumes normal distribution)
```

### forEachIndexed

```
Warm-up 1: 14.522 ms/op
Warm-up 2: 14.052 ms/op
Warm-up 3: 14.052 ms/op
Warm-up 4: 14.054 ms/op
Warm-up 5: 14.051 ms/op
Warm-up 6: 14.053 ms/op
Warm-up 7: 14.051 ms/op
Warm-up 8: 14.042 ms/op
Warm-up 9: 14.053 ms/op
Warm-up 10: 14.034 ms/op
Iteration 1: 14.048 ms/op
Iteration 2: 14.052 ms/op
Iteration 3: 14.050 ms/op
Iteration 4: 14.043 ms/op
Iteration 5: 14.046 ms/op
Iteration 6: 14.046 ms/op
Iteration 7: 14.045 ms/op
Iteration 8: 14.048 ms/op
Iteration 9: 14.047 ms/op
Iteration 10: 14.049 ms/op
Iteration 11: 14.053 ms/op
Iteration 12: 14.049 ms/op
Iteration 13: 14.052 ms/op
Iteration 14: 14.048 ms/op
Iteration 15: 14.052 ms/op
Iteration 16: 14.041 ms/op
Iteration 17: 14.056 ms/op
Iteration 18: 14.045 ms/op
Iteration 19: 14.047 ms/op
Iteration 20: 14.049 ms/op

14.048 ±(99.9%) 0.003 ms/op [Average]
  (min, avg, max) = (14.041, 14.048, 14.056), stdev = 0.004
  CI (99.9%): [14.045, 14.051] (assumes normal distribution)
```

### iterator

```
Warm-up 1: 13.090 ms/op
Warm-up 2: 12.562 ms/op
Warm-up 3: 12.554 ms/op
Warm-up 4: 12.556 ms/op
Warm-up 5: 12.555 ms/op
Warm-up 6: 12.550 ms/op
Warm-up 7: 12.558 ms/op
Warm-up 8: 12.556 ms/op
Warm-up 9: 12.546 ms/op
Warm-up 10: 12.552 ms/op
Iteration 1: 12.549 ms/op
Iteration 2: 12.555 ms/op
Iteration 3: 12.550 ms/op
Iteration 4: 12.552 ms/op
Iteration 5: 12.551 ms/op
Iteration 6: 12.549 ms/op
Iteration 7: 12.548 ms/op
Iteration 8: 12.551 ms/op
Iteration 9: 12.588 ms/op
Iteration 10: 12.549 ms/op
Iteration 11: 12.551 ms/op
Iteration 12: 12.552 ms/op
Iteration 13: 12.549 ms/op
Iteration 14: 12.554 ms/op
Iteration 15: 12.555 ms/op
Iteration 16: 12.548 ms/op
Iteration 17: 12.548 ms/op
Iteration 18: 12.549 ms/op
Iteration 19: 12.548 ms/op
Iteration 20: 12.550 ms/op

12.552 ±(99.9%) 0.008 ms/op [Average]
  (min, avg, max) = (12.548, 12.552, 12.588), stdev = 0.009
  CI (99.9%): [12.545, 12.560] (assumes normal distribution)
```

## 결과

- 실제로 for loop 가 유의미하게 빨랐다.
- 그 뒤로 forEach, Iterator 이고, 약 1.5초 후 forEachIndexed 순서이다.

## Why?

- 왜 그럴까?
- 실제 벤치마크를 실행한 코드를 자바로 디컴파일하니 알 수 있었다.

```java
   @Benchmark
   public void loopFor(@NotNull Blackhole blackhole) {
      Intrinsics.checkNotNullParameter(blackhole, "blackhole");

      for(int i = 0; i < 15000000; ++i) {
         blackhole.consume(i);
      }

   }

   @Benchmark
   public void loopForEach(@NotNull Blackhole blackhole) {
      Intrinsics.checkNotNullParameter(blackhole, "blackhole");
      Iterable $this$forEach$iv = (Iterable)RangesKt.until(0, 15000000);
      int $i$f$forEach = false;
      Iterator var4 = $this$forEach$iv.iterator();

      while(var4.hasNext()) {
         int element$iv = ((IntIterator)var4).nextInt();
         int it = element$iv;
         int var7 = false;
         blackhole.consume(it);
      }

   }

   @Benchmark
   public void loopForEachIndexed(@NotNull Blackhole blackhole) {
      Intrinsics.checkNotNullParameter(blackhole, "blackhole");
      Iterable $this$forEachIndexed$iv = (Iterable)RangesKt.until(0, 15000000);
      int $i$f$forEachIndexed = false;
      int index$iv = 0;
      Iterator var5 = $this$forEachIndexed$iv.iterator();

      while(var5.hasNext()) {
         int item$iv = ((IntIterator)var5).nextInt();
         int var7 = index$iv++;
         if (var7 < 0) {
            CollectionsKt.throwIndexOverflow();
         }

         int index = item$iv;
         int var10 = false;
         blackhole.consume(index);
      }

   }

   @Benchmark
   public void loopIterator(@NotNull Blackhole blackhole) {
      Intrinsics.checkNotNullParameter(blackhole, "blackhole");
      IntIterator iterator = RangesKt.until(0, 15000000).iterator();

      while(iterator.hasNext()) {
         blackhole.consume(iterator.nextInt());
      }

   }
```

- 잡다한 코드는 제거하고, 실제 벤치마크를 실행한 메서드만 가져와봤다.
- for loop 는 자바에서 그대로 동작하나, forEach 를 보면 내부에서 iterator 를 가져와서 사용하는 것으로 보인다.
- 여기에서 유의미한 차이가 발생한 것으로 보인다.
- 마지막에 iterator 를 벤치마크한 이유도, 직접 iterator 를 사용한 것과도 차이가 있는지 궁금해서 실행해보았으나, 역시나 동일한 값이 나왔다.

## 결론

- loop 의 사이즈가 작으면 상관없겠지만, 어느 정도 사이즈가 있는 경우에는 for loop 가 약 7.2배 정도 빠르다.
  - 비록 단위가 ms 이지만…
- 1000건정도에서 실행하더라도 비슷한 결과가 나타나지만, 전체 실행 시간은 훨씬 짧아지므로, 일반적으로 사용할 때는 크게 체감이 안될 수 있다.
  - for loop: `≈ 10⁻⁴ ms/op`
  - forEach: `0.001 ±(99.9%) 0.001 ms/op [Average]`

## Source Code

```kotlin
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(BenchmarkTimeUnit.MILLISECONDS)
@Warmup(iterations = 10, time = 500, timeUnit = BenchmarkTimeUnit.MILLISECONDS)
@Measurement(iterations = 20, time = 1, timeUnit = BenchmarkTimeUnit.MILLISECONDS)
@State(Scope.Benchmark)
class ForLoopComparisonBenchmark {
    companion object {
        private const val NUMBER_OF_ITERATIONS = 15_000_000
    }

    @Benchmark
    fun loopFor(blackhole: Blackhole) {
        for (i in 0 until NUMBER_OF_ITERATIONS) {
            blackhole.consume(i)
        }
    }

    @Benchmark
    fun loopForEach(blackhole: Blackhole) {
        (0 until NUMBER_OF_ITERATIONS).forEach { blackhole.consume(it) }
    }

    @Benchmark
    fun loopForEachIndexed(blackhole: Blackhole) {
        (0 until NUMBER_OF_ITERATIONS).forEachIndexed { _, index -> blackhole.consume(index) }
    }

    @Benchmark
    fun loopIterator(blackhole: Blackhole) {
        val iterator = (0 until NUMBER_OF_ITERATIONS).iterator()
        while (iterator.hasNext()) {
            blackhole.consume(iterator.nextInt())
        }
    }
}
```

## References

- https://slack-chats.kotlinlang.org/t/455665/a-for-loop-is-faster-than-a-foreach-expression-right
- https://pablisco.com/kotlin-benchmarks/
