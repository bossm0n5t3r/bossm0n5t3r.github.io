+++
date = 2024-12-16T23:03:00+09:00
title = "Article Weekly, Issue 50"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-12-08` ~ `2024-12-14`

## Task Schedulers in Java: Modern Alternatives to Quartz Scheduler

- Quartz Scheduler의 대안으로 현대적인 Java 태스크 스케줄러 소개
- Quartz Scheduler의 한계점:
  - 오래된 API와 아키텍처
  - 복잡한 설정과 사용법
  - 현대적 대안들에 비해 낮은 성능
  - 내장 모니터링 도구 부재
  - 분산 스케줄링이 기본이 아님
  - 산발적인 유지보수
- Quartz의 현대적 대안들:
  - Java 라이브러리로 통합되는 스케줄러:
    - JobRunr: 클라우드 네이티브 설계, 사용하기 쉬운 API, 대시보드 제공
    - db-scheduler: 단순한 설계, 분산 처리 기본 지원
  - 독립 서비스로 제공되는 워크플로우 엔진:
    - Temporal: 복원력 있는 애플리케이션 설계 지원
    - Kestra: 다양한 언어 지원, 로우 코드 접근 방식
- Spring Boot의 @Scheduled 어노테이션:
  - 기본적인 스케줄링 기능 제공
  - ShedLock과 함께 사용하여 분산 환경 지원 가능
  - 고급 기능은 제한적
- 결론:
  - 다양한 현대적 대안들로 인해 개발자들의 선택의 폭이 넓어짐
  - 애플리케이션 요구사항에 따라 적절한 도구 선택 가능

## Meet Willow, our state-of-the-art quantum chip

- Google이 최신 양자 칩 'Willow' 발표
  - 주요 성과:
    - 큐비트 수를 늘릴수록 오류를 지수적으로 감소시킴
    - 현대 슈퍼컴퓨터로 10^25년 걸릴 계산을 5분 만에 수행
- Willow의 주요 특징:
  - 양자 오류 정정에서 '임계값 이하' 달성
  - 실시간 오류 정정 구현
  - 105개의 큐비트로 최고 수준의 성능 달성
- 성능 지표:
  - 랜덤 회로 샘플링(RCS) 벤치마크 사용
  - T1 시간(큐비트가 여기 상태를 유지하는 시간)이 약 100μs로 향상
- 향후 목표:
  - 실제 응용 분야에서 '유용하고 고전을 넘어서는' 계산 시연
  - AI와 양자 컴퓨팅의 결합을 통한 혁신적인 응용 분야 개척
- 잠재적 응용 분야:
  - 신약 발견
  - 전기차용 배터리 효율 개선
  - 핵융합 및 신에너지 대안 발전 가속화

## I can now run a GPT-4 class model on my laptop

- **Llama 3.3 70B 모델 소개**
  - Meta의 Llama 3.3 70B는 GPT-4 수준의 성능을 제공하는 대형 언어 모델(LLM).
  - 일반적인 개발자 워크스테이션에서도 실행 가능하며, 비용 효율적인 추론 제공.
  - 저자는 MacBook Pro M2 (64GB RAM)에서 실행하며, 소비자 하드웨어에서의 접근성 강조.
- **모델 실행 및 설정**
  - Ollama를 사용해 Llama 3.3 70B 실행:
    - `ollama pull llama3.3` 명령어로 모델 다운로드 (42GB).
    - `llm install llm-ollama`를 통해 플러그인 설치 후 로컬 서버에서 실행.
  - MLX 라이브러리를 사용한 대안적 실행 방법:
    - Python 환경에서 MLX를 통해 모델 실행 및 SVG 생성 테스트 수행.
- **성능 및 활용 사례**
  - 모델은 다양한 작업에서 뛰어난 성능을 보여줌:
    - 텍스트 작성: 예를 들어, Half Moon Bay 시장에게 펠리컨 박스를 제안하는 편지 작성.
    - 코딩 작업: YouTube 썸네일 추출 웹 애플리케이션 생성.
    - SVG 생성: 자전거를 타는 펠리컨의 SVG 이미지 생성.
  - LiveBench 벤치마크에서 높은 평가:
    - Instruction Following 평가에서 최상위 점수 기록.
    - GPT-4 Turbo 및 Claude 3 Opus와 유사한 성능을 보임.
- **기술적 한계와 개선점**
  - 실행 시 높은 메모리 요구사항(최소 64GB RAM).
  - 초기 시도에서 메모리 부족으로 충돌 발생, 이후 최적화 필요.
- **관련 모델 및 향후 전망**
  - Qwen2.5-Coder-32B 및 Meta의 Llama 3.2 등 다른 모델과 비교.
  - 멀티모달 입력(이미지, 오디오, 비디오)과 모델 효율성에 대한 기대감 강조.
  - AGI보다는 실용적이고 비용 효율적인 모델 개발에 중점.
- **결론**
  - Llama 3.3은 소비자 하드웨어에서 실행 가능한 강력한 LLM으로, 다양한 작업에 유용함.
  - 기술 발전이 지속되며, 더 많은 가능성을 제공할 것으로 기대.

## Tree Calculus

- **Tree Calculus**는 계산의 본질을 포착하는 간단한 연산자와 의미론을 가진 투링 완전한 시스템
- 함수의 직렬화와 역직렬화가 가능하며, 다양한 형식으로 컴파일할 수 있음
- 프로그램 분석, 타입 체크, 컴파일, 최적화 등을 프로그램 내에서 수행할 수 있는 능력을 가짐

## the death of the architect

- 소프트웨어 아키텍트 역할의 변화와 현대적 접근 방식 논의
- 전통적인 소프트웨어 아키텍트의 문제점:
  - 실제 코드 작성에서 멀어짐
  - 현실과 괴리된 결정 내림
  - 팀과의 소통 부족
  - 기술 변화에 뒤처짐
- 현대적인 소프트웨어 아키텍처 접근 방식:
  - 팀 전체가 아키텍처 결정에 참여
  - 실제 코드 작성을 통한 검증
  - 지속적인 학습과 적응
- 새로운 아키텍트의 역할:
  - 팀의 기술적 리더십 제공
  - 멘토링과 코칭
  - 비즈니스와 기술 간 가교 역할
  - 지속적인 학습과 지식 공유
- 아키텍처 결정 프로세스의 변화:
  - 팀 전체가 참여하는 협력적 접근
  - 실험과 프로토타이핑을 통한 검증
  - 점진적이고 반복적인 개선
- 현대적 아키텍처 실천 방법:
  - 애자일 방법론과의 통합
  - 마이크로서비스 아키텍처 채택
  - DevOps 문화 수용
  - 클라우드 네이티브 기술 활용
- 결론:
  - 전통적인 아키텍트 역할은 사라지고 있음
  - 팀 전체가 아키텍처에 책임을 지는 방향으로 진화
  - 지속적인 학습과 적응이 중요

## Designing Web APIs: Chapter 5 - Design In Practice

- Chapter 5: Design in Practice - Web API 설계에 대한 실용적 접근
- API 설계 프로세스의 주요 단계:
  1. 요구사항 수집
  2. API 스펙 작성
  3. 프로토타입 생성
  4. 테스트 및 검증
  5. 문서화
  6. 배포 및 유지보수
- 요구사항 수집:
  - 비즈니스 목표 이해
  - 사용자 요구사항 파악
  - 기술적 제약 고려
- API 스펙 작성:
  - OpenAPI (Swagger) 사용 권장
  - 엔드포인트, 메서드, 파라미터, 응답 정의
  - 보안 요구사항 포함
- 프로토타입 생성:
  - 모의 서버(mock server) 사용
  - Postman, Swagger UI 등의 도구 활용
- 테스트 및 검증:
  - 단위 테스트, 통합 테스트, 부하 테스트 수행
  - 보안 취약점 검사
- 문서화:
  - API 참조 문서 작성
  - 사용 예제 및 튜토리얼 제공
  - 변경 로그 유지
- 배포 및 유지보수:
  - 버전 관리 전략 수립
  - 모니터링 및 로깅 구현
  - 사용자 피드백 수집 및 반영
- 실용적 팁:
  - 일관성 있는 명명 규칙 사용
  - 적절한 HTTP 상태 코드 활용
  - 페이지네이션, 필터링, 정렬 기능 구현
  - 에러 처리 및 메시지 표준화
  - HATEOAS 원칙 고려
- 결론:
  - API 설계는 반복적이고 진화하는 프로세스
  - 사용자 중심의 접근 방식 강조
  - 지속적인 개선과 학습이 중요

## I spent 5 hours learning how Google manages terabytes of metadata for BigQuery.

- Google의 BigQuery가 테라바이트 규모의 메타데이터를 관리하는 방법 소개
- BigQuery 아키텍처 개요:
  - Colossus: 분산 스토리지 시스템
  - Dremel: 분산 쿼리 엔진
  - Borg: 대규모 클러스터 관리 시스템
  - 전용 셔플 서비스: 데이터 셔플 관리
- 메타데이터 시스템 특징:
  - 중앙 집중식 메타데이터 관리 시스템 개발
  - 분산 방식으로 메타데이터 처리
  - 상세한 열 및 블록 수준 메타데이터 저장
- CMETA(Columnar Metadata) 구조:
  - 메타데이터를 컬럼 형식으로 저장
  - 각 행은 물리적 블록의 메타데이터 추적
  - 각 열은 블록 내 열의 메타데이터 추적
- 쿼리 처리 최적화:
  - 메타데이터 접근을 데이터 스캔 직전으로 지연
  - 세미 조인을 통한 필요 블록 식별
  - 컬럼 형식 메타데이터의 효율적 접근
- 증분 생성:
  - 메타데이터 변경 로그 사용
  - LSM 스타일 압축으로 기준선과 델타 생성
- 조인 및 쿼리 최적화:
  - 차원 테이블 스캔 결과로 팩트 테이블 필터 생성
  - 실시간 데이터 신호 기반 동적 실행 계획 조정
  - CMETA의 열별 통계 활용한 초기 추정
- "dry-run" 기능:
  - 쿼리 실행 없이 처리될 데이터 양 추정
  - 메타데이터 활용한 효율적 추정
- 결론:
  - 컬럼 지향 메타데이터 저장의 혁신성
  - 상세 메타데이터 저장과 효율적 접근 가능

## References

- https://foojay.io/today/task-schedulers-in-java-modern-alternatives-to-quartz-scheduler/
- https://blog.google/technology/research/google-willow-quantum-chip/
- https://simonwillison.net/2024/Dec/9/llama-33-70b/
- https://treecalcul.us/
- https://explaining.software/archive/the-death-of-the-architect/
- https://blog.mohammedsalah.online/designing-web-apis-chapter-5-design-in-practice
- https://blog.det.life/i-spent-5-hours-learning-how-google-manages-terabytes-of-metadata-for-bigquery-2c1323ef3f80
