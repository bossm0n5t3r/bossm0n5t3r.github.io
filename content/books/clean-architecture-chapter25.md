+++ 
date = 2024-04-19T00:50:00+09:00
title = "[Clean Architecture] 25장. 계층과 경계"
+++

![](/images/books/clean-architecture/cover.jpg)

## Introduction

- 시스템이 세 가지 컴포넌트 (UI, 업무 규칙, 데이터베이스) 로만 구성된다고 생각하기 쉽지만, 대다수의 시스템에서 컴포넌트의 개수는 이보다 훨씬 많음
- 간단한 컴퓨터 게임을 생각해보면서 상상해보자

## 움퍼스 사냥 게임

- 텍스트 기반
- 플레이어는 명령어를 입력
- 컴퓨터는 플레이어가 보고, 냄새 맡고, 듣고, 경험할 것들로 응답
- 플레이어는 동굴로 된 시스템 안에서 움퍼스를 사냥하며, 함정이나 구덩이 그리고 숨어서 기다리는 나머지 위험들을 피해야만 함
- 텍스트 기반 UI 는 그대로 유지하되, 게임 규칙과 UI 를 분리해서 우리 제품을 여러 시장에서 다양한 언어로 발매할 수 있게 만든다고 가정해보자.
- 게임 규칙은 언어 독립적인 API 를 사용해서 UI 컴포넌트와 통신할 것이고, UI 는 API 를 사람이 이해할 수 있는 언어로 변환할 것

![0.png](/images/books/clean-architecture/chapter25/0.png)

- 소스 코드 의존성을 적절히 관리하면, UI 컴포넌트가 어떤 언어를 사용하더라도 게임 규칙을 재사용할 수 있음
- 또한 게임의 상태를 영속적인 저장소에 유지한다고 가정해보자
- 어떤 경우라도 우리는 게임 규칙이 이러한 세부사항을 알지 않기를 바람
- 따라서 이번에도 역시 API 를 생성하여, 게임 규칙이 데이터 저장소 컴포넌트와 통신할 때 사용하도록 만듦
- 의존성 규칙을 준수할 수 있도록 의존성이 적절한 방향을 가리키게 만들어야 함

![1.png](/images/books/clean-architecture/chapter25/1.png)

## 클린 아키텍처?

- 과연 중요한 아키텍처 경계를 정말로 모두 발견한 것일까?
- 예를 들어 UI 에서 언어가 유일한 변경의 축은 아님
  - 다양한 가능성이 존재
- 따라서 이 변경의 축에 의해 정의되는 아키텍처 경계가 잠재되어 있을 수 도 있음

![2.png](/images/books/clean-architecture/chapter25/2.png)

- 복잡해졌지만 놀라울 것은 없음
  - 점선으로 된 테두리
    - API 를 정의하는 추상 컴포넌트
    - 해당 API 는 추상 컴포넌트 위나 아래의 컴포넌트가 구현함
- 순전히 API 컴포넌트만 집중하면 다이어그램을 단순화할 수 있음

![3.png](/images/books/clean-architecture/chapter25/3.png)

- 모든 화살표가 위를 향하도록 맞춰졌다는 점에 주목
- 정보가 흐르는 방향을 생각해보자
  - 모든 입력은 사용자로부터 전달받아 좌측 하단의 TextDelivery 컴포넌트로 전달됨
  - 이 정보는 Language 컴포넌트를 거쳐 위로 올라가며, GameRules 에 적합한 명령어로 번역됨
  - GameRules 는 사용자 입력을 처리하고 우측 하단의 DataStorage 로 적절한 데이터를 내려 보냄
  - 이후 GameRules 는 Language 로 출력을 되돌려 보내고, TextDelivery 를 통해 사용자로 전달
- 이 구성은 데이터 흐름을 두 개의 흐름으로 효과적으로 분리함
  - 왼쪽의 흐름은 사용자와의 통신에 관여
  - 오른쪽의 흐름은 데이터 영속성에 관여
  - GameRules 는 두 흐름이 모두 거치게 되는 데이터의 최종적인 처리기

## 흐름 횡단하기

- 데이터 흐름은 항상 두 가지일까? 절대로 아님

![4.png](/images/books/clean-architecture/chapter25/4.png)

- 이 구성은 데이터 흐름을 세 개의 흐름으로 분리
- 시스템이 복잡해질수록 컴포넌트 구조는 더 많은 흐름으로 분리될 것

## 흐름 분리하기

- 모든 흐름이 결국에는 상단의 단일 컴포넌트에서 서로 만난다고 생각할 수 있는데 그럴까? 현실은 훨씬 복잡함
- 더 높은 수준에는 또 다른 정책 집합이 존재할 수 있음

## 결론

- 아키텍처 경계가 어디에나 존재한다는 사실
- 아키텍트로서 우리는 아키텍처 경계가 언제 필요한지를 신중하게 파악해내야 함
- 또한 우리는 이러한 경계를 제대로 구현하려면 비용이 많이 든다는 사실도 인지하고 있어야 함
- 이와 동시에 이러한 경계가 무시되었다면 나중에 다시 추가하는 비용이 크다는 사실도 알아야 함
- 포괄적인 테스트 스위트가 존재하고 리팩터링으로 단련되었더라도 마찬가지
- 그러면 아키텍트인 우리는 어떻게 해야 할까?
- 우리는 미래를 내다봐야만 하고, 현명하게 추측해야만 함
- 이는 일회성 결정은 아님
- 프로젝트 초반에는 지켜보고, 발전함에 따라 주의를 기울여야 함
- 경계가 필요할 수도 있는 부분에 주목하고, 경계가 존재하지 않아 생기는 마찰의 어렴풋한 첫 조짐을 신중하게 관찰해야 함
- 첫 조짐이 보이는 시점이 되면, 해당 경계를 구현하는 비용과 무시할 때 감수할 비용을 가늠하고 검토하고 그 변곡점에 경계를 구현하면 됨
- 목표를 달성하려면 빈틈없이 지켜봐야 함
