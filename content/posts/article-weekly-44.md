+++
date = 2024-11-03T00:55:00+09:00
title = "Article Weekly, Issue 44"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-10-27` ~ `2024-11-02`

## Stop using if-else statements in Java

- 이 글은 Java에서 if-else 문의 과도한 사용을 줄이고 코드를 최적화하는 방법을 설명
- 여러 if-else 조건을 가진 배송 비용 계산기 예제를 통해 문제점을 보여줌
- 다음과 같은 최적화 기법들을 소개
- Enum 사용
  - if-else 문을 enum으로 대체
  - 장점: 확장성과 유지보수성 향상
  - 단점: 새 매개변수 추가 어려움, 상속 제한
- 팩토리 패턴
  - 각 배송 유형에 대한 인터페이스와 구체 클래스 생성
  - 팩토리 클래스로 적절한 전략 라우팅
  - 장점: 쉬운 확장성, 논리적 분리, 유연성
- 전략 패턴
  - 팩토리 패턴과 유사하지만 사용 방식이 다름
  - 컨텍스트 클래스로 전략 관리
  - 동적 전략 선택 가능
- Stream API와 Map
  - HashMap을 사용해 배송 비용 저장
  - Java 8 Stream API로 필터링과 매핑
  - 간단한 시나리오에 적합하나 확장성은 떨어짐
- 이러한 접근 방식들이 코드의 가독성, 유지보수성, 확장성을 향상시키는 이점을 강조
- 저자는 특정 사용 사례와 복잡성 요구사항에 따라 가장 적절한 기법을 선택할 것을 권장

## Mercurial vs Git – Let’s Examine

- Mercurial과 Git은 2005년에 출시된 분산형 버전 관리 시스템(VCS)
- Mercurial의 주요 특징
  - 간단하고 직관적인 명령어 구조
  - 선형적인 변경 이력 추적
  - 불변의 이력 관리
  - 큰 프로젝트에 효과적 (예: Mozilla, NGINX)
- Git의 주요 특징
  - 더 복잡하지만 강력한 명령어 구조
  - 가볍고 유연한 브랜치 관리
  - 이력 수정 가능 (rebase, cherry-pick 등)
  - SHA-1 해시를 통한 리비전 추적
- Mercurial vs Git 주요 차이점
  - 구현: Git은 더 복잡, Mercurial은 더 직관적
  - 브랜칭: Git은 의도적 브랜치 생성, Mercurial은 변경 시 자동 생성
  - 이력 관리: Git은 수정 가능, Mercurial은 불변
  - 리비전 추적: Git은 SHA-1 해시, Mercurial은 순차적 번호
  - 커뮤니티: Git이 더 큰 커뮤니티와 활발한 생태계 보유
- 선택 시 고려사항
  - 도입 용이성
  - 변경 추적 방식
  - 커뮤니티 지원

## Write code that is easy to delete, not easy to extend.

- 모든 코드는 유지보수 비용이 발생하므로, 재사용 가능한 코드보다는 쉽게 삭제할 수 있는 코드를 작성해야 함
- 코드 재사용은 나중에 변경하기 어려워질 수 있음. API 사용자가 많을수록 변경 시 더 많은 코드를 수정해야 함
- 코드 작성을 최소화하고, 복사-붙여넣기를 통해 종속성 생성을 피하되 관리를 위해 반복하지 말 것
- 코드를 계층화하고, 간단한 API를 만들되 구현은 단순하게 할 것
- 자주 변경되는 부분과 변경 가능성이 높은 부분을 분리할 것
- 때로는 큰 덩어리의 코드를 작성하는 것이 작은 실수를 반복하는 것보다 나을 수 있음
- 큰 덩어리의 코드는 유지보수 비용이 높으므로, 책임을 분리하여 코드를 조각내야 함
- 느슨한 결합을 통해 일부를 삭제해도 다른 부분을 재작성하지 않도록 해야 함
- 오류 처리와 복구는 코드베이스의 바깥 계층에서 수행하는 것이 좋음 (End-to-end 원칙)
- 기존 코드와 분리하여 새 코드를 작성하면 새로운 아이디어를 더 쉽게 실험할 수 있음
- 좋은 코드란 한 번에 올바르게 작성하는 것이 아니라, 방해가 되지 않는 레거시 코드를 말함

## Macro trends in the tech industry | October 2024

- AI와 생성형 AI(GenAI)가 소프트웨어 개발 생태계에 큰 영향을 미치고 있음
- AI 도구들이 소프트웨어 개발 전 과정에 영향을 주고 있으며, 특히 코딩 보조 도구들이 가장 성숙한 상태임
- 온디바이스 LLM과 엣지 디바이스에서의 추론이 증가하고 있어 프라이버시에 도움이 됨
- AI의 한계와 위험에 대한 인식이 높아지고 있으며, 여전히 인간의 개입이 중요함
- AI 관련 투자에 대한 ROI 의문과 과대 광고에 대한 반발이 증가하고 있음
- Rust 언어의 사용과 관련 도구가 크게 증가하고 있음
- WebAssembly(WASM)가 브라우저와 서버 양쪽에서 주목받고 있음
- PostgreSQL 데이터베이스의 확장성과 새로운 오픈소스 데이터 레이크 솔루션들이 부상하고 있음
- 기술 거버넌스의 중요성이 계속되고 있으며, Build Your Own Radar(BYOR) 같은 접근법이 가치를 제공함
- 문서화의 품질과 최신성 유지가 여전히 과제이며, GenAI가 이를 개선하는 데 도움이 될 수 있음
- 인프라스트럭처 as 코드(IaC)가 계속 진화하고 있으며, 인프라스트럭처 from 코드(IfC) 개념이 등장함

## Vector Databases Are the Wrong Abstraction

- 벡터 데이터베이스는 잘못된 추상화 개념이며, 임베딩을 독립적인 데이터로 취급하는 것이 문제임
- 임베딩은 원본 데이터에서 파생된 데이터로 보아야 하며, 이를 "벡터화기(vectorizer)" 추상화로 접근해야 함
- 현재 벡터 데이터베이스 접근 방식은 여러 데이터베이스 관리, 복잡한 ETL 파이프라인, 동기화 서비스 등의 문제를 야기함
- 벡터화기 추상화는 데이터베이스 시스템이 임베딩 생성과 업데이트를 자동으로 처리하게 함으로써 개발자의 부담을 줄임
- Timescale에서 개발한 pgai Vectorizer는 PostgreSQL용 벡터화기 구현체로, 자동 동기화, 데이터-임베딩 관계 강화, 간소화된 데이터 관리 등의 이점을 제공함
- pgai Vectorizer는 SQL을 통해 정의되며, 소스 테이블 변경을 추적하고 비동기적으로 벡터 임베딩을 생성 및 업데이트함
- 사용자는 청킹, 포맷팅, 임베딩 모델 선택 등을 커스터마이즈할 수 있어 다양한 데이터 유형과 애플리케이션에 적용 가능함
- pgai Vectorizer는 현재 Early Access 단계이며, 오픈 소스로 제공되거나 Timescale Cloud에서 완전 관리형으로 사용 가능함

## Iterator Design Pattern Java

- 반복자(Iterator) 디자인 패턴은 GOF 패턴 중 행동 패턴에 속함
- 컬렉션이나 객체 그룹을 순회할 때 사용되며, 클라이언트 측의 복잡성을 줄임
- 접근과 순회 책임을 실제 객체에서 분리하여 반복자 객체에 위임함
- 개방-폐쇄 원칙을 만족시키고 클래스 간 결합도를 낮춤
- Java의 java.util 패키지에서 List와 Map 반복자로 구현되어 있음
- 구현 예시로 도서관의 책 목록을 순회하는 코드를 제시함
- 주요 구성 요소
  - Iterator 인터페이스: hasNext()와 next() 메서드 정의
  - 구체적인 Iterator 클래스: 실제 순회 로직 구현
  - Aggregate 인터페이스: 반복자를 반환하는 메서드 정의
  - 구체적인 Aggregate 클래스: 특정 Iterator 구현체 반환
- 클라이언트 코드는 구체적인 Aggregate를 사용하여 Iterator를 얻고 순회함
- 장점
  - 클래스 간 결합도 감소 및 코드 재사용성 향상
  - 컬렉션의 내부 구조를 숨김(추상화)
  - 순회 과정에 대한 더 나은 제어 가능

## References

- https://medium.com/javarevisited/stop-using-if-else-statements-in-java-57234e13bf9d
- https://www.incredibuild.com/blog/mercurial-vs-git-lets-examine
- https://programmingisterrible.com/post/139222674273/write-code-that-is-easy-to-delete-not-easy-to
- https://www.thoughtworks.com/insights/blog/technology-strategy/macro-trends-tech-industry-october-2024
- https://www.timescale.com/blog/vector-databases-are-the-wrong-abstraction/
- https://medium.com/javarevisited/iterator-design-pattern-java-f0d5a33e3262
