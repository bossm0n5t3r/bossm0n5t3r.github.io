+++
date = 2024-08-07T01:30:00+09:00
title = "Article Weekly, Issue 31"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-07-28` ~ `2024-08-03`

## Two Threads, One Core: How Simultaneous Multithreading Works Under the Hood

- SMT 는 Simultaneous Multithreading
- 배경 및 동기
  - SMT 도입 배경
    - 프로세서 자원 활용도를 높이기 위해 도입됨
    - 프로세서에는 수백 개의 레지스터, 여러 로드/스토어 유닛 및 산술 유닛이 있음
    - 이를 더 잘 활용하기 위해 명령어 수준 병렬 처리 (ILP) 기술 사용
  - 명령어 파이프라이닝
    - 명령어 실행을 여러 단계로 나누어 각 사이클마다 새로운 명령어를 추가 처리
    - 파이프라인 깊이가 깊을수록 더 많은 명령어를 병렬로 처리 가능
  - 슈퍼스칼라 아키텍처
    - 각 사이클마다 여러 명령어를 발행할 수 있음
    - 예를 들어, 최신 Intel Core i7 프로세서는 각 사이클마다 4개의 명령어를 발행할 수 있음
  - 수평 및 수직 낭비
    - 독립적인 명령어를 충분히 찾지 못할 때 발생하는 자원 낭비
    - 수평 낭비는 프로세서가 충분한 독립 명령어를 찾지 못할 때 발생하고, 수직 낭비는 모든 명령어가 현재 실행 중인 명령어에 의존할 때 발생함
- Intel 프로세서의 SMT 구현
- 프로세서 마이크로아키텍처
  - 프로세서 마이크로아키텍처는 세 부분으로 나뉨
    - 프론트엔드는 명령어를 가져오고 디코딩함
    - 백엔드는 실행 자원을 할당하고 명령어를 실행함
    - 리타이어먼트 유닛은 실행된 명령어의 결과를 아키텍처 상태에 커밋함
- SMT 구현 세부 사항
  - 프론트엔드
    - 명령어 포인터, 트레이스 캐시, ITLB 캐시, uop 큐 등 여러 구성 요소로 이루어짐
    - 각 구성 요소는 두 개의 논리적 프로세서를 지원하기 위해 복제되거나 공유됨
  - 백엔드
    - 자원 할당기, 레지스터 리네이밍, 명령어 준비 큐, 명령어 스케줄러 등으로 구성됨
    - 자원 할당기는 각 사이클마다 논리적 프로세서 간에 전환됨
  - 리타이어먼트 유닛
    - 명령어가 아키텍처 상태에 커밋될 준비가 되면 이를 추적하고 올바른 순서로 커밋함
- 메모리 서브시스템
  - TLB
    - 가상 주소를 물리 주소로 변환하는 작은 캐시
    - 두 논리적 프로세서 간에 동적으로 공유됨
  - L1, L2, L3 캐시
    - 각 CPU 코어는 자체 L1 캐시를 가짐
    - L2 캐시는 마이크로아키텍처에 따라 다를 수 있으며, L3 캐시는 코어 간에 공유됨
- SMT의 성능 영향
  - 단일 스레드 실행
    - SMT가 활성화된 코어에서 단일 스레드를 실행할 때 자원이 공유되므로 성능이 저하될 수 있음
  - 두 개의 스레드 실행
    - 캐시 접근 패턴에 따라 성능이 달라질 수 있음. 협력적인 스레드는 성능을 향상시킬 수 있지만, 경쟁적인 스레드는 성능을 저하시킬 수 있음
  - 보안 취약점
    - 최근 몇 년간 SMT와 관련된 보안 문제가 발견됨
    - 자원 공유와 명령어의 추측 실행으로 인해 민감한 데이터가 유출될 가능성이 있음
- 결론
  - SMT 사용 여부 결정
    - SMT는 CPU 자원 활용도를 높이고 명령어 처리량을 증가시키기 위해 설계되었지만, 성능 및 보안 측면에서 trade-off가 있음
    - 워크로드에 따라 SMT를 사용할지 여부를 결정하는 것이 중요함

## Running One-man SaaS, 9 Years In

- Healthchecks.io는 2015년 7월에 시작되었으며, 올해로 9주년을 맞이함
- 현재 652명의 유료 고객을 보유하고 있으며, 월간 반복 수익(MRR)은 14,043 USD임
- MRR 그래프는 스크립트와 스프레드시트를 사용하여 직접 작성함
- MRR이 점진적으로 증가하는 것을 기쁘게 생각하지만, 이를 최적화하는 데 집중하지 않음
- Healthchecks.io는 현재 상태로 지속 가능하며, 즐거움과 삶/일의 균형을 최적화하고 있음
- 무료 플랜의 리밋을 더 줄일 계획은 없음
- Healthchecks를 시작한 이유는 기존 서비스(Dead Man’s Snitch와 Cronitor)가 비싸다고 생각했기 때문임
- 유료 플랜의 가격을 인상할 계획도 없음
- PO 청구, 송금 결제, 맞춤형 계약, 벤더 포털 가입 등을 요구하는 엔터프라이즈 고객을 추구하지 않음
- 추가 수익이 큰 차이를 만들지 않으며, 추가적인 부담은 더 바쁘고 짜증나게 만들 것임
- 기능적으로 현재의 범위와 기능 세트에 만족하며, 추가적인 기능(예: 활성 가동 시간 모니터링, 호스팅 상태 페이지, APM 기능)을 추가할 계획은 없음

## Creativity Fundamentally Comes From Memorization

- 창의성은 **내면화된 개념을 연결하는 영감의 순간**에서 비롯됨
  - 영감은 글쓰기나 그림 그리기를 알고 있어야 가능함
  - 말장난은 작가가 이미 알고 있는 한 단어와 다른 단어 사이의 유사성을 보지 않으면 만들어질 수 없음
  - 기존 작품에 대한 친숙함이 없으면 새로운 것이 참신함지 확신할 수도 없음
- 창의성은 **예술의 패턴을 내면화**한 사람에게서 나오는데, 머릿속에 모든 것이 있기 때문에 연관성이나 참신함을 볼 수 있음
  - 따라서 자율성은 창의성을 가능하게 하고 시스템은 자율성을 더 빨리 달성하도록 도와줌
- 모든 것은 학습에서 시작됨
  - 얼마전 빠르게 학습하는 방법을 발견함
    1. 개념의 다양한 분류/패턴을 암기하기
    2. 실제 사례를 많이 접해서 이전에 학습한 패턴 중 하나와 일치시키기
  - 이는 학문적 주제 외에도 적용 가능
  - 실제로 내부에서 하는 일은 휴리스틱을 만들어서 "암기하는 것임"
    - 휴리스틱이 내재화되면 새로운 원리가 되고 우리는 더 높은 수준의 문제에 집중하게 됨
- 하지만 이렇게 하면 창의적이고 직관적이지 않고 기계적인 작업이 되지 않을까?
  - 오히려 기본기에 필요한 에너지를 줄여주어 창의성과 직관성을 높여주고, 고차원적인 문제에 집중할 수 있게 함
  - 시스템이 창의성을 직접 만들지는 않지만 창의성을 가능하게 해줌. 암기의 역할도 이와 유사함
- 파급 효과 (Ramifications)
  - 요즘 "제너럴리스트"는 "반복 전문가"에 가까움
  - 그러므로 창의적이고 싶다면 많은 것을 깊이 배우고 빨리 배우는 법을 배워야 함
    - 이를 달성하기 위해 시스템을 받아들이고, 기본에서 벗어나 새로운 것에 집중할 수 있도록 자유롭게 해야 함

## References

- https://blog.codingconfessions.com/p/simultaneous-multithreading
- https://blog.healthchecks.io/2024/07/running-one-man-saas-9-years-in/
- https://shwin.co/blog/creativity-fundamentally-comes-from-memorization