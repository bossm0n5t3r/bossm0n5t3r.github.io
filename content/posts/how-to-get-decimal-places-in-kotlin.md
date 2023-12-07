+++ 
date = 2023-08-09T22:00:00+09:00
title = "[Kotlin] 소수점 이하 자릿수 구하는 방법"
authors = ["Ji-Hoon Kim"]
tags = ["Kotlin"]
categories = ["Kotlin"]
series = ["Kotlin"]
+++

간단한 두 가지 방법이 있다.

```kotlin
fun main() {
    val double = 1.1234567890
    println(double.toString().split(".").last().length)
    println(double.toBigDecimal().scale())
}
```

<iframe width="100%" src="https://pl.kotl.in/6NicrgGsY?theme=darcula"></iframe>
