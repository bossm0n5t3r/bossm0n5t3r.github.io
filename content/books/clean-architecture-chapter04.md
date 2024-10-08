+++ 
date = 2024-03-10T00:03:00+09:00
title = "[Clean Architecture] 4장. 구조적 프로그래밍"
+++

![](/images/books/clean-architecture/cover.jpg)

## 증명

- 데이크스트라는 증명을 통해 프로그래밍의 문제를 해결하고자 함
  - 그의 비전은 공리, 정리, 따름정리, 보조정리로 구성되는 유클리드 계층구조를 만드는 것이었다.
- 이 증명은 고되고 복잡했지만, 증명은 증명이었다.
- 이 증명을 해냄으로써 프로그램에서도 정리에 대한 유클리드 계층구조를 만들 수 있을 거라는 생각이 실제로 이루어질 듯 보였음

## 해로운 성명서

- 결국 데이크스트라가 옳았다.

## 기능적 분해

- 이를 통해 거대한 문제 기술서를 받더라도 문제를 고수준의 기능들로 분해할 수 있다.
- 그리고 각 기능은 다시 저수준의 함수들로 분해할 수 있고,
- 이러한 분해 과정을 끝없이 반복할 수 있다.

## 엄밀한 증명은 없었다

- 하지만 끝내 증명은 이루어지지 않았다.
- 프로그램 관점에서 정리에 대한 유클리드 계층구조는 끝내 만들어지지 않았다.

## 과학이 구축하다

- 과학은 근본적으로 수학과는 다른데, 과학 이론과 법칙은 그 올바름을 절대 증명할 수 없다.
- 과학적 방법은 반증은 가능하지만, 증명은 불가능하다.

## 테스트

- 데이크스트라는 “**테스트는 버그가 있음을 보여줄 뿐, 버그가 없음을 보여줄 수 는 없다.**” 고 말한 적이 있다.
- 소프트웨어는 과학과 같다.

## 결론

- 구조적 프로그래밍이 오늘날까지 가치 있는 이유는 프로그래밍에서 반증 가능한 단위를 만들어 낼 수 있는 바로 이 능력 때문
- 아키텍처 관점에서는 기능적 분해를 최고의 실천법 중 하나로 여기는 이유이기도 함
- 소프트웨어는 과학과 같고, 따라서 반증 가능성에 의해 주도됨
