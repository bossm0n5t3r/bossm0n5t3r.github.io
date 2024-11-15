+++
date = 2024-11-16T01:00:00+09:00
title = "Article Weekly, Issue 45"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-11-03` ~ `2024-11-09`

## We’re leaving Kubernetes

- Gitpod은 6년 동안 Kubernetes를 사용하여 클라우드 개발 환경 플랫폼을 구축했으나, 결국 Kubernetes가 개발 환경 구축에 적합하지 않다고 결론지음
- 개발 환경의 특성
  - 매우 상태 지향적이고 상호작용적임
  - 개발자들은 소스 코드와 변경 사항에 깊이 관여함
  - 예측 불가능한 리소스 사용 패턴을 가짐
  - 광범위한 권한과 기능이 필요함
- Kubernetes 사용 시 주요 문제점
  - 리소스 관리의 어려움 (CPU, 메모리 할당)
  - 스토리지 성능 최적화의 복잡성
  - 자동 확장 및 시작 시간 최적화의 어려움
  - 네트워킹 복잡성
  - 보안 및 격리 문제
- 시도한 해결책들
  - CPU 관리: CFS 기반 스키마, 커스텀 컨트롤러 등
  - 메모리 관리: 고정 할당, 스왑 공간 활용
  - 스토리지: SSD RAID, 블록 스토리지, PVC 등 실험
  - 자동 확장: 고스트 워크스페이스, 밸러스트 파드, 오토스케일러 플러그인 등
  - 이미지 풀 최적화: 데몬셋 프리풀, 레이어 재사용 최대화 등
  - 보안: 사용자 네임스페이스, 파일시스템 UID 시프트 등
- 결론적으로, Kubernetes는 잘 제어된 애플리케이션 워크로드를 실행하기 위해 설계되었으며, 개발 환경의 특수한 요구 사항을 충족시키기에는 부적합하다고 판단
- Gitpod은 이러한 경험을 바탕으로 Kubernetes를 떠나 새로운 접근 방식을 모색하기로 결정

## Tests as docs? 🤔

- 테스트는 문서화 역할을 할 수 있는 장점이 있음
- 기본적으로 `mix test` 명령어는 문서화에 적합한 정보를 제공하지 않음
- 두 가지 플래그를 추가하여 테스트 결과를 개선할 수 있음
  - `-trace`
    - `max-cases`를 1로 설정 (동시성을 1로 제한)
    - 더 자세한 정보를 출력
  - `-seed 0`
    - 테스트를 정의된 순서대로 실행
    - 이 두 플래그를 사용하면 테스트 설명을 명확하게 출력할 수 있음
    - 결과적으로 각 테스트가 무엇을 검증하는지 쉽게 확인 가능

## 1 Year of Consistent LeetCoding

- 저자는 2023년 9월, 구글 Foobar 챌린지에 도전함
  - 처음 3개 문제는 쉽게 해결했으나, 4번째 그래프 문제에서 어려움을 겪음
  - 구글 면접까지 갔으나 합격하지 못함
  - 이 경험을 계기로 데이터 구조와 알고리즘(DSA) 공부를 결심
- LeetCode 75 문제 세트로 학습 시작
  - 매일 LeetCode 도전 문제를 풀어 365일 이상 연속 해결 기록 달성
  - Google Sheet를 사용해 문제 풀이 진행 상황 추적
- 문제 해결 시간 제한 설정
  - Easy: 25분 이내
  - Medium: 45분 이내
  - Hard: 1시간 이내
- 주요 학습 주제
  - 배열(Arrays): DSA의 기본
  - 문자열(Strings): 대부분 언어에서 불변(immutable)
  - 해시 테이블(Hash Tables): O(1) 삽입/삭제 속도
  - 정렬(Sorting): 최소 두 가지 알고리즘 숙지 필요
  - 그리디 알고리즘(Greedy Algorithms): 조건 충족 시 조기 종료 가능
- 결론
  - DSA 학습은 중독성이 있으며, 패턴을 발견하면 문제 해결이 기계적으로 됨
  - 저자는 구글 재도전을 희망하며 계속해서 LeetCode 문제를 풀 예정
- 추가 정보
  - NeetCode를 DSA 학습 자료로 추천
    - https://neetcode.io/
  - LeetCode 리스트를 풀고 어려운 주제를 깊이 있게 공부하는 방법 제안

## Lessons learned from a successful Rust rewrite

- 저자는 C++에서 Rust로의 점진적 재작성 프로젝트를 완료함
- 잘 작동한 점
  - 점진적 재작성 접근 방식
  - 코드 단순화 및 이해도 향상
  - 성능 개선 기회 발견
  - 불필요한 코드 제거
  - 경계 검사 및 산술 오버플로우 방지
  - 크로스 컴파일 용이성
  - 내장 테스트 프레임워크의 유용성
  - 정확성에 대한 더 많은 관심
  - CMake 파일 제거
- 잘 작동하지 않은 점
  - 여전히 정의되지 않은 동작(UB) 추적 필요
  - Miri의 한계와 Valgrind 사용 필요성
  - 메모리 누수 추적의 어려움
  - 크로스 컴파일의 일부 제한사항
  - cbindgen의 한계
  - 불안정한 ABI
  - 사용자 정의 메모리 할당자 지원 부족
  - 복잡성 증가
- 결론
  - 전반적으로 만족스러운 재작성이지만 예상보다 많은 노력 필요
  - C 상호 운용성이 많은 Rust 사용은 순수 Rust와 다른 경험
  - 안전하지 않은 코드, 표준 라이브러리, 문서, 도구 등의 개선 필요
  - 순수 Rust 프로젝트로 시작하는 것을 추천
  - 향후 유사한 프로젝트에서는 Zig 고려 가능성 언급

## Good software development habits

- 저자가 효과적이라고 생각하는 10가지 소프트웨어 개발 습관

1. 커밋을 작게 유지하기
   - 버그 추적과 롤백이 용이해짐
2. 지속적인 리팩토링 실천
   - Kent Beck의 조언 따르기: "변경을 쉽게 만들고, 쉬운 변경을 하기"
3. 모든 코드를 책임으로 여기기
   - 배포되지 않은 코드는 가장 큰 책임
   - 테스트와 프로덕션 배포로 확신 얻기
4. '작동하는 소프트웨어'를 진전의 척도로 삼기
   - 배포 가능한 상태를 '작동'으로 정의
5. 프레임워크 기능 테스트 피하기
   - 작은 컴포넌트 유지로 테스트 필요성 줄이기
6. 새로운 기능에 대해 새 모듈 생성하기
   - 부적절한 위치에 강제로 넣지 않기
7. API 설계 시 테스트 먼저 작성하기
   - 사용자 관점에서 생각하도록 유도
8. 코드 중복은 두 번째부터 피하기
   - 세 번째 복사부터는 추상화 고려
9. 디자인의 변화를 받아들이기
   - 소프트웨어 개발의 핵심은 변화에 대한 적응력
10. 기술 부채 관리하기
    - 현재와 가까운 미래에 영향을 주는 문제에 집중

- 추가 조언:
- 테스트 가능성은 좋은 설계와 연관됨
- 테스트하기 어려운 부분은 설계 변경 신호일 수 있음

## API Design in the Post-OpenAPI Era

- OpenAPI 시대 이후의 API 설계에 대한 글
- 주요 내용
  - OpenAPI의 영향과 한계점 논의
  - API 설계의 새로운 접근 방식 소개
- OpenAPI의 영향
  - API 문서화와 설계의 표준화에 기여
  - 많은 개발자와 기업에서 채택
- OpenAPI의 한계
  - 복잡한 API 설계에 대한 제한적 지원
  - 동적이고 유연한 API 요구사항 반영의 어려움
  - 포스트 OpenAPI 시대의 API 설계 트렌드:
  - 더 유연하고 적응력 있는 설계 방식 필요성 강조
  - 마이크로서비스 아키텍처와의 통합 고려
  - 실시간 및 이벤트 기반 API에 대한 관심 증가
- 새로운 API 설계 접근 방식
  - 도메인 주도 설계(DDD) 원칙 적용
  - GraphQL과 같은 쿼리 언어의 활용
  - API 버전 관리의 새로운 전략 모색
- 결론
  - OpenAPI는 여전히 중요하지만, 더 진화된 API 설계 방식 필요
  - 비즈니스 요구사항과 기술 발전을 반영한 유연한 접근 강조

## Kafka for Java Developers

- 메시지 큐의 정의와 주요 특징 소개
- Kafka가 좋은 메시지 큐인 이유
  - 높은 처리량
  - 확장성
  - 내구성
  - 장애 허용성
  - 고가용성
  - 스트림 처리
  - 강력한 순서 보장
  - 다중 소비자 지원
  - 유연한 데이터 보존
  - 효율적인 저장
- Kafka의 주요 개념
  - 토픽, 프로듀서, 컨슈머
  - 파티션, 오프셋
  - 브로커, ZooKeeper
  - 복제
- Java 개발자를 위한 중요 영역
  - 직렬화와 역직렬화
  - Kafka Streams
  - Schema Registry
  - 오류 처리와 재시도
  - 모니터링과 메트릭
  - 보안
  - 튜닝과 최적화
  - 데이터 보존 처리
- Java API 개요
  - Maven/Gradle 의존성 추가
  - KafkaProducer API 사용 예
  - KafkaConsumer API 사용 예
- 다중 컨슈머 그룹 구성
  - 공통 구성 속성
  - 컨슈머 그룹별 구성 예시
  - 전체 예제 코드
- 결론
  - Java 개발자에게 필요한 Kafka 개념과 API 이해의 중요성 강조
  - 효과적인 데이터 스트리밍 및 실시간 분석 애플리케이션 구축을 위한 핵심 영역 언급

## I'm Not Mutable, I'm Partially Instantiated

- Prolog에서의 사전 구현 소개
  - 6줄의 코드로 정렬된 이진 검색 트리 구현
  - `lookup/3` 규칙을 사용하여 사전에 추가 및 조회 가능
- 불완전 데이터 구조 개념
  - 논리 프로그래밍에서 값은 불변이지만, 사전은 부분적으로 인스턴스화됨
  - 이진 트리의 왼쪽과 오른쪽 가지가 변수로, 나중에 결정될 수 있음
  - 불변성을 유지하면서 동적으로 확장 가능
- 사전 리팩토링
  - 키 존재 여부 확인을 위해 `nonvar/1` 사용
  - 단일 규칙과 if/then 제어 구조 사용
  - `compare/3`를 사용하여 다양한 키 타입 지원
  - 키-값 쌍을 `Key-Value` 형태로 저장
- 개선된 기능
  - 사전을 쌍의 리스트로 직렬화 가능
  - `keysort/2`를 사용한 정렬 기능
  - `lookup/3`을 `add/3`와 `get/3`로 래핑하여 코드 명확성 향상
- 결론
  - 20년 전 "The Art of Prolog"에서 언급된 제한사항들 해결
  - 현대적이고 유연한 사전 구현 제시

## T 50 avionics embedded software development using java

- 프로젝트 정보
  - T-50 항공 전자기기 개발을 위한 Java 사용
  - KAI(한국항공우주산업 주식회사) 주관 정부 지원 프로젝트
  - 실시간 Java 언어로 개발된 임무 소프트웨어
- 프로젝트 개요
  - 핵심 소프트웨어 개발
  - 핵심 항공 전자기기 하드웨어 및 시험 벤치를 포함한 전체 시스템 개발
- Java 선택 이유
  - 이전 프로젝트에서의 C/C++ 경험
    - 포인터 관련 문제
  - Java의 장점과 단점
    - 실시간 Java 활용
  - 프로그래밍 언어 트렌드 분석
- 주요 소프트웨어
  - 초기 T-50 OFP보다 개선된 기능으로 6개의 독립적인 MFD 페이지 지원
  - 항공 훈련 기능 포함
- 개발 과정
  - OFP 설계와 최적화 과정
  - 성능 평가 및 최적화
    - Java의 속도와 크기 이슈
    - JNI 호출 최소화 및 디자인 고려
- 결과
  - Java와 기존 C에 대한 성능 비교: Java는 C보다 약 2배 느림
  - 최적화를 통해 속도 문제와 크기 문제를 해결
- 고려 사항 및 교훈
  - JNI 사용에 따른 장단점
  - 안전 기준 준수(DO-178C) 및 오픈 소스 도구의 활용
  - Java는 안전-critical, 하드 실시간 내장 소프트웨어 개발에 적합한 언어
- 결론
  - 업계 변화에 따라 Java 기술을 적용하여 향후 개발 방향 설정
  - 프로젝트 책임자 및 문의 정보 제공

## References

- https://www.gitpod.io/blog/we-are-leaving-kubernetes
- https://www.elixirstreams.com/tips/tests-as-docs
- https://dev.to/davinderpalrehal/1-year-of-consistent-leetcoding-26d0
- https://gaultier.github.io/blog/lessons_learned_from_a_successful_rust_rewrite.html
- https://zarar.dev/good-software-development-habits/
- https://nordicapis.com/api-design-in-the-post-openapi-era/
- https://medium.com/@alxkm/kafka-for-java-developers-bdeea0f7e3df
- https://blog.dnmfarrell.com/post/incomplete-data-structures/
- https://www.slideshare.net/slideshow/t-50-avionics-embedded-software-development-using-java/10793710
