+++ 
date = 2023-12-23T02:50:00+09:00
title = "[Kotlin Coroutines] 5장. 코루틴: 언어 차원에서의 지원 vs 라이브러리"
+++

![](/images/books/kotlin-coroutines/cover.webp)

## 개요

- 코루틴은 실제로 코틀린 언어에서 자체적으로 지원하는 부분과 코틀린 코루틴 라이브러리로 구성
  - 코틀린 언어에서 자체적으로 지원하는 부분?
    - 컴파일러의 지원과 코틀린 기본 라이브러리의 요소
- **둘은 전혀 다름!**
- 코틀린 언어 차원
  - 자유도를 보장하기 위해 코루틴을 최소한으로 지원
  - 직접 다루기가 쉽지 않음
  - suspend, Coroutine, Continuation 등
  - 애플리케이션 개발자들보다는 라이브러리 개발자들에게 적합
- 코틀린 코루틴 라이브러리
  - kotlinx.coroutines 라이브러리
  - 별도의 의존성을 추가해야 함
  - 사용하기 훨씬 쉬우며 동시성을 명확하게 구현할 수 있게 해 줌

| 언어 차원에서의 지원                                                                              | kotlinx.coroutines 라이브러리                   |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 컴파일러가 지원<br/>코틀린 기본 라이브러리에 포함                                                 | 의존성을 별도로 추가해야 함                     |
| kotlin.coroutines 패키지에 포함                                                                   | kotlinx.coroutines 패키지에 포함                |
| Continuation 또는 suspendCoroutines 과 같은 몇몇 기본적인 것들과 suspend 키워드를 최소한으로 제공 | launch, async, Deferred 처럼 다양한 기능을 제공 |
| 직접 사용하기 아주 어렵다                                                                         | 직접 사용하기 편리하게 설계되어 있다            |
| 거의 모든 동시성 스타일이 허용                                                                    | 단 하나의 명확한 동시성 스타일을 위해 설계됨    |

- 대부분 둘 다 사용하지만, 반드시 그럴 필요는 없음
- 많은 컴퓨터 과학 논문은 중단의 개념의 보편성에 대해 설명

  - [https://www.cs.tufts.edu/~nr/cs257/archive/roberto-ierusalimschy/revisiting-coroutines.pdf](https://www.cs.tufts.edu/~nr/cs257/archive/roberto-ierusalimschy/revisiting-coroutines.pdf)

  - [Continuations and coroutines | Proceedings of the 1984 ACM Symposium on LISP and functional programming](https://dl.acm.org/doi/10.1145/800055.802046)

- 지금까지 코틀린 언어 차원에서 지원하는 코루틴 개념에 대해 살펴봄
- 앞으로는 kotlinx.coroutines 라이브러리에 집중해서 코루틴에 대해 배워보도록 하자
