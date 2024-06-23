+++
date = 2024-06-24T02:15:00+09:00
title = "Article Weekly, Issue 25"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-06-16` ~ `2024-06-22`

## Maintaining large-scale AI capacity at Meta

- Meta는 대규모 언어 모델(LLM) 학습을 위해 대규모 계산 능력이 필요함
- 전통적인 AI 모델 학습은 많은 수의 모델을 학습시켰지만, 비교적 적은 수의 GPU가 필요했음
- 생성형 AI(GenAI)의 등장으로 작업 수는 줄었지만, 매우 큰 작업이 필요해짐
- 대규모 모델 훈련의 도전 과제
  - 하드웨어 신뢰성
    - 하드웨어 고장으로 인한 훈련 중단을 최소화하기 위해 엄격한 테스트와 품질 관리 필요
  - 고장 시 빠른 복구
    - 하드웨어 고장이 발생하면 빠르게 복구할 수 있어야 함. 재스케줄링 오버헤드를 줄이고 빠른 훈련 재초기화 필요
  - 훈련 상태의 효율적 보존
    - 고장 시 훈련 상태를 효율적으로 저장하고 복구할 수 있어야 함
  - GPU 간 최적의 연결성
    - 대규모 모델 훈련은 GPU 간 데이터 전송이 중요
    - 이를 위해 고속 네트워크 인프라와 효율적인 데이터 전송 프로토콜 필요
- 인프라 스택의 모든 계층을 개선하는 것이 중요함

## Experts vs. Imitators

- 최고 품질의 정보를 원한다면 최고의 전문가와 대화해야 하지만, 문제는 많은 사람들이 전문가라고 주장하지만 실제로는 그렇지 않다는 것
- 진정한 전문가(Experts)와 모방자(Imitators)를 구별하기 위해 몇 가지 중요한 특징을 알아야 함
- 모방자의 특징
  - 깊이 있는 질문에 답하지 못함
    - 특정 지식은 배워서 얻는 것이 아니라 경험으로 얻는 것임
    - 모방자는 얕은 지식을 가지고 있어 세부 사항, 기본 원칙, 비표준 사례에 대해 좋은 답변을 하지 못함
  - 어휘를 적응하지 못함
    - 배운 어휘만 사용하며, 종종 전문 용어로 가득 참
    - 아이디어를 완전히 이해하지 못해 청중에게 더 명확하게 설명할 수 없음
  - 이해하지 못한다고 하면 좌절함
    - 전문가로 보이려는 외형에 집착하기 때문
    - 진짜 전문가는 자신의 지식을 공유하는 것을 즐기며, 이해하지 못하는 것에 좌절하지 않고 진정한 호기심을 좋아함
  - 실패 경험을 이야기할 수 있음
    - 학습 과정에서 실패가 일부분임을 알고 있음
    - 모방자는 이미지 손상을 두려워해 실수를 인정하지 않음
  - 자신의 전문 지식의 한계를 모름
    - 전문가들은 자신이 아는 것과 모르는 것을 구분할 수 있음
    - 모방자는 자신이 이해하지 못하는 영역을 넘어서도 구분하지 못하여, 모르는 분야에 대해서도 아는 척함
- 전문가와 대중화된 정보 제공자 구별
  - 많은 사람들이 원래 연구나 전문가의 말을 듣기보다는 대중화된 정보를 통해 주제를 배움
  - 대중화된 정보 제공자는 전문가가 아니며, 아이디어를 명확하고 기억에 남게 전달하는 데 능숙함
  - 따라서대중화된 정보 제공자가 전문가로 오해받을 수 있음

## UUIDv7 in 32 languages

- UUIDv7 을 구현하는 다양한 언어들에 대해 소개

## What You Get After Running an SSH Honeypot for 30 Days

- 허니팟이란?
  - 공격자가 시스템에 침입하려 할 때 공격을 감지하고 기록하는 장치
- 30일간 SSH Honeypot을 운영한 결과
  - 30일간 총 11,599번의 로그인 시도가 있었으며, 하루 평균 386번의 로그인 시도가 있었음
  - 가장 많이 사용된 사용자명은 root, 345gs5662d34, admin, pi 등이었음. 그외 ubuntu, ubnt, support, user, oracle 등
    - 345gs5662d34는 Polycom CX600 IP 전화기의 기본 자격증명일 가능성이 있음
  - 가장 많이 사용된 비밀번호는 345gs5662d34, 3245gs5662d34, admin, 123456, password 등이었음
- 로그인 후 실행된 명령어들을 분석한 결과, 다음과 같은 의심스러운 활동들이 발견됨
  - 가장 많이 실행된 명령어
    - `echo -e “\x6F\x6B”` : 6,775회
    - `cd ~; chattr -ia .ssh; lockr -ia .ssh` : 1,016회
    - `uname -s -v -n -r -m` : 320회
  - `oinasf` 스크립트 실행 후 `uname -s -m` 명령어로 시스템 정보 수집 시도
  - `./ip cloud print` 명령어를 통해 MikroTik 라우터 공격 시도
  - `mdrfckr` 암호화폐 채굴기 설치 및 다른 채굴기 프로세스는 종료시킴
  - MIPS 아키텍처 악성코드 유포 시도 (주로 라우터와 IoT 장치 대상)
  - Gafgyt (BASHLITE) 악성코드의 일부인 `Sakura.sh` 스크립트 실행
    - Gafgyt 는 IoT 기기와 리눅스 시스템을 감염시키는 봇넷으로, DDoS 공격 등의 기능을 가지고 있음
    - 약한 비밀번호나 기본 비밀번호, 알려진 취약점을 이용해 장치를 장악하려 함
    - 2014년부터 존재하며, DDoS 공격을 실행할 수 있는 여러 변종으로 발전함

## How Pinterest Scaled to 11 Million Users With Only 6 Engineers

- Pinterest 의 확장 과정은 네 단계로 나뉨
  - 자아 발견의 시대
    - 소규모 엔지니어 팀이 신속한 프로토타입 제작과 진화하는 제품 요구 사항을 관리
  - 실험의 시대
    - 사용자 수의 급격한 증가로 빠른 확장이 필요했으나, 복잡하고 취약한 시스템을 초래
  - 성숙의 시대
    - MySQL, Memcache, Redis와 같은 성숙하고 확장 가능한 기술을 사용하여 아키텍처를 단순화
  - 회귀의 시대
    - 적절한 아키텍처를 갖춘 후, 수평적으로 확장하여 성장 지속
- Pinterest 는 신뢰성, 이해하기 쉬움, 확장성을 중시하는 기술을 우선시함
  - MySQL
    - 안정적이고 유지보수 용이한 관계형 데이터베이스
  - Memcache
    - 자주 액세스되는 데이터를 메모리에 캐싱하여 데이터베이스 읽기를 오프로드
  - Redis
    - 다양한 데이터 구조를 처리할 수 있는 유연한 데이터 저장소
  - Solr
    - 빠르게 사용 가능한 검색 플랫폼
- 데이터베이스 확장은 클러스터링 후 부정적인 경험을 통해 샤딩으로 마이그레이션함
- Pinterest의 확장 여정에서 얻은 주요 교훈
  - 단순함이 중요
    - 이해하기 쉬운 기술 선택이 문제 해결과 위험 감소에 도움
  - 확장성 우선
    - 급속한 성장 환경에서는 데이터베이스 기능을 희생하더라도 확장성을 우선
  - 수평적 확장 설계
    - 사용자 기반이 확장됨에 따라 리소스를 추가할 수 있는 아키텍처 선택

## How Stripe’s document databases supported 99.999% uptime with zero-downtime data migrations

- Stripe는 2023년에 총 결제량 1조 달러를 처리하면서도 99.999%의 가동 시간을 유지함
- Stripe의 데이터베이스 인프라 팀은 API의 기반 계층으로 DocDB라는 Database as a service (DBaaS)를 제공함
- DocDB는 MongoDB Community의 확장판으로, Stripe 내부에서 구축한 여러 서비스로 구성됨
- MongoDB Community를 선택한 이유는 문서 모델의 유연성과 대규모 실시간 데이터 처리 능력 때문
- DocDB의 핵심은 Data Movement Platform
- 데이터베이스 인프라 구축 방법
  - Stripe는 2011년 출시 당시 표준 관계형 데이터베이스보다 개발자 생산성이 뛰어난 MongoDB를 온라인 데이터베이스로 선택함
  - MongoDB 위에서 API의 안정성을 우선시하는 견고한 데이터베이스 인프라를 운영하고자 했으나, 요구사항을 충족하는 기성 DBaaS를 찾을 수 없었음
    - MongoDB를 기본 스토리지 엔진으로 사용하여 DocDB를 구축함
    - 진정한 탄력적이고 확장 가능한 DBaaS로, 온라인 데이터 마이그레이션이 핵심
  - 누적 데이터의 작은 청크를 각각 보관하는 수천 개의 데이터베이스 샤드가 이제 Stripe의 모든 제품의 기반이 됨
  - Stripe의 팀은 제품 애플리케이션 수준에서 내부 문서 데이터베이스 컨트롤 플레인을 사용하여 관련된 목적을 가진 문서로 구성된 하나 이상의 DocDB 컬렉션을 포함하는 논리적 데이터베이스라고 하는 데이터의 논리적 컨테이너를 프로비저닝함
  - DocDB의 물리적 데이터베이스는 프라이머리 노드와 복제 및 자동 장애 조치가 포함된 여러 보조 노드로 구성된 복제 세트로 배포된 샤드에 상주함
- Data Movement Platform 설계 방법
  - 1단계: 청크 마이그레이션 등록
  - 2단계: 대량 데이터 가져오기
  - 3단계: 비동기 복제
  - 4단계: 정확성 확인
  - 5단계: 트래픽 전환
  - 6단계: 청크 마이그레이션 등록 취소
- 데이터 이동 플랫폼의 활용
  - DocDB 샤드 간에 온라인 방식으로 데이터 청크를 마이그레이션할 수 있는 기능은 Stripe의 성장 속도에 맞춰 데이터베이스 인프라를 수평적으로 확장하는 데 도움이 됨
  - Stripe의 데이터베이스 인프라 팀은 인터넷 경제의 성장에 맞춰 확장되는 견고하고 신뢰할 수 있는 기반을 구축하는 데 주력하고 있음

## AI Will Become Mathematicians’ ‘Co-Pilot’

- AI 가 수학자들의 '공동 파일럿'이 될 것임
- 수학은 전통적으로 고독한 학문이었음
- 최근에는 수학의 많은 부분이 개별 구성 요소로 엄격하게 분해되어 컴퓨터로 검증 가능해짐
- UCLA의 테렌스 타오는 이러한 방법들이 수학에서 새로운 협력 가능성을 열어준다고 믿음
- 자동 증명 검사기를 통해 수학자들이 수백 명과 협력할 수 있게 됨
- 모든 사람이 프로그래머일 필요는 없고, 수학적 방향에 집중하는 사람과 형식적 증명을 만드는 사람으로 역할을 나눌 수 있음
- 표준 수학 라이브러리의 개발로 형식 수학이 실용적으로 변함
- Lean이라는 프로젝트는 기본적인 수학 정리를 포함한 방대한 라이브러리를 가지고 있음
- AI가 수학자들의 보조 역할을 할 가능성이 있음
- AI가 증명을 형식화하고, 논문을 작성하여 제출하는 등의 작업을 도울 수 있음
- 인간이 아이디어를 제공하고, AI가 이를 형식화하는 방식으로 협력할 수 있음
- AI가 수학의 큰 문제를 해결하는 데 도움을 줄 수 있지만, 인간의 직관과 이해가 여전히 중요함
- AI가 제공하는 증명을 인간이 분석하고 이해하는 새로운 유형의 수학자가 필요할 수 있음
- AI가 수학의 새로운 영역을 탐구하고, 인간이 이해하기 어려운 부분을 도울 수 있음

## Optional Anti-Patterns

- Optional Types in Object Fields
- Collections of Optionals
- Optional as a Method Argument
- Trying to Serialize Optionals

## References

- https://engineering.fb.com/2024/06/12/production-engineering/maintaining-large-scale-ai-capacity-meta/
- https://fs.blog/experts-vs-imitators/
- https://antonz.org/uuidv7/#kotlin
- https://blog.sofiane.cc/ssh_honeypot/
- https://medium.com/codex/how-pinterest-scaled-to-11-million-users-with-only-6-engineers-a0f62cea62b8
- https://stripe.com/blog/how-stripes-document-databases-supported-99.999-uptime-with-zero-downtime-data-migrations
- https://www.scientificamerican.com/article/ai-will-become-mathematicians-co-pilot/
- https://dzone.com/articles/optional-anti-patterns
