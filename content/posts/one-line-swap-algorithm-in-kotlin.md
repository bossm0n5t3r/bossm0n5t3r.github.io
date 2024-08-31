+++
date = 2023-10-20T11:00:00+09:00
lastmod = 2024-09-01
title = "[Kotlin] 한 줄로 swap 하는 방법"
authors = ["Ji-Hoon Kim"]
tags = ["Kotlin"]
categories = ["Kotlin"]
series = ["Kotlin"]
+++

![](/images/logos/kotlin-logo.png)

## 개요

파이썬에서는 한 줄로 쉽게 swap 하는 방법이 있다.

```shell
>>> a, b = 1, 2
>>> print(a)
1
>>> print(b)
2
>>> a, b = b, a
>>> print(a)
2
>>> print(b)
1
```

그런데 코틀린에서는 어떻게 하면 좋을지 궁금해서 찾아봤다.

방법은 `apply` 또는 `also` 를 사용하면 된다.

```kotlin
// Use apply

fun main() {
    var first = 1
    var second = 2
    println("first: $first, second: $second") // first: 1, second: 2
    first = second.apply { second = first }
    println("first: $first, second: $second") // first: 2, second: 1
}
```

```kotlin
// Use also

fun main() {
    var first = 1
    var second = 2
    println("first: $first, second: $second") // first: 1, second: 2
    first = second.also { second = first }
    println("first: $first, second: $second") // first: 2, second: 1
}
```

## References

- https://medium.com/@vibhanshusharma_93861/one-line-swap-algorithm-in-kotlin-e1cf6cc64708
- https://kotlinlang.org/docs/scope-functions.html
- https://pl.kotl.in/GCTD-4_Nr
- https://pl.kotl.in/Il1n7o1B0
