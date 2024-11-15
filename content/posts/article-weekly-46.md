+++
date = 2024-11-16T01:30:00+09:00
title = "Article Weekly, Issue 46"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-11-10` ~ `2024-11-16`

## gRPC: 5 Years Later, Is It Still Worth It?

- 저자는 5년 전 Torq에서 gRPC와 Protobuf를 선택한 경험을 공유
- gRPC 선택의 주요 이점:
  - 하위 호환성 유지
  - 일관된 코드 품질을 위한 린팅
  - 클라이언트와 서버의 동일한 생성 코드 사용
  - 표준화된 인증, 권한 부여, 관찰 가능성 미들웨어
- 코드 생성 개선:
  - 초기에는 protoc 컴파일러 사용의 어려움
  - 현재는 `buf generate` 명령어로 간소화
- 모듈 의존성 관리:
  - 초기에는 protodep 도구 사용
  - 현재는 Buf Schema Registry(BSR)로 개선
- 프론트엔드에서의 gRPC 사용:
  - gRPC-web의 장단점 설명
  - connectrpc를 대안으로 제시
- 서비스 메시:
  - Kubernetes에서 gRPC 로드 밸런싱 문제
  - linkerd 사용으로 해결 및 추가 이점 제공
- 결론:
  - gRPC를 여전히 추천
  - buf.build, BSR, linkerd, connectrpc 등의 도구 조합 제안

## The CVM Algorithm

- CVM 알고리즘: 스트림에서 고유 요소의 수를 근사적으로 계산하는 방법
- 주요 개념:
  - 쿼리 계획에서 고유 값 개수 추정의 중요성
  - 메모리 사용량을 제한하면서 정확도 유지
- 알고리즘 발전 과정:
  1. 기본 구현: 모든 요소를 세는 방식
  2. 랜덤 샘플링 도입: 메모리 사용 감소
  3. 중복 제거: 각 요소의 마지막 등장만 고려
  4. 동적 플립 횟수 조정: 데이터셋 크기에 따라 적응
- 최종 알고리즘:
  - 메모리 사용량에 상한을 두고 동적으로 플립 횟수 조정
  - 결과는 항상 실제 값을 중심으로 분포 (편향되지 않음)
- 특징:
  - 간단하고 이해하기 쉬움
  - 해시 함수에 의존하지 않아 이론적 분석이 용이
- 실제 사용:
  - 생산 환경에서는 HyperLogLog 권장
  - 교육 및 이론적 분석에 적합

## How to implement a Distributed Lock using Redis

- 분산 환경에서의 동시성 문제 소개
  - 여러 인스턴스에서 동일한 데이터 접근 시 발생할 수 있는 문제점 설명
- 락(Lock)의 필요성
  - 중요 섹션에 대한 접근 제어를 위해 락 사용
- 분산 락(Distributed Lock)의 개념
  - 중앙 집중식 서비스로 작동하는 락
  - 여러 인스턴스 간 동기화 제공
- Redis를 이용한 분산 락 구현
  1. 단일 Redis 인스턴스 사용의 문제점
  2. Redlock 알고리즘 소개
     - 여러 Redis 인스턴스에 락 획득 시도
     - 과반수 인스턴스에서 락 획득 시 유효
     - 모든 인스턴스에서 락 해제
- 데이터베이스 락과의 비교
  - Redis 락의 장점: 성능 향상, DB 부하 감소
  - 분산 환경에서의 유용성
- 주의사항
  - Redlock의 안전성에 대한 논란 언급
- 추가 정보
  - Java와 Golang에서의 Redis 클라이언트 사용 링크 제공

## Deep Dive Into JVM Tools: Dynamic Attach and Serviceability Agent

- 소개
  - JVM 서비스 가능성 도구: Dynamic Attach와 Serviceability Agent
  - JDK 21 기준 설명
- Dynamic Attach
  - 정의: 실행 중인 Java 프로세스에 도구와 에이전트를 연결하는 기능
  - 주요 기능:
    - 실시간 진단 및 모니터링
    - 동적 에이전트 로딩
    - 최소한의 성능 오버헤드
- 제한사항
  - 복잡한 애플리케이션에서의 성능 저하 가능성
  - 일부 JVM 변형에서의 호환성 문제
  - 과도한 사용 시 애플리케이션 성능 저하
  - 접근 제어로 인한 제한
- Serviceability Agent
  - 정의: JVM 내부 데이터 구조 탐색 및 평가를 위한 진단 도구
  - 주요 기능:
    - JVM 내부 구조 접근
    - 사후 디버깅
    - 힙 덤프 및 객체 분석
    - 스레드 및 락 분석
- 제한사항:
  - 성능 저하 가능성
  - 접근 제어로 인한 제한
- 실제 사용 사례: 메모리 누수 진단 및 해결
  1. Dynamic Attach를 이용한 초기 조사
  2. Serviceability Agent를 이용한 상세 분석
  3. 해결 및 검증
- 비교
  - Dynamic Attach: 실시간 모니터링, 동적 에이전트 로딩에 적합
  - Serviceability Agent: 심층 분석, 문제 해결, 사후 디버깅에 적합
- 결론
  - 두 도구는 상호 보완적
  - JVM 성능 및 신뢰성 향상에 기여

## How Google build great engineering teams?

- Addy Osmani와의 인터뷰: Google의 Chrome Developer Experience 책임자
- 주요 주제: "Leading Effective Engineering Teams" 책 소개
- Addy Osmani 소개:
  - 25년 이상의 기술 경력
  - Chrome과 Web Platform 팀에서 근무
  - 오픈 소스 프로젝트 및 개발자 도구 기여
- 효과적인 엔지니어링 팀의 특징:
  - 심리적 안전성
  - 명확한 목표와 성공에 대한 공유된 이해
  - 지속적인 학습과 개선 문화
  - 협력적 의사결정 접근
- 좋은 팀 문화 구축:
  - 신뢰를 기반으로 한 문화
  - 목적 의식 함양
  - 명확한 의사소통
  - 다양성과 포용성 강조
  - 지속적인 학습과 성장 장려
- 개발자 생산성:
  - SPACE와 DORA 프레임워크 활용
  - 결과 중심의 접근
- Google에서 배운 리더십 교훈:
  - 데이터 기반 의사결정
  - 팀 권한 부여
  - 심리적 안전성 증진
  - 영향력 중심 접근
  - 지속적 학습
- 나쁜 리더십 행동:
  - 마이크로매니지먼트
  - '영웅적 리더십'
  - 의사소통 및 의사결정의 비일관성
  - 팀 갈등 무시
  - 정기적인 피드백 부재
- 효과적인 리더의 주요 특성과 기술:
  - 감성 지능
  - 비전과 전략적 사고
  - 적응력
  - 의사소통 능력
  - 의사결정 능력
- 10x 프로그래머에 대한 견해
- 기타 중요한 팀 요소:
  - 지속적 학습과 적응
  - 일-삶 균형과 정신 건강
  - 다양성과 포용성
  - 윤리적 리더십

## How I ship projects at big tech companies

- 주제: 대기업에서 프로젝트를 성공적으로 출시하는 방법
- 주요 포인트:
  - 출시는 어렵고 최우선 순위가 되어야 함
  - 출시는 코드 배포가 아닌 리더십 팀을 만족시키는 것
  - 한 사람이 프로젝트 전체를 이해하고 주도해야 함
- 출시의 의미:
  - 회사 내 사회적 구성물
  - 중요한 사람들이 출시되었다고 인정할 때 완료
- 커뮤니케이션의 중요성:
  - 프로젝트의 목적 명확히 이해
  - 리더십 팀과의 신뢰 유지가 최우선
- 실제 운영 환경으로의 이행:
  - 핵심 세부사항 놓치지 않기
  - 잠재적 문제에 대한 빠른 대응 필요
  - 구현 작업과 문제 해결 사이의 균형 유지
- "지금 출시할 수 있는가?" 질문의 중요성:
  - 조기 배포를 통한 문제 예측
  - 기능 플래그 활용
  - 대체 계획 준비로 신뢰 구축
- 조언:
  - 구현 작업을 줄이고 마지막 순간의 문제에 대응할 준비
  - 두려움 없이 조기에 배포하고 변경 실행
  - 용기를 가지고 임하기

## Netflix’s Distributed Counter Abstraction

- 소개
  - Netflix의 분산 카운터 추상화 서비스 소개
  - TimeSeries 추상화 위에 구축되어 대규모 분산 카운팅 지원
- 사용 사례 및 요구사항
  - Best-Effort와 Eventually Consistent 두 가지 카운터 유형 지원
  - 높은 처리량과 가용성 요구
- API
  - AddCount/AddAndGetCount, GetCount, ClearCount 등의 기본 작업 제공
  - 멱등성 토큰 지원
- 카운터 유형
  1. Best Effort Regional Counter: EVCache 기반, 빠르지만 정확도 낮음
  2. Eventually Consistent Global Counter: 정확하고 내구성 있는 글로벌 카운팅
- Netflix의 접근 방식
  - TimeSeries 추상화를 이벤트 저장소로 사용
  - 백그라운드에서 지속적인 이벤트 집계
  - 롤업 파이프라인을 통한 효율적인 집계
  - 메모리 내 큐와 동적 배치 처리 사용
- 제어 평면
  - 다양한 설정을 통해 카운터 동작 제어
- 성능
  - 전역적으로 초당 75K 요청 처리
  - 단일 자릿수 밀리초 대기 시간 제공
- 향후 과제
  - 지역별 롤업 개선
  - 오류 감지 및 오래된 카운트 처리 개선

## References

- https://kostyay.com/grpc-5-years-later-is-it-still-worth-it-b181a3b2b73b
- https://buttondown.com/jaffray/archive/the-cvm-algorithm/
- https://dev.to/ssd/how-to-implement-a-distributed-lock-using-redis-he
- https://www.baeldung.com/jvm-dynamic-attach-serviceability-agent
- https://newsletter.techworld-with-milan.com/p/how-google-build-great-engineering
- https://www.seangoedecke.com/how-to-ship/
- https://netflixtechblog.com/netflixs-distributed-counter-abstraction-8d0c45eb66b2
