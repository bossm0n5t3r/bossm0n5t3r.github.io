+++
date = 2024-09-01T00:20:00+09:00
title = "[코틀린 아카데미: 핵심편] 후기"
authors = ["Ji-Hoon Kim"]
+++

![](/images/books/kotlin-essentials/cover.jpg)

## 기간

- `2024-08-12` ~ `2024-08-29`

## 내용

- Marcin Moskała 의 코틀린 책을 좋아해서 이번에 나온 “코틑린 아카데미: 핵심편” 도 사서 읽게 되었다.
- 코틀린의 핵심 기능, 기본편이라고 되어있어서 큰 기대는 하지 않았지만, 실제로 몰랐던 기능들에 대해 배우게 되어 좋았다.
- 또한 적당한 연습문제가 각 장마다 존재해서, 내용을 익히는 데 큰 무리도 없었다.
- 다만 아쉬운 점은 아래와 같다.
  - 오탈자가 종종 보인다.
  - 불명확한 내용이 있는데, 실제 원문에서도 동일한 걸로 보아 저자가 덜 설명한 듯 하다.
  - 제공되는 Source Code 의 내용과 책의 연습문제가 상이하다.
    - 이 부분은 따로 아래 테이블로 정리하였다.
- 만약 이 책을 다른 사람에게 추천하겠는가 라는 질문을 받는 다면 적극 추천하겠다.

## Table

- Source Code 가 Chapter 와 연관되어 있지 않는 부분도 있고, 책에 없는 코드도 존재해서 따로 정리해보았다.
- 현재 repo 는 chapter 별로 구성되어있다.

| chapter                                 | code                                                                                                                | code that not exists in book |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| 1. 코틀린은 어떤 언어인가?              |                                                                                                                     |                              |
| 2. 코틀린으로 만드는 첫 번째 프로그램   |                                                                                                                     |                              |
| 3. 변수                                 |                                                                                                                     |                              |
| 4. 기본 타입, 기본 타입의 리터럴과 연산 |                                                                                                                     |                              |
| 5. 조건문: if, when, try, while         | [conditions](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/conditions)   | Tree                         |
| 6. 함수                                 | [functions](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/functions)     | Factorial, Product           |
| 7. for 문의 강력함                      | [loops](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/loops)             |                              |
| 8. 널 가능성                            | [nullability](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/nullability) | SendMessage                  |
| 9. 클래스                               | [classes](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/classes)         |                              |
| 10. 상속                                | [classes](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/classes)         | Person                       |
| 11. 데이터 클래스                       |                                                                                                                     |                              |
| 12. 객체                                | [objects](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/objects)         | Radio (하지만 구현하지 않음) |
| 13. 예외                                | [exceptions](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/exceptions)   |                              |
| 14. 열거형 클래스                       | [enums](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/enums)             |                              |
| 15. 봉인된 클래스와 인터페이스          |                                                                                                                     |                              |
| 16. 애너테이션 클래스                   |                                                                                                                     |                              |
| 17. 확장                                | [extensions](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/extensions)   | Rational, TreeOperations     |
| 18. 컬렉션                              | [collections](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/collections) |                              |
| 19. 연산자 오버로딩                     | [operators](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/operators)     |                              |
| 20. 코틀린 타입 시스템의 묘미           |                                                                                                                     |                              |
| 21. 제네릭                              | [generics](https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials/generics)       |                              |

## Links

### Book

- https://leanpub.com/kotlin_developers
- https://product.kyobobook.co.kr/detail/S000213720494

### Source Code (Origin)

- https://github.com/MarcinMoskala/kotlin-exercises/tree/master/src/main/kotlin/essentials

### Repository

- https://github.com/bossm0n5t3r/kotlin-essentials
