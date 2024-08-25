+++
date = 2024-08-26T03:00:00+09:00
title = "Article Weekly, Issue 34"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-08-18` ~ `2024-08-24`

## Prompt Caching (beta)

- Claude AI 가 최근 Prompt Caching 이라는 기능을 도입함
- 프롬프트 캐싱을 활성화하여 요청을 보내는 경우
  1. 시스템은 최근 쿼리에서 프롬프트 접두사가 이미 캐시되었는지 확인
  2. 발견되면 캐시된 버전을 사용하여 처리 시간과 비용을 줄임
  3. 그렇지 않으면 전체 프롬프트를 처리하고 나중에 사용할 수 있도록 접두사를 캐시함
- 다음과 같은 경우에 유용
  - 많은 예가 포함된 프롬프트
  - 많은 양의 상황 또는 배경 정보
  - 일관된 지시에 따른 반복적인 작업
  - 여러 차례에 걸친 긴 대화
- 캐시의 수명은 5분이며, 캐시된 콘텐츠가 사용될 때마다 새로 고쳐짐

## Spring Batch 애플리케이션 성능 향상을 위한 주요 팁

- 카카오페이의 유저 등급 업데이트 Batch 의 성능 분석 및 성능 저하의 원인을 분석하고 해결하는 방법
- API 호출에 대해 병렬 처리 적용 (RxKotlin 을 사용, Reactor, Coroutines 등을 사용할 수 있음)
- In Update를 통한 Database I/O 최소화
- Exposed 사용을 통해 batch insert 처리 적용

## No "Hello", No "Quick Call", and no Meetings Without an Agenda

- "Hello" 없이 대화 시작하기
  - "Hello"로 대화를 시작하는 것은 비효율적임
  - 질문을 바로 작성하면 더 빠르게 답변을 받을 수 있음
  - 기술 지원을 요청할 때는 문제를 구체적으로 설명하는 것이 중요함
- "Quick call" 요청하지 않기
  - "Quick call" 요청은 비효율적임
  - 전화는 채팅보다 더 방해가 됨
  - 메시지로 해결할 수 있는 경우가 많음
  - 문제를 설명하면서 스스로 해결할 수 있음
  - 전화는 일시적이지만, 메시지는 영구적임
  - "Quick call?" 대신 문제를 구체적으로 설명하는 것이 좋음
- "No agenda" 회의 피하기
  - 의제가 없는 회의는 비효율적임
  - 의제가 있으면 회의 준비가 가능함
  - 의제를 통해 회의의 목적과 체크리스트를 제공할 수 있음
  - 의제를 통해 회의에 필요한 사람만 참석할 수 있음
  - 기술적인 질문은 미리 작성하여 보내는 것이 좋음
- 맥락이 중요함
  - 원격 근무 시 도움을 요청할 때는 문제를 구체적으로 설명해야 함
  - 전화보다는 글로 문제를 설명하는 것이 좋음
  - 회의를 계획할 때는 명확한 의제를 제공해야 함
  - 이러한 방법을 통해 온라인 상호작용이 더 효율적이 되고 문제를 더 빨리 해결할 수 있음
- 위 내용들은 필자도 매우 공감하는 내용임

## Constraining writers in distributed systems

- 이 글에서는 분산 시스템에서 데이터 손실을 줄이는 다양한 방법을 설명함
- 기본적으로, 데이터를 여러 노드에 복제하여 노드 고장에도 데이터를 보호하려는 전략을 다룸
- 단순 복제
  - 파일을 여러 노드에 복사해 저장하여, 일부 노드가 실패해도 데이터를 복구할 수 있도록 처리
  - 그러나 노드 수가 많아질수록 데이터 손실 가능성이 증가함
- Copyset 복제
  - 단순 복제의 단점을 해결하기 위해, 미리 정의된 노드 집합(복제 집합)에만 데이터를 기록하는 방법을 사용
  - 이를 통해 데이터 손실 확률을 크게 줄일 수 있습니다.
- Quorum 시스템
  - 데이터베이스 없이 데이터를 관리하는 방법으로, 쿼럼을 사용해 어느 노드에서든 데이터를 찾을 수 있도록 보장함
- Erasure Coding
  - 여러 복사본 대신 데이터 청크와 패리티 청크로 데이터를 분산 저장하는 방법
  - 공간 효율성을 크게 향상시킬 수 있음
- 결론적으로, 시스템의 신뢰성을 높이기 위해 데이터 쓰기 방식을 제한하는 다양한 전략을 제시하고, 그에 따른 장단점을 논의함

## References

- https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
- https://tech.kakaopay.com/post/spring-batch-performance/
- https://shachaf.net/w/constraining-writers-in-distributed-systems
- https://switowski.com/blog/no-hello-no-quick-call-no-agendaless-meetings/
