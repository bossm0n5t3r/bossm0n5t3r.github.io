+++
date = 2024-07-07T20:00:00+09:00
title = "Article Weekly, Issue 27"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-06-30` ~ `2024-07-06`

## XAES-256-GCM

- XAES-256-GCM은 256비트 키와 192비트 논스를 사용하는 인증된 암호화 알고리즘(AEAD)임
- 설계 목표
  - 큰 논스를 사용하여 무제한 메시지에 대해 안전하게 무작위로 생성 가능
  - FIPS 140 준수를 통해 다양한 환경에서 사용 가능
  - 간단한 구현을 통해 사용자 부담을 줄임
- 작동 원리
  - AES-256-GCM을 기반으로 확장된 논스 구조 사용
  - 입력 키와 논스를 사용하여 파생 키를 계산
  - 세 번의 AES-256 호출로 메시지 처리

## The Great Database Migration

- Shepherd 의 가격 엔진 데이터베이스를 다운 타임 없이 마이그레이션함
- SQLite에서 Postgres로 전환하고 ETL 프로세스를 원클릭 솔루션으로 간소화함
- 마이그레이션시 고려한 질문
  - 애플리케이션과 데이터베이스의 분리
  - 서버리스 데이터베이스 구조
  - SQL 호환성
  - 성능
  - 개발자 경험
  - 데이터 투명성
- 단계
  1. 올바른 데이터베이스 선택
  2. 코드 변경
  3. 배포 변경
  4. 개발자 경험

## Code Reviews Do Find Bugs

- Microsoft 에서 2015년에 Code Reviews Do Not Find Bugs 라는 제목의 연구 결과를 냄
  - https://www.microsoft.com/en-us/research/wp-content/uploads/2015/05/PID3556473.pdf
- 하지만 실제로는 많은 도움이 된다고 저자는 생각함
- 저자는 Microsoft 의 연구결과의 주요 포인트에 대한 자신의 생각을 나타내고 있음

## State of the Cloud 2024

- AI 파운데이션 모델이 Big Tech의 새로운 전쟁의 무대를 마련함
  - 2023년에 관찰한 주요 트렌드:
    - **베이스 모델이 빠르게 개선되고 있음**
      - 모델 개선의 현기증 나는 속도는 **수개월 단위로 반감기를 가지는 모델**에 대한 투자 전략에 대해 의문을 제기하게 함
    - **개방형과 폐쇄형 소스 간의 전투 격화**
      - Llama 3의 최근 출시와 함께 오픈 소스 리더들이 폐쇄 소스 모델 성능을 거의 따라잡게 되면서 오픈 소스 대 폐쇄 소스 논쟁은 2024년에도 뜨거운 주제로 남아 있음
      - 규제 영향으로 폐쇄형 소스 플레이어가 새로운 상용화 전략의 일부로 이전 모델을 공개해야 하는지 여부 또는 오픈 소스 리더가 역사상 처음으로 이 시장의 승자가 될 수 있는지에 대한 새로운 질문이 제기
    - **Small Model movement 가 점점 커짐**
      - HuggingFace의 CEO이자 공동 창업자인 Clem Delangue는 2024년이 SLM의 해가 될 것이라고 선언
      - 올해 출시된 Mistral 8x22b와 같은 예는 더 큰 모델이 성능 면에서 항상 더 좋지는 않으며 작은 모델이 비용과 지연 시간 면에서 상당한 이점을 가질 수 있음을 보여줌
    - **새로운 아키텍처와 특수 목적 기반 모델의 등장**
      - 트랜스포머를 넘어서는 새로운 모델 아키텍처의 등장에 대한 흥분
      - 예를 들어 상태 공간 모델과 기하학적 심층 학습은 덜 계산 집약적이고 더 긴 맥락을 처리할 수 있거나 구조화된 추론을 보여줄 수 있는 기반 모델의 프론티어를 밀어붙이고 있음
      - 또한 코드 생성, 생물학, 비디오, 이미지, 음성, 로보틱스, 음악, 물리학, 뇌파 등을 위한 특정 목적 모델을 훈련하는 팀도 폭발적으로 증가
      - 이는 모델 계층에 또 다른 다양성 벡터를 추가함
- AI가 우리 모두를 10배의 개발자로 만들고 있음
  - 요즘 엔지니어는 항상 빌더이자 학생으로, 본업을 하면서도 새로운 언어, 프레임워크, 인프라 등을 지속적으로 배워야 함
  - AI의 등장으로 개발자는 데이터 관리, 큐레이션, 프롬프트, 사전 학습 및 파인 튜닝을 위한 새로운 인프라 제품군을 포함하여 끊임없이 진화하는 LLM을 활용하기 위한 완전히 새로운 툴체인과 모범 사례를 익혀야 하게 됨
  - AI 시대에는 매년 10년 치의 새로운 개발자 지식을 빠르게 습득해야함
  - 그러나 AI는 이러한 복잡성에 대한 해결책도 제공할 수 있음
    - 2023년에는 코드 코파일럿이 널리 채택되었고,
    - 2024년 초에는 단순 코드 작업의 엔드투엔드 자동화 가능성을 시사하는 에이전트 도구의 초기 버전들이 나타남
  - **예측:**
    - AI에 의해 개발자의 역할은 다른 어떤 직업보다 급격히 변화할 것임
    - 10년 후에는 **컴퓨터를 가진 모든 사람이 상당한 개발 능력을 갖추게 될 것**이며, 이로 인해 **소프트웨어 개발 속도가 급격히 빨라지고** **기술 스타트업 창업자의 평균 연령이 크게 낮아질 것**임
  - **코드 리팩토링**은 개발자 워크플로와 에코시스템에서 AI의 영향을 보여주는 또 다른 훌륭한 예임
  - AI는 이러한 과제를 해결할 수 있는 분명한 잠재력을 가지고 있음
    - Gitar, Grit, ModelCode 등의 스타트업은 코드 생성 모델, 정적 분석, AST 파서를 활용하여 코드 구조를 해석하고 언어, 패키지 라이브러리, 프레임워크 간에 코드를 마이그레이션함
    - 이러한 노력 중 일부는 최신 웹 프레임워크에 초점을 맞추고 있는 반면, 다른 일부는 시간이 지남에 따라 숙련된 엔지니어가 구식이 되고 있는 취약한 레거시 엔지니어링 스택(예: COBALT, PEARL 등)에서 작동함
    - 핵심 소프트웨어 엔지니어링 기능에 인접한 많은 워크플로우도 시간이 많이 소요되고 반복적이며 자동화에 적합함
  - **예측:**
    - 2030년까지 기업 소프트웨어 개발자의 대다수는 소프트웨어 리뷰어 비슷한 역할을 하게 될 것임
    - 개발 비용이 떨어지고 경험 있는 개발자의 생산성이 높아짐에 따라 급여가 인상될 것임
  - AI는 모든 직업 시장의 범위와 필요한 기술에 영향을 미칠 것이지만, 아마도 개발자만큼 큰 영향을 미치지는 않을 것임
  - AI 개선은 이 직업의 생산성을 크게 향상시킬 뿐만 아니라 개발자 세계의 경계를 확장할 것임
  - **10년 후에는 개발 능력이 전 세계 대다수 인구에게 접근 가능한 기술이 될 것임**

## 시간은 금이다: LLM을 이용한 AI 코드 리뷰 도입기

- AI 코드 리뷰를 시스템적으로 도입하면서 얻은 경험을 공유

## GraphRAG: New tool for complex data discovery now on GitHub

- 주요 기능
  - 대규모 언어 모델(LLM)을 사용하여 텍스트 문서 모음에서 풍부한 지식 그래프를 자동으로 추출함
  - 이 그래프 기반 데이터 인덱스는 사용자 쿼리 이전에 데이터의 의미 구조를 보고할 수 있음
  - 고밀도로 연결된 노드의 "커뮤니티"를 계층적 방식으로 감지하여 고수준 주제에서 저수준 주제에 이르기까지 그래프를 여러 수준으로 분할
  - LLM을 사용하여 이러한 각 커뮤니티를 요약하면 데이터셋의 계층적 요약이 생성되어 어떤 질문을 해야할 지 미리 알 필요 없이 데이터셋을 이해할 수 있음
  - 각 커뮤니티는 해당 엔티티와 관계를 설명하는 커뮤니티 요약의 기초 역할을 함
- 평가 및 결과
  - 이 접근 방식을 naive RAG 및 계층적 소스 텍스트 요약과 비교하기 위해 LLM GPT-4를 사용하여 다양한 activity-centered sense-making 질문을 생성함
  - 생성된 답변에 대해 3가지 평가 지표를 선택함: comprehensiveness(모든 측면을 상세히 다룸), diversity(다양한 관점 제공), empowerment(정보에 입각한 의사 결정 지원)
  - GraphRAG는 naive RAG보다 comprehensiveness와 diversity 측면에서 우수한 성능을 보임(~70-80% 승률)
  - 또한 GraphRAG는 중간 수준 및 낮은 수준의 커뮤니티 요약을 사용할 때 이러한 측면에서 소스 텍스트 요약보다 낮은 토큰 비용으로 더 나은 성능을 보임(쿼리당 ~20-70% 토큰 사용)
  - 가장 높은 수준의 커뮤니티의 경우 계층적 소스 텍스트 요약과 경쟁력 있는 성능을 보였으며 토큰 비용이 훨씬 낮음(쿼리당 ~2-3% 토큰 사용)

## What I’ve learned about Open Source community over 30 years

- **오픈 소스 커뮤니티의 교훈**
  - 단순한 코드 그 이상임
    - 오픈 소스 프로젝트는 커뮤니티에 기반을 두어야 함
    - 즉, 의사소통에 개방적이어야 함
  - 사람들의 참여 유지
    - 참여는 사람들을 인식하는 다른 방법을 찾는 것
  - 웹사이트 유지관리
    - 모든 오픈 소스 프로젝트에는 웹사이트가 필요
    - 독립형 웹사이트가 이상적이지만 Readme 파일이 있는 GitHub 저장소로도 충분
    - 매년 업데이트하며 유지 관리 필요
  - 좋은 소식을 공유
    - 다양한 주제에 대해서 아티클 작성 및 공유
  - 열린 의사소통 경로를 유지
    - 프로젝트 개발에 관한 모든 토론은 공식 토론 채널에서 유지하도록 노력
  - 존중을 유지
    - code of conduct 등 ground rules 가 필요
  - 단순한 코드이기도 함
    - 프로젝트가 오픈소스 라이센스를 충족하는 지 확인

## With Fifth Busy Beaver, Researchers Approach Computation’s Limits

- Busy Beaver Problem 이라는 문제에 대해, 다섯 번째 바쁜 비버를 어떻게 찾았는지 설명
- 관련된 컴퓨팅 기술에 대해 소개

## Beating NumPy's matrix multiplication in 150 lines of C code

- NumPy 의 matrix 곱을 150 라인 가량의 C 코드로 어떻게 이겼는지 설명
- 관련된 로직 분석 및 설명

## Building a data compression utility in Haskell using Huffman codes

- 허프만 코드를 사용해서 데이터 압축 유틸리티를 어떻게 만들었는지 설명
- 이를 통해 함수형 프로그래밍이 왜 중요한 지 소개

## The sad state of property-based testing libraries

- PBT 라이브러리의 역사 및 현재 상황을 소개
- 저자는 이 글을 통해 관심을 불러일으키고 관심을 가지면 충분하다고 생각함

## Reverse Engineering the Verification QR Code on my Diploma

- 졸업장에 있던 QR 코드를 보고 리버스 엔지니어링하면서 분석한 글

## References

- https://words.filippo.io/dispatches/xaes-256-gcm/
- https://shepherdinsurance.com/blog/the-great-database-migration
- https://two-wrongs.com/code-reviews-do-find-bugs.html
  - https://www.microsoft.com/en-us/research/wp-content/uploads/2015/05/PID3556473.pdf
- https://www.bvp.com/atlas/state-of-the-cloud-2024
- https://d2.naver.com/helloworld/7321313
- https://www.microsoft.com/en-us/research/blog/graphrag-new-tool-for-complex-data-discovery-now-on-github/
- https://opensource.net/lessons-learned-open-source-30-years-freedos/
- https://www.quantamagazine.org/amateur-mathematicians-find-fifth-busy-beaver-turing-machine-20240702/
- https://salykova.github.io/matmul-cpu
- https://lazamar.github.io/haskell-data-compression-with-huffman-codes/
- https://stevana.github.io/the_sad_state_of_property-based_testing_libraries.html
- https://obrhubr.org/reverse-engineering-diploma
