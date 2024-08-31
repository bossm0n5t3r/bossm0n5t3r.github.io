+++
date = 2024-05-20T03:00:00+09:00
lastmod = 2024-09-01
title = "Use Elvis Operator Continuously in Kotlin"
authors = ["Ji-Hoon Kim"]
tags = ["Kotlin"]
categories = ["Kotlin"]
series = ["Kotlin"]
+++

![](/images/logos/kotlin-logo.png)

## Introduction

- 코드리뷰를 하던 도중 `?:` 를 연속으로 사용하는 경우를 맞닥뜨리게 되었다.
- 그동안 이런 경우를 최대한 피하기 위해 코드를 나눠서 쓰는 등, 다른 방식으로 작성했지만, 만약 정말 사용한다면 어떻게 처리되는지 궁금해서 알아보기로 했다.

## 두 번 연속으로 사용한 경우

### Kotlin

```kotlin
import kotlin.random.Random

fun main() {
    repeat(10) {
        println("times: $it")
        doubleElvisOperatorTest()
        println()
    }
}

private fun doubleElvisOperatorTest() {
    val firstNullableString = getStringOrNull()
    val secondNullableString = getStringOrNull()
    println("firstNullableString: $firstNullableString, secondNullableString: $secondNullableString")

    val doubleElvisOperator =
        firstNullableString
            ?.let {
                println("firstNullableString length: ${firstNullableString.length}")
                firstNullableString
            }
            ?: secondNullableString
            ?: error("Both NullableString are null")

    println("doubleElvisOperator: $doubleElvisOperator")
}

private fun getStringOrNull() =
    if (Random.nextBoolean()) {
        "String"
    } else {
        null
    }

```

- null 을 바로 리턴해서 처리하기보다 Random 한 상황을 기대하면서 작성해봤다
- 결과는 아래와 같다.

```bash
times: 0
firstNullableString: String, secondNullableString: String
firstNullableString length: 6
doubleElvisOperator: String

times: 1
firstNullableString: String, secondNullableString: null
firstNullableString length: 6
doubleElvisOperator: String

times: 2
firstNullableString: null, secondNullableString: null
Exception in thread "main" java.lang.IllegalStateException: Both NullableString are null
	at UseElvisOperatorContinuouslyKt.doubleElvisOperatorTest(UseElvisOperatorContinuously.kt:23)
	at UseElvisOperatorContinuouslyKt.main(UseElvisOperatorContinuously.kt:6)
	at UseElvisOperatorContinuouslyKt.main(UseElvisOperatorContinuously.kt)

Process finished with exit code 1

```

- 우리가 기대한 대로 잘 동작하는 모습이다.
- 그런데 실제로 Java 로 디컴파일하면 어떤 모습일까?

### Java

```java
import kotlin.Metadata;
import kotlin.random.Random;

@Metadata(
   mv = {1, 9, 0},
   k = 2,
   xi = 48,
   d1 = {"\u0000\u0010\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\u001a\b\u0010\u0000\u001a\u00020\u0001H\u0002\u001a\n\u0010\u0002\u001a\u0004\u0018\u00010\u0003H\u0002\u001a\u0006\u0010\u0004\u001a\u00020\u0001¨\u0006\u0005"},
   d2 = {"doubleElvisOperatorTest", "", "getStringOrNull", "", "main", "kotlin"}
)
public final class UseElvisOperatorContinuouslyKt {
   public static final void main() {
      byte var0 = 10;

      for(int var1 = 0; var1 < var0; ++var1) {
         int it = var1;
         int var3 = false;
         String var4 = "times: " + it;
         System.out.println(var4);
         doubleElvisOperatorTest();
         System.out.println();
      }

   }

   private static final void doubleElvisOperatorTest() {
      String firstNullableString = getStringOrNull();
      String secondNullableString = getStringOrNull();
      String doubleElvisOperator = "firstNullableString: " + firstNullableString + ", secondNullableString: " + secondNullableString;
      System.out.println(doubleElvisOperator);
      String var10000;
      if (firstNullableString != null) {
         int var6 = false;
         String var7 = "firstNullableString length: " + firstNullableString.length();
         System.out.println(var7);
         var10000 = firstNullableString;
      } else {
         if (secondNullableString == null) {
            throw new IllegalStateException("Both NullableString are null".toString());
         }

         var10000 = secondNullableString;
      }

      doubleElvisOperator = var10000;
      String var3 = "doubleElvisOperator: " + doubleElvisOperator;
      System.out.println(var3);
   }

   private static final String getStringOrNull() {
      return Random.Default.nextBoolean() ? "String" : null;
   }

   // $FF: synthetic method
   public static void main(String[] args) {
      main();
   }
}

```

- 우리가 의도한 대로 `firstNullableString == null` 이고 `secondNullableString == null` 이면 예외가 던져지도록 되었다.

## 세 번 연속으로 사용한 경우

### Kotlin

```kotlin
import kotlin.random.Random

fun main() {
    repeat(10) {
        println("times: $it")
        tripleElvisOperatorTest()
        println()
    }
}

private fun doubleElvisOperatorTest() {
    val firstNullableString = getStringOrNull()
    val secondNullableString = getStringOrNull()
    println("firstNullableString: $firstNullableString, secondNullableString: $secondNullableString")

    val doubleElvisOperator =
        firstNullableString
            ?.let {
                println("firstNullableString length: ${firstNullableString.length}")
                firstNullableString
            }
            ?: secondNullableString
            ?: error("Both NullableString are null")

    println("doubleElvisOperator: $doubleElvisOperator")
}

private fun tripleElvisOperatorTest() {
    val firstNullableString = getStringOrNull()
    val secondNullableString = getStringOrNull()
    val thirdNullableString = getStringOrNull()
    println(
        "firstNullableString: $firstNullableString, secondNullableString: $secondNullableString, thirdNullableString: $thirdNullableString",
    )

    val tripleElvisOperator =
        firstNullableString
            ?.let {
                println("firstNullableString length: ${firstNullableString.length}")
                firstNullableString
            }
            ?: secondNullableString?.also {
                println("secondNullableString length: ${secondNullableString.length}")
            }
            ?: thirdNullableString
                ?.also {
                    println("thirdNullableString length: ${thirdNullableString.length}")
                }
            ?: error("All NullableStrings are null")

    println("tripleElvisOperator: $tripleElvisOperator")
}

private fun getStringOrNull() =
    if (Random.nextBoolean()) {
        "String"
    } else {
        null
    }

```

```bash
times: 0
firstNullableString: String, secondNullableString: String, thirdNullableString: null
firstNullableString length: 6
tripleElvisOperator: String

times: 1
firstNullableString: null, secondNullableString: String, thirdNullableString: String
secondNullableString length: 6
tripleElvisOperator: String

times: 2
firstNullableString: null, secondNullableString: String, thirdNullableString: null
secondNullableString length: 6
tripleElvisOperator: String

times: 3
firstNullableString: null, secondNullableString: null, thirdNullableString: String
thirdNullableString length: 6
tripleElvisOperator: String

times: 4
firstNullableString: null, secondNullableString: String, thirdNullableString: null
secondNullableString length: 6
tripleElvisOperator: String

times: 5
firstNullableString: null, secondNullableString: String, thirdNullableString: null
secondNullableString length: 6
tripleElvisOperator: String

times: 6
firstNullableString: null, secondNullableString: String, thirdNullableString: String
secondNullableString length: 6
tripleElvisOperator: String

times: 7
firstNullableString: String, secondNullableString: null, thirdNullableString: String
firstNullableString length: 6
tripleElvisOperator: String

times: 8
firstNullableString: String, secondNullableString: String, thirdNullableString: null
firstNullableString length: 6
tripleElvisOperator: String

times: 9
firstNullableString: null, secondNullableString: null, thirdNullableString: null
Exception in thread "main" java.lang.IllegalStateException: All NullableStrings are null
	at UseElvisOperatorContinuouslyKt.tripleElvisOperatorTest(UseElvisOperatorContinuously.kt:49)
	at UseElvisOperatorContinuouslyKt.main(UseElvisOperatorContinuously.kt:6)
	at UseElvisOperatorContinuouslyKt.main(UseElvisOperatorContinuously.kt)

Process finished with exit code 1

```

- 기대한 대로 잘 동작하는 것을 볼 수 있다.
- Java 도 확인해보자

### Java

```java
import kotlin.Metadata;
import kotlin.random.Random;

@Metadata(
   mv = {1, 9, 0},
   k = 2,
   xi = 48,
   d1 = {"\u0000\u0010\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0003\u001a\b\u0010\u0000\u001a\u00020\u0001H\u0002\u001a\n\u0010\u0002\u001a\u0004\u0018\u00010\u0003H\u0002\u001a\u0006\u0010\u0004\u001a\u00020\u0001\u001a\b\u0010\u0005\u001a\u00020\u0001H\u0002¨\u0006\u0006"},
   d2 = {"doubleElvisOperatorTest", "", "getStringOrNull", "", "main", "tripleElvisOperatorTest", "kotlin"}
)
public final class UseElvisOperatorContinuouslyKt {
   public static final void main() {
      byte var0 = 10;

      for(int var1 = 0; var1 < var0; ++var1) {
         int it = var1;
         int var3 = false;
         String var4 = "times: " + it;
         System.out.println(var4);
         tripleElvisOperatorTest();
         System.out.println();
      }

   }

   private static final void doubleElvisOperatorTest() {
      String firstNullableString = getStringOrNull();
      String secondNullableString = getStringOrNull();
      String doubleElvisOperator = "firstNullableString: " + firstNullableString + ", secondNullableString: " + secondNullableString;
      System.out.println(doubleElvisOperator);
      String var10000;
      if (firstNullableString != null) {
         int var6 = false;
         String var7 = "firstNullableString length: " + firstNullableString.length();
         System.out.println(var7);
         var10000 = firstNullableString;
      } else {
         if (secondNullableString == null) {
            throw new IllegalStateException("Both NullableString are null".toString());
         }

         var10000 = secondNullableString;
      }

      doubleElvisOperator = var10000;
      String var3 = "doubleElvisOperator: " + doubleElvisOperator;
      System.out.println(var3);
   }

   private static final void tripleElvisOperatorTest() {
      String firstNullableString = getStringOrNull();
      String secondNullableString = getStringOrNull();
      String thirdNullableString = getStringOrNull();
      String tripleElvisOperator = "firstNullableString: " + firstNullableString + ", secondNullableString: " + secondNullableString + ", thirdNullableString: " + thirdNullableString;
      System.out.println(tripleElvisOperator);
      String var10000;
      boolean var7;
      String var8;
      if (firstNullableString != null) {
         var7 = false;
         var8 = "firstNullableString length: " + firstNullableString.length();
         System.out.println(var8);
         var10000 = firstNullableString;
      } else if (secondNullableString != null) {
         var7 = false;
         var8 = "secondNullableString length: " + secondNullableString.length();
         System.out.println(var8);
         var10000 = secondNullableString;
      } else {
         if (thirdNullableString != null) {
            int var10 = false;
            String var9 = "thirdNullableString length: " + thirdNullableString.length();
            System.out.println(var9);
            var10000 = thirdNullableString;
         } else {
            var10000 = null;
         }

         String var5 = var10000;
         if (var5 == null) {
            throw new IllegalStateException("All NullableStrings are null".toString());
         }

         var10000 = var5;
      }

      tripleElvisOperator = var10000;
      String var4 = "tripleElvisOperator: " + tripleElvisOperator;
      System.out.println(var4);
   }

   private static final String getStringOrNull() {
      return Random.Default.nextBoolean() ? "String" : null;
   }

   // $FF: synthetic method
   public static void main(String[] args) {
      main();
   }
}

```

- 기대한 대로 잘 동작한다.

## Conclusion

- 그동안 이런 방식의 코드를 그렇게 좋아하지는 않았는데, 작성하고 보니 나름 깔끔해 보이기도 한다.
- N 번을 처리하더라도 귀납적으로 잘 처리할 것 같으니, 충분한 리뷰를 통해 해당 방식으로 작성해도 문제 없을 것으로 보인다.

## References

- https://pl.kotl.in/tSNLegRLp
