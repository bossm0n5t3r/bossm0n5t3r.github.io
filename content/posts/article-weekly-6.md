+++ 
date = 2024-02-13T02:00:00+09:00
title = "Article Weekly, Issue 6"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Best of 2023: 5 Microservices Design Patterns Every DevOps Team Should Know

- 대부분 들어본 내용들이라 익숙했지만, 한 번 더 정리하는 계기가 되어서 좋았다.
- 요약
  - API 게이트웨이 패턴, 서비스별 데이터베이스(DB) 패턴, 서킷 브레이커 패턴, 이벤트 기반 패턴, Saga 패턴
  - API 게이트웨이 패턴
    - API 게이트웨이는 모든 클라이언트 요청의 단일 진입 지점으로 역할을 함
    - 이는 요청을 적절한 마이크로서비스에 라우팅하고, 나중에 응답을 집계함
    - 적절하게 설계하고 확장하지 않으면 병목 현상이 발생할 수 있음
    - 또한 가용성이 높지 않으면 단일 실패 지점이 됨
  - 서비스별 DB 패턴
    - 각 마이크로서비스에 자체 DB가 있음
      - 각 마이크로서비스는 해당 요구 사항에 가장 적합한 데이터베이스 유형을 사용할 수 있음
    - 이로써 느슨한 결합도와 높은 응집도를 보장함
    - 이는 각 마이크로서비스가 요구사항에 가장 부합하는 DB 유형을 사용하도록 지원함
  - 서킷 브레이커 패턴
    - 네트워크 또는 서비스 장애가 다른 서비스에 전파되는 걸 막을 수 있음
    - 서비스 성능을 유지하고 오류 발생 시 시간 초과를 방지하는 데 도움이 됨
    - 장애에 대한 응답성과 민감도 사이의 균형을 맞추려면 세심한 조정이 필요함
  - 이벤트 기반 (Event-Driven) 패턴
    - 서비스 상태가 변경될 때, 서비스는 이벤트를 게시(publish)함
    - 다른 서비스는 이러한 이벤트를 구독하고, 그에 맞춰 상태를 업데이트함
    - 이런 식으로 각 서비스는 실시간 소통할 필요 없이 일관성을 유지할 수 있음
      - 동기식 통신 없이도 일관성을 유지 가능
    - 서비스 간 상호 작용의 간접적인 특성으로 인해 시스템이 더 복잡해지고 이해하기 어려워질 수도 있음
  - Saga 패턴
    - 여러 서비스를 아우르는 비즈니스 트랜잭션 구현의 어려움을 해결하는 데 도움이 됨
    - Saga는 로컬 트랜잭션의 시퀀스로, 각 트랜잭션은 단일 서비스 안에서 데이터를 업데이트함
    - 로컬 트랜잭션이 실패하면 Saga는 보상 트랜잭션을 실행해 이전 트랜잭션 영향을 취소함
    - 분산 트랜잭션을 효과적으로 관리할 수 있지만 시스템에 복잡성을 추가하기도 함
    - 마이크로서비스 아키텍처에서 복잡한 비즈니스 트랜잭션을 관리하는 데 중요한 도구

## Reference

- https://devops.com/5-microservices-design-patterns-every-devops-team-should-know/