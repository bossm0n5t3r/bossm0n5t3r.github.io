+++
date = 2024-12-16T23:00:00+09:00
title = "Article Weekly, Issue 49"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-12-01` ~ `2024-12-07`

## CompletableFuture Example: Crawler

- Java의 CompletableFuture를 사용한 웹 크롤러 예제 소개
  - 간단하고 짧은 코드(약 150줄)로 구현
  - 웹사이트 A에서 시작하여 웹사이트 B의 페이지로 이동하는 크롤러
- 주요 요구사항
  - Java 11 이상의 HttpClient 사용
  - Jsoup 라이브러리로 HTML 파싱
  - Vavr 라이브러리로 불변 컬렉션 사용
- 크롤러 구현 과정
  - 기본 코드 구조 설명
  - scrapeExternalLinks 메서드로 단일 페이지 크롤링
  - thenCompose를 사용한 재귀적 크롤링 구현
  - anySuccessOf 메서드로 첫 번째 성공 Future 처리
- 크롤러 개선 사항
  - 동시성 제한기 구현으로 과도한 요청 방지
  - 이미 방문한 페이지 재방문 방지 로직 추가
- 메모리 사용 및 한계점
  - 지수적으로 증가하는 페이지 수로 인한 메모리 부족 가능성
  - 수백만 페이지 크롤링 가능하나 실제 사용에는 제한적
- 코드 예시 및 설명 제공
  - GitHub에 전체 소스 코드(약 150줄) 공개

## Database Indexing Explained

- 데이터베이스 인덱싱의 중요성과 기본 개념 설명
  - 6가지 주요 데이터 구조 소개: 배열, 연결 리스트, 이진 트리, 이진 검색 트리, B-트리, B+ 트리
- 배열과 연결 리스트의 특성 및 한계점
  - 배열: 검색과 변경 작업이 느림 (O(n))
  - 연결 리스트: 삽입과 삭제는 효율적이나 검색은 여전히 느림 (O(n))
- 이진 트리와 이진 검색 트리 소개
  - 이진 트리: 노드당 최대 2개의 자식
  - 이진 검색 트리: 정렬된 구조로 O(log n) 검색 가능, 불균형 문제 존재
- 초기 데이터베이스 인덱싱 기법
  - 단일 레벨 인덱싱: 보조 테이블 사용으로 I/O 작업 감소
  - 다중 레벨 인덱싱: 계층적 구조로 성능 향상
- B-트리 소개
  - 1970년 발명, 완벽한 균형 유지
  - 다중 키와 자식을 가진 노드 구조
- B+ 트리의 특징과 장점
  - 모든 데이터를 리프 노드에 저장
  - 리프 노드 간 연결 리스트 형성으로 범위 쿼리 효율성 증가
  - 비리프 노드는 라우팅 용도로만 사용, 메모리 효율성 증가
- MySQL과 PostgreSQL의 B+ 트리 사용
  - 인덱스 노드는 OS 페이지 크기와 일치
- 인덱스 생성과 쿼리 최적화
  - 특정 쿼리를 위한 인덱스 생성의 중요성
  - 쿼리에 따른 인덱스 효율성 변화 예시

## How can I grow as an engineer without good seniors to learn from?

- 신입 데이터 엔지니어가 기술 리더 역할을 맡게 된 상황에 대한 조언 요청
- 주요 조언 내용:
  - 지속적인 학습 능력 개발
  - 비기술적 스킬(의사소통, 전문성 등) 향상
  - 오픈 소스 프로젝트 기여를 통한 학습
  - 블로그 작성, 다른 사람 가르치기 등 지식 공유 활동
  - 컨퍼런스 참석, 온라인 커뮤니티 활용
  - 사이드 프로젝트를 통한 새로운 기술 학습
  - 도메인 지식 습득의 중요성
- 현재 상황에 대한 조언:
  - 주어진 자유와 기회를 최대한 활용할 것
  - 비즈니스 이해와 상사의 기대 파악 중요
  - 모범 사례 및 베스트 프랙티스 학습과 적용
  - 외부 전문가 검토 고려
- 주의사항:
  - 비기술 회사에서의 한계 인식
  - 장기적으로는 기술 중심 조직으로 이동 고려
  - 현재 상황을 즐기되 언제든 변할 수 있음을 인지
- 석유/가스 산업 특성 고려:
  - 안전과 규정 준수의 중요성
  - 산업 특화 기술과 패턴 학습 필요
  - 네트워크 구축의 중요성

## Z Garbage Collector in Java

- Java 애플리케이션의 다양한 요구사항을 충족하기 위해 여러 가지 가비지 컬렉터가 필요함
- Z Garbage Collector (ZGC)는 Java의 고급 가비지 컬렉터 중 하나
- ZGC의 주요 특징:
  - 매우 짧은 일시 정지 시간 (밀리초 단위)
  - 대용량 힙 처리 가능 (테라바이트 단위)
  - 대부분의 작업을 애플리케이션 실행과 동시에 수행
- ZGC의 작동 방식:
  - 마킹, 준비, 재배치 등 여러 단계로 구성
  - Colored Pointers와 Load Barriers를 사용하여 동시성 구현
- ZGC의 세대별 모드:
  - JDK 21부터 도입된 기능
  - 단기 및 장기 객체를 구분하여 효율적으로 관리
- ZGC vs G1 GC 성능 비교:
  - 실험 결과, ZGC가 G1 GC보다 훨씬 짧은 일시 정지 시간 기록
  - ZGC: 약 0.7ms, G1 GC: 약 50ms의 최대 일시 정지 시간
- 실제 사례:
  - Netflix: G1 GC에서 ZGC로 전환하여 성능 개선
  - Halodoc: ZGC 도입으로 응답 시간 20% 감소, 메모리 사용량 25% 감소
- ZGC는 낮은 지연 시간이 중요한 애플리케이션에 이상적이지만, 워크로드 특성에 따라 다른 컬렉터가 더 적합할 수 있음

## Stop using JPA/Hibernate

- JPA와 Hibernate 사용을 중단해야 하는 이유에 대한 글
- 주요 문제점:
  - 복잡한 문서 (Hibernate 문서가 406페이지에 달함)
  - 가변성 문제 (기본 생성자 필요, final 클래스 사용 불가)
  - 리플렉션 사용으로 인한 보안 위험
  - 지연 로딩과 캐시 메커니즘의 복잡성
  - flush() 메서드로 인한 예측 불가능한 동작
- 추가 문제점:
  - 단일 테이블 필드 접근의 어려움
  - 비즈니스 규칙을 기술적 제약으로 취급하는 문제
  - 프레임워크 종속성 증가
- 대안 및 개선 방안:
  - 순수 SQL 사용 권장
  - 도메인 계층에서 JPA/Hibernate 분리
  - 공개 기본 생성자와 setter 사용 자제
  - SQL 생성 ID 대신 비즈니스 식별자 사용
  - JPA Repository를 DAO로 이름 변경
  - 도메인 모델과 JPA 엔티티 분리
- 결론:
  - 비즈니스 문제 해결에 집중할 것
  - 조기 아키텍처 결정 지양
  - 미래의 개발자를 위해 단순하고 유지보수 가능한 코드 작성
- 개인적으로 오래 전부터 든 생각
  - JPA 을 사용하기 위해서는 제약 조건이 너무 많아 외울게 많음
  - 그리고 Kotlin 과 호환이 좋지 않음
  - 꼭 그렇게까지 신경을 써서 써야할까?
  - Jetbrains 의 Exposed (https://github.com/JetBrains/Exposed) 도 추천
    - 유일한 단점이라 생각하는 것은 r2dbc 미지원뿐

## 7 Databases in 7 Weeks for 2025

- 2025년을 위한 7주간 7개의 데이터베이스 요약
- 목적: 새로운 데이터베이스 기술에 대한 이해 증진을 위한 7개의 데이터베이스를 각 주마다 학습하기.
- 영감을 준 출처: Luc Perkins의 책 "7 Databases In 7 Weeks".
- 1. PostgreSQL
  - 기본 데이터베이스로 널리 사용됨.
  - ACID 준수, 복제 기능이 강력함.
  - 다양한 확장 기능(예: AGE, TimescaleDB, Hydra Columnar).
  - 학습할 것: Postgres의 기능과 한계, CRUD 애플리케이션 구현.
- 2. SQLite
  - "로컬 우선" 데이터베이스 개념.
  - WhatsApp과 Signal에서 사용됨.
  - Litestream 및 LiteFS와 같은 도구로 기능 확장.
  - 학습할 것: 로컬 우선 아키텍처 실험, Postgres에서 SQLite로 전환 시도.
- 3. DuckDB
  - 임베디드 데이터베이스로 OLAP에 특화됨.
  - 다양한 데이터 포맷(CSV, JSON, Parquet 등) 지원.
  - 커뮤니티 확장 기능 존재.
  - 학습할 것: 데이터 분석과 처리를 위한 DuckDB 사용.
- 4. ClickHouse
  - 분석 작업에 강력한 성능을 발휘.
  - 수평 확장성과 샤딩된 스토리지 지원.
  - 학습할 것: 대규모 데이터셋을 활용한 분석 작업 진행.
- 5. FoundationDB
  - 데이터베이스의 기초가 되는 레이어드 아키텍처.
  - ACID 트랜잭션 성능이 뛰어나며 특정 작업에 최적화됨.
  - 학습할 것: FoundationDB 사용법 및 예제.
- 6. TigerBeetle
  - 금융 트랜잭션에 특화된 데이터베이스.
  - 오픈 소스이며, 안전성 및 정확성에 중점.
  - Zig 프로그래밍 언어로 개발됨.
  - 학습할 것: 재무 계좌 모델링과 시스템 아키텍처 이해.
- 7. CockroachDB
  - 전 세계에 분산된 데이터베이스.
  - Postgres 호환성과 대규모 스케일링 지원.
  - 다중 지역 구성 및 테이블 로컬리티 세부 옵션 제공.
  - 학습할 것: movr 예제의 재구현.
- 결론
  - 다양한 데이터베이스를 배우고 활용하는 것은 복잡한 문제 해결에 도움이 된다.

## Lossless Log Aggregation

- Lossless Log Aggregation (LLA)의 개념 소개
  - 로그 볼륨을 99% 줄이면서 데이터 손실 없이 비용 절감
  - 유사한 로그를 더 큰 집계 로그로 통합하는 프로세스
- 로깅 비용과 볼륨의 트레이드오프 문제
  - 기업들이 비용 절감을 위해 로그 양을 줄이는 일반적인 선택
  - 로그 감소의 단점: 문제 진단과 복구에 필수적인 정보 손실
- LLA의 장점
  - 100배의 볼륨 감소와 40%의 크기 감소 가능
  - 데이터 손실 없이 모든 로그 저장 가능
- LLA에 적합한 로그 그룹 유형
  - 공통 메시지 패턴을 가진 로그
  - 공통 식별자를 가진 로그
  - 여러 줄에 걸친 로그
- LLA 구현 방법
  - 관찰 가능성 파이프라인 사용 (예: OTEL Collector, Vector)
  - 로그 그룹 식별, 전달 규칙 생성, 데이터 정규화 및 집계 수행
- Nimbus 소개
  - 자동으로 고볼륨 로그 그룹을 식별하고 LLA를 적용하는 관찰 가능성 파이프라인
  - 평균적으로 첫 달에 로깅 비용의 60% 절감
- 결론
  - LLA를 통해 로그 볼륨과 비용 사이의 트레이드오프 해결 가능
  - 기업들이 필요한 모든 로그를 유지하면서 비용을 절감할 수 있는 방법 제공

## References

- https://concurrencydeepdives.com/java-completablefuture-example/
- https://computersciencesimplified.substack.com/p/database-indexing-explained
- https://news.ycombinator.com/item?id=42289955
- https://www.unlogged.io/post/z-garbage-collector-in-java
- https://www.stemlaur.com/blog/2021/03/30/tech-hibern-hate/
- https://matt.blwt.io/post/7-databases-in-7-weeks-for-2025/
- https://bit.kevinslin.com/p/lossless-log-aggregation
