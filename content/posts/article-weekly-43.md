+++
date = 2024-11-02T23:57:00+09:00
title = "Article Weekly, Issue 43"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-10-20` ~ `2024-10-26`

## Everything I built with Claude Artifacts this week

- 저자는 일주일 만에 14개의 프로젝트를 제작할 정도로 아티팩트를 대량 활용 중
- 6월 20일 출시 이후로 계속 사용해왔으며, 현재는 하루에 여러 번 새로운 인터랙티브 아티팩트 제작
- Claude Artifacts는 호기심을 충족시키고, 빠른 프로토타이핑 및 문제 해결을 위한 도구로 유용함
- 대부분의 도구는 5분 이내에 제작 가능
- 좀 더 복잡한 OpenAI Audio 도구도 첫 번째 버전에 12분, 두 번째 반복에 9분 등 총 21분밖에 걸리지 않음
- 그러나 API 호출, 폼 제출, 외부 페이지 링크 등의 기능이 제한적어서 한계에 실망
- 배운 내용을 바탕으로 자체적인 아티팩트 대안 제작을 계획중
- 결론적으로 **아티팩트 사용을 권장함**
  - 아티팩트를 사용하지 않는다면 이 글을 통해 그 이유를 알 수 있기를 바람
  - 나에게 아티팩트는 현재 가장 좋아하는 LLM 기반 도구 중 하나

## Mersenne Prime Number discovery - 2^136279841 - 1 is Prime!

- 발견된 수는 2^136279841 - 1 로 메르센 소수임.
- 41,024,320 자릿수의 수임.
- 이전의 가장 큰 소수인 2^82589933 - 1와의 차이가 천육백만 이상.
- Probable Prime Test를 사용하여 발견한 첫 번째 소수임.

## Learning to learn

- 가장 좋아했었던 질문은 Peter Thiel 스타일: "당신이 배운 것 중에서 다른 사람들은 잘 모르는, 당신에게만 엣지를 주는 것은 무엇인가요?"
- 가장 인상 깊었던 답변 중 하나는 "새로운 것을 시작할 때 가장 중요한 것은 무엇을 배워야 할지 아는 것"
- 최적의 학습 흐름을 설명하며, 다음과 같은 단계로 구성됨:
  - 기초 지식(Foundational Knowledge)이 무엇인지 신속하게 파악
  - 전문가가 되기 위한 개인화된 커리큘럼을 구축하고 '전문가 초보자(Expert Beginner)'가 되는 함정 회피
    - https://daedtech.com/how-developers-stop-learning-rise-of-the-expert-beginner/
    - 기술 수준이 빠르게 상승하며 자신을 전문가로 오인하는 현상으로 더 이상의 발전이 필요 없다고 판단하여 학습을 중단함. 제한된 경험을 반복하면서 진정한 성장을 이루지 못함
  - 초기 기억 형성을 위해 처음 15-20시간은 집중적으로 학습한 후, 더 규칙적인 속도(pace)로 속도를 줄임
- 1번과 2번은 일반적인 구조화된 학습 접근법인 반면, 3번은 '간격 반복 학습(Spaced repetition)'에 대한 새로운 해석임
  - 심리학적 간격 효과를 활용하기 위하여 과거에 학습한 자료의 복습 간격을 늘리는 학습 기법
- 대부분의 사람들이 수십 년간 학습에 대한 사고방식을 업데이트하지 않았다는 점이 놀라운 발견임
  - (잠시 멈추고 마지막으로 자신의 학습에 대한 멘탈 모델을 업데이트한 것이 언제였는지 생각해 보세요.)
- **학습법 자체를 배우는 것이 매우 높은 레버리지**를 가짐
- 25% 효율로 40시간 학습하는 것은 80% 효율로 12.5시간 학습하는 것과 동일함
- **생산적으로 정직**해지는 것이 자신을 위해 할 수 있는 **가장 효과적이고 친절한 일** 중 하나임

## Announcing Toasty, an async ORM for Rust

- Toasty 소개
  - Rust 프로그래밍 언어를 위한 비동기 ORM
  - 사용 용이성 우선
  - SQL 및 NoSQL 데이터베이스 지원 (DynamoDB 및 Cassandra 지원 예정)
- 개발 단계
  - 현재 초기 개발 단계이며 “미리보기” 상태
  - crates.io에 미배포
  - GitHub 레포지토리 공개, 공개 개발 중
- 사용 방법
  - 애플리케이션 데이터 모델 정의를 위한 스키마 파일 생성
  - Toasty CLI 도구를 이용해 필요한 Rust 코드 자동 생성
- ORM의 필요성
  - Rust는 시스템 레벨 프로그래밍 언어로 인식되지만, 웹 애플리케이션 등 고급 용도로 점점 더 많은 팀들이 채택
  - 생산성을 최대화하기 위해 성능이 덜 중요한 경우 Rust 선택 증가
- 사용 용이성 설계
  - 라이프타임과 트레이트 사용을 최소화하여 사용 편리함 증대
  - 절차적 매크로 비사용, 대신 읽기 쉬운 코드 생성
- SQL 및 NoSQL 지원
  - Sqlite 및 DynamoDB 지원, Cassandra는 곧 지원 예정
  - ORM이 데이터베이스를 추상화하지 않음 (SQL과 NoSQL 간의 차이를 이해해야 함)
- 다음 단계
  - 사용자를 위한 실험 단계 진행
  - 2025년 중반까지 실제 사용 준비 목표
  - 사용자 피드백과 개선 사항 수렴 계획
  - 공식적인 논의는 Tokio Discord의 #toasty 채널에서 가능

## Generative AI Scripting

- "Prompting is Coding" : JavaScript를 사용하여 LLM에 대한 프롬프트를 프로그래밍 방식으로 작성하는 스크립팅 언어 및 환경
  - `$`Analyze ${env.files} and report errors. Use gitmojis.`
- 간소한 JS/TS 문장으로 LLM 기반 스크립트를 생성, 디버그 및 자동화할 수 있음
- JavaScript의 유연성과 내장된 출력 구문 분석의 편리함을 결합하여 LLM 기반 소프트웨어 솔루션의 생성을 간소화
- VS Code 확장으로 편집/디버그/실행/테스트 가능. CLI도 제공
- Features
  - Javascript 함수를 LLM tools로 등록 가능
  - tools와 inline prompt를 결합하여 agent 만들기
  - .mjs 형식의 스크립트로 재사용 및 공유, 버전관리 가능
  - Data schema로 데이터를 정의/유효성 검사/복구 가능
  - PDF, DOCX, CSV, XLSX 등의 파일에서 읽기 지원
  - LLM 출력에서 파일을 생성
  - 파일에 대한 Grep / 퍼지 검색
  - Playwright로 브라우저 자동화
  - RAG 기본 내장(벡터 검색)
  - GitHub Models / GitHub Copilot 으로 모델 실행
  - Phi-3/Ollama,LocalAI 등의 오픈소스 모델들을 로컬에서 실행
  - Code Interpreter로 LLM이 코드를 샌드박스 환경에서 실행
  - Docker Container 안에서 코드 실행
  - LLM을 이용하여 LLM 프롬프트 생성
  - Prompty 파일을 실행 또는 변환
  - CLI 로 자동화 가능하여 CI/CD 환경에 연동 가능
  - PR 리뷰에 끼어넣어서 자동화된 PR 체크 가능
  - promptfoo 로 Test 및 Eval 지원

## References

- https://simonwillison.net/2024/Oct/21/claude-artifacts/
- https://www.mersenne.org/primes/?press=M136279841
- https://kevin.the.li/posts/learning-to-learn/
  - https://daedtech.com/how-developers-stop-learning-rise-of-the-expert-beginner/
- https://tokio.rs/blog/2024-10-23-announcing-toasty
- https://microsoft.github.io/genaiscript/
