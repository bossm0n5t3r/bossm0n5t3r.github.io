+++
date = 2024-12-09T00:30:00+09:00
title = "Article Weekly, Issue 48"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-11-24` ~ `2024-11-30`

## Design a Live Streaming System

- 라이브 스트리밍 시스템 설계에 대한 설명
  - Netflix에서 Mike Tyson vs. Jake Paul 경기를 라이브 스트리밍한 것을 예로 들어 설명
  - 라이브 스트리밍의 기술적 어려움: 실시간 전송, 컴퓨팅 집약적 비디오 처리, 대용량 데이터 전송
- 라이브 스트리밍 시스템의 작동 과정
  - 스트리머가 인코더를 통해 스트림 시작
  - 전 세계에 분산된 point-of-presence 서버에 연결
  - 비디오 스트림 트랜스코딩 및 세그먼트 분할
  - HLS 등의 스트리밍 포맷으로 패키징
  - CDN을 통한 캐싱
  - 시청자의 비디오 플레이어로 전송
  - 선택적으로 Amazon S3 등에 저장하여 리플레이 지원
- NAT(Network Address Translation)의 중요성
  - 인터넷 성장을 가능하게 한 핵심 기술
  - 하나의 공용 IP 주소를 여러 기기가 공유할 수 있게 함
  - IPv4 주소 고갈 방지에 기여
  - 기본적인 방화벽 역할 수행[1][2]
- 시스템 설계의 주요 구성 요소
  - 분산 컴퓨팅: 메시지 큐, 캐싱, 태스크 스케줄러
  - 확장성과 성능: 서비스 스케일링, CDN, 일관성 있는 해싱
  - 서비스 관리: 서비스 디스커버리
  - 네트워킹과 통신: DNS, 로드 밸런서, API 게이트웨이
  - 데이터 저장 및 관리: 데이터베이스, 객체 스토리지, 샤딩, 복제
  - 관찰 가능성과 복원력: 메트릭스, 로깅, 트레이싱

## The sorry state of Java deserialization

- Java에서 디스크에서 데이터를 읽는 성능 문제에 대한 분석
  - 대용량 데이터 처리 시 고수준 도구들의 성능이 매우 떨어짐
  - 10억 개의 온도 측정값을 읽고 집계하는 벤치마크 테스트 수행
- 다양한 데이터 직렬화/역직렬화 방식 비교
  - DuckDB: 2.6초 (3.0 GB)
  - Parquet (DuckDB에서): 4.5-5.5초 (3.0-5.5 GB)
  - DataInputStream + BufferedInputStream: 300초 (10 GB)
  - JDBC를 통한 스트리밍: 620초 (3.0 GB)
  - Protobuf: 91-580초 (7.5-12.3 GB)
  - Parquet in Java: 134초 (2.4 GB)
  - ObjectInputStream: 260초 (14 GB)
- 커스텀 솔루션 구현
  - 단순 커스텀 프로토콜: 56초 (9.5 GB)
  - 최적화된 커스텀 인코딩: 6.7초 (2.8 GB)
  - 메모리 매핑 사용 최적화: 5.1초 (2.8 GB)
- 주요 결론
  - 고수준 Java API들은 대용량 데이터 처리에 매우 비효율적
  - 커스텀 솔루션으로 10배 이상의 성능 향상 가능
  - 디스크 I/O가 병목이지만, 부적절한 구현으로 10배 이상 느려질 수 있음
- 벤치마크 코드 저장소 제공
  - https://github.com/vlofgren/Serialization1BRCBenchmark/

## Functional Programming with Bananas, Lenses, Envelopes and Barbed Wire

- 명시적 재귀를 몇 가지 핵심 조합자로 분해할 수 있다는 것이 논문의 핵심 아이디어
- 재귀 스킴(recursion schemes)이라고 불리는 이러한 조합자들을 학습하고 사용할 것을 제안
- 논문에서는 "바나나", "렌즈", "봉투", "철조망"이라는 용어를 사용하여 이러한 아이디어를 표현하는 특별한 구문을 소개
- 게으른 함수형 프로그래밍의 맥락에서 이론을 확장
- 데이터 타입 정의와 관련된 재귀 연산자를 기반으로 한 계산법 개발
- 이러한 연산자들에 대한 다양한 대수적 법칙을 도출하여 프로그램 유도와 조작에 유용하게 사용
- Bird와 Wadler의 "Introduction to Functional Programming"에 나오는 모든 예제 함수들을 이러한 연산자들로 표현할 수 있음을 보임
- 카타모피즘(catamorphisms)과 아나모피즘(anamorphisms)과 같은 재귀 스킴을 소개하고 설명
- 구조적 프로그래밍 방법론과 유사한 철학을 가지고 있으며, 임의의 goto 대신 구조화된 제어 흐름 기본 요소를 사용하는 것과 비슷한 접근 방식
- 이 논문은 함수형 프로그래밍에서 재귀를 다루는 새로운 방법을 제시하고, 프로그램의 구조와 추론을 개선하는 것을 목표로 함

## Can Node.js Really Handle Millions of Users?

- Node.js가 수백만 명의 사용자를 처리할 수 있는지에 대한 질문 제기
  - 짧은 답변: 가능함
  - 하지만 실제로는 더 복잡한 문제
- Node.js의 확장성
  - 애플리케이션 구조, 최적화, 시스템 리소스 관리에 따라 성능이 달라짐
- Node.js가 대규모 트래픽에 적합한 이유
  - 이벤트 기반, 비차단 I/O 모델 사용
  - 수천 개의 동시 연결을 효율적으로 처리 가능
- 전통적인 서버 아키텍처와의 차이점
  - Apache나 PHP는 각 연결마다 새 스레드 생성
  - Node.js는 단일 스레드에서 이벤트 루프를 사용해 비동기적으로 요청 처리
- Node.js의 작동 방식
  - 단일 스레드 사용
  - 이벤트 루프를 통해 비동기적으로 요청 처리
  - 한 작업이 끝나기를 기다리지 않고 다음 작업 처리 가능

## Glassdb: transactional object storage

- 클라우드에서 상태 비저장 애플리케이션과 상태 저장 애플리케이션 간의 격차에 대한 문제 제기
  - 저자는 객체 스토리지(예: AWS S3)를 사용하여 이 문제를 해결하고자 함
- GlassDB: 트랜잭션 객체 스토리지 구현 프로젝트
  - 목표: 저렴하고, 강력한 일관성을 가지며, 이식 가능한 데이터베이스 솔루션 개발
- 객체 스토리지의 성능 테스트 결과
  - 읽기: 63.1ms (90번째 백분위수)
  - 쓰기: 105ms (90번째 백분위수)
  - 메타데이터: 41.3ms (90번째 백분위수)
- 가장 단순한 데이터베이스 구현
  - SQLite를 사용하여 클라이언트 측에서 트랜잭션 실행
  - 낙관적 동시성 제어(OCC) 구현
- 분산 트랜잭션 구현의 필요성
  - 단일 객체 접근 방식의 한계 극복
  - ACID 트랜잭션을 여러 객체에 걸쳐 구현
- 격리 수준과 일관성에 대한 고찰
  - ACID 속성의 해석 차이와 용어의 혼란 설명
  - 격리 수준과 일관성 모델의 구분 제시
- 트랜잭션 알고리즘 선택
  - Strict Two Phase Locking (S2PL) 채택
  - 엄격한 직렬화 가능성 격리 수준 달성
- 구현 세부사항
  - 잠금 메커니즘
  - 커밋 프로세스
  - 교착 상태 및 충돌 해결
  - 컬렉션, 키 생성 및 삭제 처리
- 성능 최적화
  - 낙관적 잠금
  - 읽기 전용 트랜잭션 최적화
  - 단일 읽기-수정-쓰기 최적화
  - 로컬 캐시 도입
- 벤치마크 결과
  - 낮은 충돌 워크로드에서 트랜잭션 수에 따라 거의 선형적인 처리량 달성
  - 대기 시간은 대부분의 데이터베이스보다 높지만 동시성이 높아져도 비교적 안정적
- 프로젝트의 한계와 향후 과제
  - 현재 Google Cloud Storage에 특화되어 있어 다른 클라우드 제공업체로의 이식 필요

## LLM Prompt Tuning Playbook

- LLM Prompt Tuning Playbook의 주요 내용:
  - 대상 독자: LLM 프롬프팅 기술을 향상시키고자 하는 사람들
  - 목적: 프롬프팅 전략에 대한 직관과 실용적 기법 공유
  - 구성:
    - 사전 학습과 사후 학습에 대한 배경 설명
    - 프롬프팅 시 고려사항
    - 프롬프트 작성을 위한 기본 "스타일 가이드"
    - 새로운 시스템 지침 반복 절차
    - LLM의 유용성에 대한 견해
- 주요 개념:
  - "시네마틱 유니버스" 직관: 사전 학습 코퍼스를 인간 문화가 만든 모든 시네마틱 유니버스의 집합으로 이해
  - 사후 학습: LLM에게 "기본" 우주에 대한 지침 제공
  - 인간 평가자의 역할: 사후 학습 데이터 생성에 중요
- 프롬프팅 고려사항:
  - 명확하고 간결한 지침 작성
  - 자기 모순적이거나 따르기 어려운 지침 피하기
  - 긍정적 지침 사용 (부정적 지침 대신)
  - 프롬프트를 새로운 하이퍼파라미터로 인식
- 프롬프트 "스타일 가이드":
  - 마크다운 사용 권장
  - 다른 유지보수자를 위한 가독성 고려
  - 단순성 유지
  - 제로샷 지침 선호 (퓨샷 예제보다)
- 시스템 지침 반복 절차:
  - 다양한 입력 예제로 시작
  - 가장 간단한 시스템 지침으로 시작
  - 단계적으로 지침 개선 및 정제
- LLM 유용성에 대한 견해:
  - 답변 생성은 어렵지만 검증은 쉬운 경우에 적합
  - 문제를 하위 문제로 분해하여 접근 권장
  - 추론 비용 감소 추세를 고려한 미래 지향적 접근 제안

## Dear friend, you have built a Kubernetes

- 친구에게 보내는 편지
  - Kubernetes를 피하려고 했지만 결국 비슷한 시스템을 만들게 되었음을 설명하는 내용
  - 친구는 "지루한 기술"을 선택하여 간단한 컨테이너 실행을 원했지만, 결국 복잡한 스크립트와 설정으로 인해 문제가 발생함
  - Docker Compose로 전환해도 모든 문제를 해결할 수는 없으며, 배포, 롤링 업데이트, 롤백, 스케일링을 위한 별도의 솔루션이 필요함을 깨달음
- 서버 확장과 네트워크 복잡성
  - 두 번째 서버로 확장할 필요성을 느끼게 됨
  - Tailscale과 같은 오버레이 네트워크를 사용하여 서비스 발견을 시도함
  - 네트워크 복잡성을 해결하려고 노력하지만, 결국 더 많은 문제에 직면하게 됨
- 유지보수와 자동화
  - 스크립트를 만든 당사자가 휴가를 가거나 퇴사하면, 복잡한 설정과 문서화되지 않은 설정 변경 사항을 누가 관리할 것인가라는 질문이 발생
  - 커스텀 스크립트의 유지보수 문제를 해결하기 위해 Ansible을 사용하여 VM을 불변하고 버전 관리 가능하게 만듦
  - Kubernetes를 사용하지 않기 때문에 더 쉽게 유지보수할 수 있을 것이라 생각함
- 컨테이너 스포닝과 보안 문제
  - 프로그램적으로 다른 컨테이너를 생성해야 하는 요구사항이 생김
  - Docker 소켓을 웹 앱에 마운트하는 것은 보안상 위험하기 때문에, 이를 해결하기 위한 별도의 서비스 작성
    - Docker API의 안전한 부분만 노출하는 별도의 서비스를 작성하여 문제를 해결함
- 결론
  - 결국 Kubernetes와 유사한 시스템을 구축하게 되었음을 깨달음
    - 표준 설정 포맷, 배포 방법, 오버레이 네트워크, 서비스 디스커버리, 불변 노드, API 서버를 포함한 복잡한 시스템 완성

## Teen Mathematicians Tie Knots Through a Mind-Blowing Fractal

- 토론토 대학의 수학 대학원생 Malors Espinosa가 고등학생들을 위한 수학 연구 문제를 고안
  - Menger 스폰지라는 프랙탈에 관한 새로운 질문 제시
- Menger 스폰지의 특성
  - 1926년 Karl Menger가 소개한 자기 유사 도형
  - 무한히 반복되는 과정으로 생성되며, 체적은 0에 가까워지고 표면적은 무한대로 증가
- Menger의 원래 증명
  - 모든 가능한 곡선이 스폰지 표면에 내장될 수 있음을 증명
- Espinosa의 새로운 질문
  - 모든 수학적 매듭도 Menger 스폰지 내에 내장될 수 있는지 의문 제기
- 고등학생들의 연구 성과
  - Joshua Broden, Noah Nazareth, Niko Voth가 문제 해결
  - 모든 매듭이 Menger 스폰지 내에 내장될 수 있음을 증명
- 증명 방법
  - 매듭의 '호 표현(arc presentation)' 사용
  - Cantor 집합을 활용하여 매듭을 스폰지 내부로 연결
- 추가 연구
  - 사면체 버전의 Menger 스폰지에 대한 유사한 문제 탐구
  - '프레첼 매듭'에 대해 동일한 결과 증명
- 연구의 의의
  - 프랙탈의 복잡성을 측정하는 새로운 방법 제시 가능성
  - 고등학생들에게 실제 수학 연구 경험 제공
- 향후 전망
  - 물리적 모델 제작 가능성
  - 참여 학생들의 수학 진로 고려

## I Didn't Need Kubernetes, and You Probably Don't Either

- Kubernetes에서 Google Cloud Run으로 전환한 경험 공유
  - 더 간단하고 비용 효율적인 솔루션을 찾아 전환
- Kubernetes 사용 배경
  - [Clara.io](http://clara.io/) 플랫폼에서 베어메탈 머신 사용의 한계
  - Threekit.com을 위한 관리형 컴퓨팅 설정 필요성
- Kubernetes 사용의 문제점
  - 비용 초과: 기본 클러스터 구성과 과도한 프로비저닝으로 인한 높은 비용
  - 대규모 작업 관리의 어려움: 내장 스케줄러와 Argo의 한계
  - 복잡성 과부하: 단순한 작업도 복잡한 과정 필요
- Google Cloud Run의 장점
  - 비용 효율성: 사용한 CPU와 메모리에 대해서만 과금
  - 빠르고 신뢰할 수 있는 자동 확장
  - Kubernetes 관리 오버헤드 제거
  - 간단한 비동기 작업 처리
- Kubernetes의 락인(Lock-in) 문제
  - 클러스터 외부 리소스 활용의 어려움
  - 확장이나 마이그레이션의 복잡성 증가
- Cloud Run 전환 후 남은 과제
  - 서비스 이름 관리의 일관성 필요
  - Cloud Run Task의 로컬 에뮬레이션 부재
- 결론
  - Cloud Run이 비용 절감, 속도, 확장성, 단순성을 제공
  - 대규모 기업이 아닌 경우 Kubernetes가 불필요할 수 있음

## Effective Java Logging

- 효과적인 Java 로깅의 중요성과 이점 설명
  - 관찰 가능성 향상, 빠른 문제 해결, 향상된 사고 대응, 규정 준수 및 보안
- SLF4J와 Logback 선택의 이유
  - SLF4J: 일관된 로깅 API 제공
  - Logback: 다양한 기능과 사용자 정의 옵션 제공
- 14가지 주요 로깅 모범 사례:
  1. SLF4J를 로깅 파사드로 사용
  2. 효율적인 Logback 구성
  3. 적절한 로그 레벨 사용
  4. 의미 있는 로그 메시지 작성
  5. 동적 콘텐츠에 플레이스홀더 사용
  6. 예외 발생 시 스택 트레이스 로깅
  7. 성능을 위한 비동기 로깅 구현
  8. 적절한 로깅 세분화 수준 유지
  9. 로그 파일 모니터링 및 순환
  10. 민감한 정보 보호
  11. 구조화된 로깅 채택
  12. 모니터링 도구와의 통합
  13. 분산 환경에서 로그 집계
  14. 스마트 로깅 구현
- 각 모범 사례에 대한 구체적인 예시와 피해야 할 사례 제시
- 결론: 효과적인 로깅은 단순한 데이터 캡처를 넘어 적절한 시기에 적절한 형식으로 올바른 데이터를 캡처하는 것의 중요성 강조

## References

- https://blog.bytebytego.com/p/ep139-design-a-live-streaming-system
- https://www.marginalia.nu/log/a_110_java_io/
- https://research.utwente.nl/en/publications/functional-programming-with-bananas-lenses-envelopes-and-barbed-w
- https://javascript.plainenglish.io/can-node-js-really-handle-millions-of-users-e57415e4fb86
- https://blog.mbrt.dev/posts/transactional-object-storage/
- https://github.com/varungodbole/prompt-tuning-playbook
- https://www.macchaffee.com/blog/2024/you-have-built-a-kubernetes/
- https://www.quantamagazine.org/teen-mathematicians-tie-knots-through-a-mind-blowing-fractal-20241126/
- https://benhouston3d.com/blog/why-i-left-kubernetes-for-google-cloud-run
- https://foojay.io/today/effective-java-logging/
