+++ 
date = 2023-12-23T02:30:00+09:00
title = "[Kotlin Coroutines] 2장. 시퀀스 빌더"
+++

![](/images/books/kotlin-coroutines/cover.webp)

## 개요

- 코틀린의 시퀀스는 List 나 Set 과 같은 컬렉션과 비슷한 개념
- 필요할 때마다 값을 하나씩 계산하는 지연(lazy) 처리
- 시퀀스의 특징
  - 요구되는 연산을 최소한으로 수행
  - 무한정이 될 수 있음
  - 메모리 사용이 효율적
- 간단한 시퀀스 예시

  ```kotlin
  val seq =
      sequence {
          yield(1)
          yield(2)
          yield(3)
      }

  fun main() {
      for (num in seq) {
          println(num)
      }
  }
  ```

  - 위 코드에서 사용한 sequence 함수는 짧은 DSL 코드
    - 인자는 수신 객체 지정 람다 함수
    ```kotlin
    /**
     * Builds a [Sequence] lazily yielding values one by one.
     *
     * @see kotlin.sequences.generateSequence
     *
     * @sample samples.collections.Sequences.Building.buildSequenceYieldAll
     * @sample samples.collections.Sequences.Building.buildFibonacciSequence
     */
    @SinceKotlin("1.3")
    @Suppress("DEPRECATION")
    public fun <T> sequence(@BuilderInference block: suspend SequenceScope<T>.() -> Unit): Sequence<T> = Sequence { iterator(block) }
    ```

- 반드시 알아야 할 것은 각 숫자가 미리 생성되는 대신, 필요할 때마다 생성된다는 점
  ![1.png](/images/books/kotlin-coroutines/chapter02/1.png)

## 실제 사용 예

### 피보나치 수열

![2.png](/images/books/kotlin-coroutines/chapter02/2.png)

### 난수 및 임의 문자열

![3.png](/images/books/kotlin-coroutines/chapter02/3.png)

![4.png](/images/books/kotlin-coroutines/chapter02/4.png)

시퀀스 빌더는 반환 (yield) 이 아닌 중단 함수를 사용하면 안된다.

중단이 필요하다면 데이터를 가져오기 위해 나중에 배울 플로우를 사용하는 것이 낫다.

플로우는 여러 가지 코루틴 기능을 지원한다.
