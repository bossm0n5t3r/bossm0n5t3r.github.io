+++
date = 2024-08-01T01:30:00+09:00
lastmod = 2025-02-26
title = "For Loop Comparison in Kotlin"
authors = ["Ji-Hoon Kim"]
tags = ["Kotlin"]
categories = ["Kotlin"]
series = ["Kotlin"]
+++

![](/images/logos/kotlin-logo.png)

## Introduction

- Kotlin 에는 for loop 을 쓸 수도 있지만, forEach 를 통해서도 동일한 기능을 할 수 있다.
- 그러던 도중 둘 사이에 성능 차이가 있다고 들었고, 실제로 그러한지 검증하고자 벤치마크 코드를 작성해여 실행 해보았다.
- 전체 개수는 `15_000_000` 개로 설정한 뒤에 실행했다.
- 그리고 `Range` 순회와 `Collection` 순회를 나눠서 비교해봤다.

## Benchmark Result

### [Range] For Loop

```kotlin
@Benchmark
fun rangeForLoop(blackhole: Blackhole) {
    for (i in INT_RANGE) {
        blackhole.consume(i)
    }
}
```

```text
main: benchmark.ForLoopComparisonBenchmark.rangeForLoop

Warm-up 1: 1.406 ms/op
Warm-up 2: 1.393 ms/op
Warm-up 3: 1.393 ms/op
Warm-up 4: 1.393 ms/op
Warm-up 5: 1.393 ms/op
Warm-up 6: 1.393 ms/op
Warm-up 7: 1.392 ms/op
Warm-up 8: 1.393 ms/op
Warm-up 9: 1.393 ms/op
Warm-up 10: 1.393 ms/op
Iteration 1: 1.408 ms/op
Iteration 2: 1.388 ms/op
Iteration 3: 1.404 ms/op
Iteration 4: 1.387 ms/op
Iteration 5: 1.388 ms/op
Iteration 6: 1.388 ms/op
Iteration 7: 1.388 ms/op
Iteration 8: 1.388 ms/op
Iteration 9: 1.388 ms/op
Iteration 10: 1.387 ms/op
Iteration 11: 1.388 ms/op
Iteration 12: 1.388 ms/op
Iteration 13: 1.388 ms/op
Iteration 14: 1.388 ms/op
Iteration 15: 1.389 ms/op
Iteration 16: 1.392 ms/op
Iteration 17: 1.388 ms/op
Iteration 18: 1.418 ms/op
Iteration 19: 1.405 ms/op
Iteration 20: 1.394 ms/op

1.392 ±(99.9%) 0.008 ms/op [Average]
  (min, avg, max) = (1.387, 1.392, 1.418), stdev = 0.009
  CI (99.9%): [1.385, 1.400] (assumes normal distribution)
```

### [Range] For Loop Another

```kotlin
@Benchmark
fun rangeForLoopAnother(blackhole: Blackhole) {
    for (i in 0 until NUMBER_OF_ITERATIONS) {
        blackhole.consume(i)
    }
}
```

```text
main: benchmark.ForLoopComparisonBenchmark.rangeForLoopAnother

Warm-up 1: 1.892 ms/op
Warm-up 2: 1.757 ms/op
Warm-up 3: 1.757 ms/op
Warm-up 4: 1.758 ms/op
Warm-up 5: 1.759 ms/op
Warm-up 6: 1.758 ms/op
Warm-up 7: 1.757 ms/op
Warm-up 8: 1.757 ms/op
Warm-up 9: 1.757 ms/op
Warm-up 10: 1.767 ms/op
Iteration 1: 1.750 ms/op
Iteration 2: 1.752 ms/op
Iteration 3: 1.749 ms/op
Iteration 4: 1.777 ms/op
Iteration 5: 1.750 ms/op
Iteration 6: 1.748 ms/op
Iteration 7: 1.749 ms/op
Iteration 8: 1.749 ms/op
Iteration 9: 1.749 ms/op
Iteration 10: 1.749 ms/op
Iteration 11: 1.749 ms/op
Iteration 12: 1.750 ms/op
Iteration 13: 1.750 ms/op
Iteration 14: 1.750 ms/op
Iteration 15: 1.750 ms/op
Iteration 16: 1.749 ms/op
Iteration 17: 1.749 ms/op
Iteration 18: 1.752 ms/op
Iteration 19: 1.755 ms/op
Iteration 20: 1.749 ms/op

1.751 ±(99.9%) 0.005 ms/op [Average]
  (min, avg, max) = (1.748, 1.751, 1.777), stdev = 0.006
  CI (99.9%): [1.746, 1.757] (assumes normal distribution)

```

### [Range] forEach

```kotlin
@Benchmark
fun rangeForEach(blackhole: Blackhole) {
    INT_RANGE.forEach { blackhole.consume(it) }
}
```

```text
main: benchmark.ForLoopComparisonBenchmark.rangeForEach

Warm-up 1: 13.143 ms/op
Warm-up 2: 12.553 ms/op
Warm-up 3: 12.557 ms/op
Warm-up 4: 12.551 ms/op
Warm-up 5: 12.565 ms/op
Warm-up 6: 12.554 ms/op
Warm-up 7: 12.547 ms/op
Warm-up 8: 12.556 ms/op
Warm-up 9: 12.553 ms/op
Warm-up 10: 12.550 ms/op
Iteration 1: 12.615 ms/op
Iteration 2: 12.527 ms/op
Iteration 3: 12.538 ms/op
Iteration 4: 12.521 ms/op
Iteration 5: 12.580 ms/op
Iteration 6: 12.520 ms/op
Iteration 7: 12.540 ms/op
Iteration 8: 12.516 ms/op
Iteration 9: 12.516 ms/op
Iteration 10: 12.676 ms/op
Iteration 11: 12.589 ms/op
Iteration 12: 12.543 ms/op
Iteration 13: 12.561 ms/op
Iteration 14: 12.515 ms/op
Iteration 15: 12.602 ms/op
Iteration 16: 12.518 ms/op
Iteration 17: 12.513 ms/op
Iteration 18: 12.509 ms/op
Iteration 19: 12.611 ms/op
Iteration 20: 12.707 ms/op

12.561 ±(99.9%) 0.049 ms/op [Average]
  (min, avg, max) = (12.509, 12.561, 12.707), stdev = 0.057
  CI (99.9%): [12.511, 12.610] (assumes normal distribution)
```

### [Range] forEachIndexed

```kotlin
@Benchmark
fun rangeForEachIndexed(blackhole: Blackhole) {
    INT_RANGE.forEachIndexed { _, index -> blackhole.consume(index) }
}
```

```text
main: benchmark.ForLoopComparisonBenchmark.rangeForEachIndexed

Warm-up 1: 14.257 ms/op
Warm-up 2: 13.777 ms/op
Warm-up 3: 13.775 ms/op
Warm-up 4: 13.772 ms/op
Warm-up 5: 13.773 ms/op
Warm-up 6: 13.778 ms/op
Warm-up 7: 13.770 ms/op
Warm-up 8: 13.776 ms/op
Warm-up 9: 13.769 ms/op
Warm-up 10: 13.772 ms/op
Iteration 1: 13.737 ms/op
Iteration 2: 13.786 ms/op
Iteration 3: 13.731 ms/op
Iteration 4: 13.762 ms/op
Iteration 5: 13.741 ms/op
Iteration 6: 13.884 ms/op
Iteration 7: 13.798 ms/op
Iteration 8: 13.742 ms/op
Iteration 9: 13.767 ms/op
Iteration 10: 13.751 ms/op
Iteration 11: 13.798 ms/op
Iteration 12: 13.733 ms/op
Iteration 13: 13.751 ms/op
Iteration 14: 13.732 ms/op
Iteration 15: 13.856 ms/op
Iteration 16: 13.848 ms/op
Iteration 17: 13.755 ms/op
Iteration 18: 13.757 ms/op
Iteration 19: 13.773 ms/op
Iteration 20: 13.782 ms/op

13.774 ±(99.9%) 0.038 ms/op [Average]
  (min, avg, max) = (13.731, 13.774, 13.884), stdev = 0.044
  CI (99.9%): [13.736, 13.812] (assumes normal distribution)
```

### [Range] iterator

```kotlin
@Benchmark
fun rangeIterator(blackhole: Blackhole) {
    val iterator = INT_RANGE.iterator()
    while (iterator.hasNext()) {
        blackhole.consume(iterator.nextInt())
    }
}
```

```text
main: benchmark.ForLoopComparisonBenchmark.rangeIterator

Warm-up 1: 13.137 ms/op
Warm-up 2: 12.555 ms/op
Warm-up 3: 12.549 ms/op
Warm-up 4: 12.566 ms/op
Warm-up 5: 12.550 ms/op
Warm-up 6: 12.555 ms/op
Warm-up 7: 13.810 ms/op
Warm-up 8: 12.552 ms/op
Warm-up 9: 12.654 ms/op
Warm-up 10: 13.488 ms/op
Iteration 1: 12.524 ms/op
Iteration 2: 12.511 ms/op
Iteration 3: 12.511 ms/op
Iteration 4: 12.524 ms/op
Iteration 5: 12.559 ms/op
Iteration 6: 12.516 ms/op
Iteration 7: 12.520 ms/op
Iteration 8: 12.540 ms/op
Iteration 9: 12.517 ms/op
Iteration 10: 12.595 ms/op
Iteration 11: 12.560 ms/op
Iteration 12: 12.574 ms/op
Iteration 13: 12.543 ms/op
Iteration 14: 12.510 ms/op
Iteration 15: 12.604 ms/op
Iteration 16: 12.552 ms/op
Iteration 17: 12.513 ms/op
Iteration 18: 12.541 ms/op
Iteration 19: 12.543 ms/op
Iteration 20: 12.535 ms/op

12.540 ±(99.9%) 0.024 ms/op [Average]
  (min, avg, max) = (12.510, 12.540, 12.604), stdev = 0.028
  CI (99.9%): [12.516, 12.564] (assumes normal distribution)
```

### [Collection] For Loop

```kotlin
@Benchmark
fun collectionForLoop(blackhole: Blackhole) {
    for (i in INT_LIST) {
        blackhole.consume(i)
    }
}
```

```text
main: benchmark.ForLoopComparisonBenchmark.collectionForLoop

Warm-up 1: 9.680 ms/op
Warm-up 2: 9.188 ms/op
Warm-up 3: 9.185 ms/op
Warm-up 4: 9.261 ms/op
Warm-up 5: 9.197 ms/op
Warm-up 6: 9.188 ms/op
Warm-up 7: 9.358 ms/op
Warm-up 8: 9.185 ms/op
Warm-up 9: 9.182 ms/op
Warm-up 10: 9.197 ms/op
Iteration 1: 9.300 ms/op
Iteration 2: 9.395 ms/op
Iteration 3: 9.170 ms/op
Iteration 4: 9.193 ms/op
Iteration 5: 9.207 ms/op
Iteration 6: 9.188 ms/op
Iteration 7: 9.181 ms/op
Iteration 8: 9.225 ms/op
Iteration 9: 9.218 ms/op
Iteration 10: 9.153 ms/op
Iteration 11: 9.190 ms/op
Iteration 12: 9.181 ms/op
Iteration 13: 9.327 ms/op
Iteration 14: 9.320 ms/op
Iteration 15: 9.292 ms/op
Iteration 16: 9.144 ms/op
Iteration 17: 9.154 ms/op
Iteration 18: 9.206 ms/op
Iteration 19: 9.209 ms/op
Iteration 20: 9.161 ms/op

9.221 ±(99.9%) 0.060 ms/op [Average]
  (min, avg, max) = (9.144, 9.221, 9.395), stdev = 0.069
  CI (99.9%): [9.161, 9.281] (assumes normal distribution)
```

### [Collection] forEach

```kotlin
@Benchmark
fun collectionForEach(blackhole: Blackhole) {
    INT_LIST.forEach { blackhole.consume(it) }
}
```

```text
main: benchmark.ForLoopComparisonBenchmark.collectionForEach

Warm-up 1: 9.783 ms/op
Warm-up 2: 9.193 ms/op
Warm-up 3: 9.208 ms/op
Warm-up 4: 9.198 ms/op
Warm-up 5: 9.198 ms/op
Warm-up 6: 9.192 ms/op
Warm-up 7: 9.207 ms/op
Warm-up 8: 9.204 ms/op
Warm-up 9: 9.228 ms/op
Warm-up 10: 9.272 ms/op
Iteration 1: 9.322 ms/op
Iteration 2: 9.270 ms/op
Iteration 3: 9.175 ms/op
Iteration 4: 9.168 ms/op
Iteration 5: 9.226 ms/op
Iteration 6: 9.230 ms/op
Iteration 7: 9.323 ms/op
Iteration 8: 9.354 ms/op
Iteration 9: 9.176 ms/op
Iteration 10: 9.275 ms/op
Iteration 11: 9.209 ms/op
Iteration 12: 9.261 ms/op
Iteration 13: 9.171 ms/op
Iteration 14: 9.191 ms/op
Iteration 15: 9.219 ms/op
Iteration 16: 9.172 ms/op
Iteration 17: 9.159 ms/op
Iteration 18: 9.169 ms/op
Iteration 19: 9.175 ms/op
Iteration 20: 9.156 ms/op

9.220 ±(99.9%) 0.053 ms/op [Average]
  (min, avg, max) = (9.156, 9.220, 9.354), stdev = 0.061
  CI (99.9%): [9.167, 9.273] (assumes normal distribution)
```

### [Collection] forEachIndexed

```kotlin
@Benchmark
fun collectionForEachIndexed(blackhole: Blackhole) {
    INT_LIST.forEachIndexed { _, index -> blackhole.consume(index) }
}
```

```text
main: benchmark.ForLoopComparisonBenchmark.collectionForEachIndexed

Warm-up 1: 10.870 ms/op
Warm-up 2: 9.228 ms/op
Warm-up 3: 9.285 ms/op
Warm-up 4: 9.212 ms/op
Warm-up 5: 9.226 ms/op
Warm-up 6: 9.219 ms/op
Warm-up 7: 9.218 ms/op
Warm-up 8: 9.399 ms/op
Warm-up 9: 9.225 ms/op
Warm-up 10: 9.226 ms/op
Iteration 1: 9.181 ms/op
Iteration 2: 9.228 ms/op
Iteration 3: 9.166 ms/op
Iteration 4: 9.182 ms/op
Iteration 5: 9.206 ms/op
Iteration 6: 9.192 ms/op
Iteration 7: 9.191 ms/op
Iteration 8: 9.392 ms/op
Iteration 9: 9.390 ms/op
Iteration 10: 9.175 ms/op
Iteration 11: 9.152 ms/op
Iteration 12: 9.298 ms/op
Iteration 13: 9.206 ms/op
Iteration 14: 9.195 ms/op
Iteration 15: 9.257 ms/op
Iteration 16: 9.172 ms/op
Iteration 17: 9.198 ms/op
Iteration 18: 9.221 ms/op
Iteration 19: 9.167 ms/op
Iteration 20: 9.222 ms/op

9.220 ±(99.9%) 0.059 ms/op [Average]
  (min, avg, max) = (9.152, 9.220, 9.392), stdev = 0.068
  CI (99.9%): [9.161, 9.278] (assumes normal distribution)
```

### [Collection] iterator

```kotlin
@Benchmark
fun collectionIterator(blackhole: Blackhole) {
    val iterator = INT_LIST.iterator()
    while (iterator.hasNext()) {
        blackhole.consume(iterator.next())
    }
}
```

```text
main: benchmark.ForLoopComparisonBenchmark.collectionIterator

Warm-up 1: 9.772 ms/op
Warm-up 2: 9.253 ms/op
Warm-up 3: 9.252 ms/op
Warm-up 4: 9.252 ms/op
Warm-up 5: 9.310 ms/op
Warm-up 6: 9.522 ms/op
Warm-up 7: 9.257 ms/op
Warm-up 8: 9.263 ms/op
Warm-up 9: 9.279 ms/op
Warm-up 10: 9.253 ms/op
Iteration 1: 9.269 ms/op
Iteration 2: 9.218 ms/op
Iteration 3: 9.476 ms/op
Iteration 4: 9.577 ms/op
Iteration 5: 9.258 ms/op
Iteration 6: 9.271 ms/op
Iteration 7: 9.264 ms/op
Iteration 8: 9.239 ms/op
Iteration 9: 9.210 ms/op
Iteration 10: 9.308 ms/op
Iteration 11: 9.223 ms/op
Iteration 12: 9.217 ms/op
Iteration 13: 9.231 ms/op
Iteration 14: 9.234 ms/op
Iteration 15: 9.225 ms/op
Iteration 16: 9.328 ms/op
Iteration 17: 9.406 ms/op
Iteration 18: 9.361 ms/op
Iteration 19: 9.238 ms/op
Iteration 20: 9.383 ms/op

9.297 ±(99.9%) 0.086 ms/op [Average]
  (min, avg, max) = (9.210, 9.297, 9.577), stdev = 0.099
  CI (99.9%): [9.211, 9.382] (assumes normal distribution)
```

## 결과

- 실제로 `Range` 의 `for loop` 가 모든 케이스 중에서 가장 유의미하게 빨랐다.
- `Collection` 의 경우 구현과 상관없이 거의 동일한 속도를 보여주었다.
- `Range` 의 경우 `for loop` 를 제외하고 `forEach`, `Iterator` 이고, 약 1 초 후 `forEachIndexed` 순서이다.

|                | Range                                 | Collection                           |
| -------------- | ------------------------------------- | ------------------------------------ |
| For Loop       | 1.392 ±(99.9%) 0.008 ms/op [Average]  | 9.221 ±(99.9%) 0.060 ms/op [Average] |
| forEach        | 12.561 ±(99.9%) 0.049 ms/op [Average] | 9.220 ±(99.9%) 0.053 ms/op [Average] |
| forEachIndexed | 13.774 ±(99.9%) 0.038 ms/op [Average] | 9.220 ±(99.9%) 0.059 ms/op [Average] |
| Iterator       | 12.540 ±(99.9%) 0.024 ms/op [Average] | 9.297 ±(99.9%) 0.086 ms/op [Average] |

## Why?

- 왜 그럴까?
- 실제 벤치마크를 실행한 코드를 자바로 디컴파일하니 알 수 있었다.

```java
@Benchmark
public void rangeForLoop(@NotNull Blackhole blackhole) {
  Intrinsics.checkNotNullParameter(blackhole, "blackhole");
  IntRange var2 = INT_RANGE;
  int i = var2.getFirst();
  int var4 = var2.getLast();
  if (i <= var4) {
     while(true) {
        blackhole.consume(i);
        if (i == var4) {
           break;
        }

        ++i;
     }
  }

}

@Benchmark
public void rangeForLoopAnother(@NotNull Blackhole blackhole) {
  Intrinsics.checkNotNullParameter(blackhole, "blackhole");

  for(int i = 0; i < 15000000; ++i) {
     blackhole.consume(i);
  }

}

@Benchmark
public void rangeForEach(@NotNull Blackhole blackhole) {
  Intrinsics.checkNotNullParameter(blackhole, "blackhole");
  Iterable $this$forEach$iv = (Iterable)INT_RANGE;
  int $i$f$forEach = 0;
  Iterator var4 = $this$forEach$iv.iterator();

  while(var4.hasNext()) {
     int element$iv = ((IntIterator)var4).nextInt();
     int var7 = 0;
     blackhole.consume(element$iv);
  }

}

@Benchmark
public void rangeForEachIndexed(@NotNull Blackhole blackhole) {
  Intrinsics.checkNotNullParameter(blackhole, "blackhole");
  Iterable $this$forEachIndexed$iv = (Iterable)INT_RANGE;
  int $i$f$forEachIndexed = 0;
  int index$iv = 0;
  Iterator var5 = $this$forEachIndexed$iv.iterator();

  while(var5.hasNext()) {
     int item$iv = ((IntIterator)var5).nextInt();
     int var7 = index$iv++;
     if (var7 < 0) {
        CollectionsKt.throwIndexOverflow();
     }

     int var10 = 0;
     blackhole.consume(item$iv);
  }

}

@Benchmark
public void rangeIterator(@NotNull Blackhole blackhole) {
  Intrinsics.checkNotNullParameter(blackhole, "blackhole");
  IntIterator iterator = INT_RANGE.iterator();

  while(iterator.hasNext()) {
     blackhole.consume(iterator.nextInt());
  }

}

@Benchmark
public void collectionForLoop(@NotNull Blackhole blackhole) {
  Intrinsics.checkNotNullParameter(blackhole, "blackhole");
  Iterator var2 = INT_LIST.iterator();

  while(var2.hasNext()) {
     int i = ((Number)var2.next()).intValue();
     blackhole.consume(i);
  }

}

@Benchmark
public void collectionForEach(@NotNull Blackhole blackhole) {
  Intrinsics.checkNotNullParameter(blackhole, "blackhole");
  Iterable $this$forEach$iv = (Iterable)INT_LIST;
  int $i$f$forEach = 0;

  for(Object element$iv : $this$forEach$iv) {
     int it = ((Number)element$iv).intValue();
     int var7 = 0;
     blackhole.consume(it);
  }

}

@Benchmark
public void collectionForEachIndexed(@NotNull Blackhole blackhole) {
  Intrinsics.checkNotNullParameter(blackhole, "blackhole");
  Iterable $this$forEachIndexed$iv = (Iterable)INT_LIST;
  int $i$f$forEachIndexed = 0;
  int index$iv = 0;

  for(Object item$iv : $this$forEachIndexed$iv) {
     int var7 = index$iv++;
     if (var7 < 0) {
        CollectionsKt.throwIndexOverflow();
     }

     int index = ((Number)item$iv).intValue();
     int var10 = 0;
     blackhole.consume(index);
  }

}

@Benchmark
public void collectionIterator(@NotNull Blackhole blackhole) {
  Intrinsics.checkNotNullParameter(blackhole, "blackhole");
  Iterator iterator = INT_LIST.iterator();

  while(iterator.hasNext()) {
     blackhole.consume(((Number)iterator.next()).intValue());
  }

}
```

- 잡다한 코드는 제거하고, 실제 벤치마크를 실행한 메서드만 가져와봤다.
- `Collection` 의 경우 대부분의 코드가 동일한 형태인 것을 볼 수 있다.
- `Range` 의 경우 `for loop` 는 자바에서 그대로 동작하나, `forEach` 를 보면 내부에서 `iterator` 를 가져와서 사용하는 것으로 보인다.
- 여기에서 유의미한 차이가 발생한 것으로 보인다.
- 마지막에 `iterator` 를 벤치마크한 이유도, 직접 `iterator` 를 사용한 것과도 차이가 있는지 궁금해서 실행해보았으나, 역시나 동일한 값이 나왔다.

## 결론

- `Collection` 의 경우 구분없이 거의 동일한 성능을 보여주므로, 편한 방법으로 구현하면 된다.
- 하지만 `Range` 의 경우 loop 의 사이즈가 작으면 상관없겠지만, 어느 정도 사이즈가 있는 경우에는 `for loop` 가 약 7.2배 정도 빠르다.
  - 비록 단위가 ms 이지만…
- 1000 건 정도에서 실행하더라도 비슷한 결과가 나타나지만, 전체 실행 시간은 훨씬 짧아지므로, 일반적으로 사용할 때는 크게 체감이 안될 수 있다.
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
        private val INT_RANGE = 0 until NUMBER_OF_ITERATIONS
        private val INT_LIST = INT_RANGE.toList()
    }

    @Benchmark
    fun rangeForLoop(blackhole: Blackhole) {
        for (i in INT_RANGE) {
            blackhole.consume(i)
        }
    }

    @Benchmark
    fun rangeForLoopAnother(blackhole: Blackhole) {
        for (i in 0 until NUMBER_OF_ITERATIONS) {
            blackhole.consume(i)
        }
    }

    @Benchmark
    fun rangeForEach(blackhole: Blackhole) {
        INT_RANGE.forEach { blackhole.consume(it) }
    }

    @Benchmark
    fun rangeForEachIndexed(blackhole: Blackhole) {
        INT_RANGE.forEachIndexed { _, index -> blackhole.consume(index) }
    }

    @Benchmark
    fun rangeIterator(blackhole: Blackhole) {
        val iterator = INT_RANGE.iterator()
        while (iterator.hasNext()) {
            blackhole.consume(iterator.nextInt())
        }
    }

    @Benchmark
    fun collectionForLoop(blackhole: Blackhole) {
        for (i in INT_LIST) {
            blackhole.consume(i)
        }
    }

    @Benchmark
    fun collectionForEach(blackhole: Blackhole) {
        INT_LIST.forEach { blackhole.consume(it) }
    }

    @Benchmark
    fun collectionForEachIndexed(blackhole: Blackhole) {
        INT_LIST.forEachIndexed { _, index -> blackhole.consume(index) }
    }

    @Benchmark
    fun collectionIterator(blackhole: Blackhole) {
        val iterator = INT_LIST.iterator()
        while (iterator.hasNext()) {
            blackhole.consume(iterator.next())
        }
    }
}
```

## References

- https://slack-chats.kotlinlang.org/t/455665/a-for-loop-is-faster-than-a-foreach-expression-right
- https://pablisco.com/kotlin-benchmarks/
