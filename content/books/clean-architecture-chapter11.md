+++ 
date = 2024-03-10T03:07:00+09:00
title = "[Clean Architecture] 11장. DIP: 의존성 역전 원칙"
+++

![](/images/books/clean-architecture/cover.jpg)

## Introduction

- 의존성 역전 원칙이 말하는 ‘유연성이 극대화된 시스템’이란 소스 코드 의존성이 추상(abstraction)에 의존하며 구체(concretion)에는 의존하지 않는 시스템
- 정적 타입 언어에서 import 구문은 오직 인터페이스나 추상 클래스 같은 추상적인 선언만을 참조해야 한다는 뜻
  - 구체적인 대상에는 절대로 의존해서는 안 된다.
- 동적 타입 언어에도 동일한 규칙이 적용됨
  - 소스 코드 의존 관계에서 구체 모듈은 참조해서는 안된다.
  - 하지만 이들 언어의 경우 구체 모듈이 무엇인지를 정의하기가 다소 어렵다.
  - 호출할 함수가 구현된 모듈이라면 참조하지 않기가 특히 어렵다.
- 이 아이디어를 규칙으로 보기는 확실히 비현실적임
  - 소프트웨어 시스템이라면 구체적으로 많은 장치에 반드시 의존하기 때문에
  - ex) 자바의 String
    - 구체클래스이며, 애써 추상 클래스로 만들려는 시도는 현실성이 없음
    - 구체클래스에 대한 소스 코드 의존성은 벗어날 수 없고, 벗어나서도 안됨
    - 반면 매우 안정적임
- 이러한 이유로 DIP 를 논할 때 운영체제나 플랫폼 같이 안정성이 보장된 환경에 대해서는 무시하는 편
  - 우리는 이들 환경에 대한 의존성은 용납하는데, 변경되지 않는다면 의존할 수 있다는 사실을 이미 알고 있기 때문
- **우리가 의존하지 않도록 피하고자 하는 것은 바로 변동성이 큰 volatile 구체적인 요소**
  - 그리고 이 구체적인 요소는 우리가 열심히 개발하는 중이라 자주 변경될 수 밖에 없는 모듈들

## 안정된 추상화

- 뛰어난 소프트웨어 설계자와 아키텍트라면 인터페이스의 변동성을 낮추기 위해 애쓴다.
- 인터페이스를 변경하지 않고도 구현체에 기능을 추가할 수 있는 방법을 찾기 위해 노력한다.
- 이는 소프트웨어 설계의 기본
- 즉, 안정된 소프트웨어 아키텍처란
  - 변동성이 큰 구현체에 의존하는 일은 지양
  - 안정된 추상 인터페이스를 선호하는 아키텍처라는 뜻

### 구체적인 코딩 실천법

- **변동성이 큰 구체 클래스를 참조하지 말라**
  - 대신 추상 인터페이스를 참조하라
  - 이 규칙은 언어가 정적 타입이든, 동적 타입이든 관계없이 모두 적용됨
  - 이 규칙은 객체 생성 방식을 강하게 제약하며, 일반적으로 추상 팩토리를 사용하도록 강제함
- **변동성이 큰 구체 클래스로부터 파생하지 말라**
  - 상속은 아주 신중하게 사용해야 한다.
  - 정적 타입 언어에서 상속은 소스 코드에 존재하는 모든 관계 중에서 가장 강력한 동시에 뻣뻣해서 변경하기 어렵다.
- **구체 함수를 오버라이드 하지 말라**
  - 대체로 구체 함수는 소스 코드 의존성을 필요로 함
  - 따라서 구체 함수를 오버라이드하면 이러한 의존성을 제거할 수 없게 되며, 실제로는 그 의존성을 상속하게 됨
  - 이러한 의존성을 제거하려면, 차라리 추상 함수로 선언하고 구현체들에서 각자의 용도에 맞게 구현해야 함
- **구체적이며 변동성이 크다면 절대로 그 이름을 언급하지 말라**
  - DIP 원칙을 다른 방식으로 풀어쓴 것

## 팩토리

- 이 규칙들을 준수하려면 변동성이 큰 구체적인 객체는 특별히 주의해서 생성해야 함
- 사실상 모든 언어에서 객체를 생성하려면 해당 객체를 구체적으로 정의한 코드에 대해 소스 코드 의존성이 발생하기 때문
- 대다수의 객체 지향 언어에서 이처럼 바람직하지 못한 의존성을 처리할 때 추상 팩토리를 사용하곤 함

![0.jpg](/images/books/clean-architecture/chapter11/0.jpg)

- 곡선은 시스템을 두 가지 컴포넌트로 분리
  - 하나는 추상 컴포넌트
    - 애플리케이션의 모든 고수준 업무 규칙을 포함
  - 다른 하나는 구체 컴포넌트
    - 업무 규칙을 다루기 위해 필요한 모든 세부사항을 포함
- 제어 흐름은 소스 코드 의존성과는 정반대 방향으로 곡선을 가로지른다는 점에 주목
  - 소스 코드 의존성은 제어흐름과는 반대 방향으로 역전됨
  - 이러한 이유로 이 원칙을 의존성 역전이라고 부름

## 구체 컴포넌트

- 위의 그림에서 구체 컴포넌트에는 구체적인 의존성이 하나 있고, 따라서 DIP 에 위배
- 이는 일반적인 일
  - DIP 위배를 모두 없앨 수는 없다.
- 하지만 DIP 를 위배하는 클래스들은 적은 수의 구체 컴포넌트 내부로 모을 수 있고, 이를 통해 시스템의 나머지 부분과는 분리할 수 있다.
- 대다수의 시스템은 이러한 구체 컴포넌트를 최소한 하나는 포함할 것
  - 흔히 이 컴포넌트를 메인이라고 부르는데, main 함수를 포함하기 때문

## 결론

- DIP 는 아키텍처 다이어그램에서 가장 눈에 드러나는 원칙이 될 것
- 위의 그림에서 고선은 이후의 장에서 아키텍처 경계가 될 것
- 그리고 의존성은 이 곡선을 경계로, 더 추상적인 엔티티가 있는 쪽으로만 향함
- 추후 이 규칙은 의존성 규칙이라 부를 것

## References

- https://paulrumyancev.medium.com/uml-class-diagram-arrows-guide-37e4b1bb11e
