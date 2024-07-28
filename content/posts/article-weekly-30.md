+++
date = 2024-07-29T01:07:00+09:00
title = "Article Weekly, Issue 30"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-07-21` ~ `2024-07-27`

## Open Source AI Is the Path Forward

- 시간이 지나면서 오픈 소스 리눅스가 인기를 끌게 되었고, 현재 클라우드 컴퓨팅 및 모바일 운영 시스템의 표준이 됨
- AI도 비슷한 방식으로 발전할 것으로 예상됨
  - 현재 여러 기술 회사가 폐쇄형 모델을 개발하고 있지만, 오픈 소스가 빠르게 따라잡고 있음
  - 작년에 Llama 2는 이전 세대 모델에 비해 뒤처졌으나, 올해 Llama 3는 가장 앞선 모델들과 경쟁할 수 있는 수준에 도달
  - 내년부터는 Llama 모델이 업계에서 가장 앞선 모델이 될 것으로 기대됨
  - Llama는 개방성, 수정 가능성 및 비용 효율성에서 이미 선두를 달리고 있음
- 오픈 소스 AI가 개발자에게 좋은 이유
  - 모델을 직접 훈련하고 미세 조정 및 증류할 수 있음: 각 조직은 고유한 데이터를 사용하여 최적의 모델 크기로 조정 가능
  - 폐쇄형 벤더에 의존하지 않고 독립성 유지: 오픈 소스는 호환 가능한 툴체인 생태계를 제공하여 자유롭게 이동 가능
  - 데이터 보호: 민감한 데이터를 클라우드 API에 보내지 않고 자체 모델에서 처리 가능
  - 비용 효율적: Llama 3.1 405B 모델은 폐쇄형 모델보다 약 50% 저렴하게 추론 가능
  - 장기적인 표준에 투자: 오픈 소스는 폐쇄형 모델보다 빠르게 발전하고 있음
- Meta는 이전 Llama 모델과는 다른 접근 방식을 취하고 있음
- Meta는내부적으로 팀을 구성하여 가능한 한 많은 개발자와 파트너가 Llama를 사용할 수 있도록 지원하고 있음
- Meta는 생태계의 더 많은 기업들이 고객에게 독특한 기능을 제공할 수 있도록 적극적으로 파트너십을 구축하고 있음
- Llama 3.1 릴리스가 대부분의 개발자가 주로 오픈 소스를 사용하기 시작하는 업계의 변곡점이 될 것이라고 믿음

## Einstein’s 7 rules for a better life

- 중요한 일에 힘을 쏟아라
- 사랑하는 일을 하라, 비록 당신이 그것에 서툴더라도
- 퍼즐 같은 사고방식을 가져라
- 진정으로 매혹되는 것에 대해 깊이 오래 열심히 생각하라
- 정치에 의해 분노하거나 절망하지 말라
- 권위에 대한 맹목적 복종은 진리의 가장 큰 적
- 과학, 진리, 교육은 소수 특권층만의 것이 아니다

## COPYING is the way design works

- 복사는 교육적, 도전적, 기만적 또는 혁신적일 수 있음
- 디자인에서 복사는 기본적이며 발전의 중요한 부분을 차지
- 오늘날의 소프트웨어, 하드웨어, 웹사이트 및 앱은 모두 복사에 빚지고 있음

## Introducing Llama 3.1: Our most capable models to date

- 128K 컨텍스트 길이, 8개 언어를 지원하며, 405B 모델을 추가 (8B, 70B, 405B)
  - 누구나 파인튜닝, 정제하고 어디에나 배포할 수 있는 오픈소스 인스트럭션-튠드 AI 모델
- 새로 공개된 405B 모델은 MMLU(일반), Human Eval(코딩), GSM8K(수학) 벤치등에서 GPT-4o와 거의 비슷하거나 나은 수준을 달성
  - 유연성과 제어력에서 최고 수준의 AI 모델
  - 커뮤니티가 합성 데이터 생성 및 모델 증류와 같은 새로운 워크플로우를 활용할 수 있게 해줌
  - 15조 개 이상의 토큰을 사용하여 훈련되었으며, 16000개 이상의 H100 GPU 사용
- 업그레이드 된 70B 모델은 대부분의 벤치에서 GPT-3.5 Turbo를 훨씬 뛰어넘음

## [Project Loom] Virtual Thread에 봄(Spring)은 왔는가

- 카카오페이에서 Project Loom 에 대해 테스트 한 후, 일부 메서드에 선택적으로 적용하기로 함

## I've used (and loved) Rust for ~10 years. Here are the ways it disappoints me.

- Rust를 사용한 지 대략 10년이 되었고, 이 언어를 정말 사랑하지만 몇 가지 실망스러운 점들
  - Result<T, E>의 문제
    - 라이브러리 작성자의 어려움
    - 애플리케이션 코드의 번거로움
  - 모듈 시스템의 유연성
    - 과도한 유연성
    - 고아 규칙의 문제
  - 컴파일 시간과 IDE 도구
    - 긴 컴파일 시간
    - 느린 IDE 응답 속도

## Mistral Large 2

- Mistral Large 2는 128k 컨텍스트 윈도우 및 프랑스어, 독일어, 스페인어, 이탈리아어, 중국어, 일본어, 한국어를 포함한 여러 언어를 지원함
  - 또한 Python, Java, C, C++, JavaScript, Bash를 포함한 80개 이상의 코딩 언어를 지원
- 단일 노드 추론을 위해 설계되었으며, 1230억 개의 파라미터로 구성되어 있어 단일 노드에서 높은 처리량을 제공할 수 있음
- 연구 및 비상업적 용도로 사용 및 수정이 가능한 Mistral Research License 하에 배포됨. 상업적 용도로 사용하려면 Mistral Commercial License를 취득해야 함

## 어떻게 그 판단을 할 수 있었을까?

- 팀원과 일하던 도중 문득 느꼈던 판단에 대해 인지 과정을 분석한 글
- CDM 을 소개하며, 해당 방법을 글에 녹이고 있음
  - https://www.gary-klein.com/cdm?ref=stdy.blog

## Database Design for Google Calendar: a tutorial

- 구글 캘린더라는 복잡한 실제 프로젝트의 데이터베이스 테이블을 설계하는 방법을 소개

## 아키텍처에 대한 고민은 처음이라: 계층형과 육각형 아키텍처 적용 사례

- 당근에서 업무하는 개발자가 본인의 팀의 서비스를 분석 후 육각형 아키텍처를 적용 및 장단점을 분석

## References

- https://about.fb.com/news/2024/07/open-source-ai-is-the-path-forward/
- https://bigthink.com/starts-with-a-bang/einstein-rules-better-life/
- https://matthewstrom.com/writing/copying/
- https://ai.meta.com/blog/meta-llama-3-1/
- https://tech.kakaopay.com/post/ro-spring-virtual-thread/
- https://www.reddit.com/r/rust/comments/1e978l7/ive_used_and_loved_rust_for_10_years_here_are_the/
- https://mistral.ai/news/mistral-large-2407/
- https://www.stdy.blog/debugging-and-critical-decision-method/
  - https://www.gary-klein.com/cdm?ref=stdy.blog
- https://kb.databasedesignbook.com/posts/google-calendar/
- https://medium.com/daangn/아키텍처에-대한-고민은-처음이라-b75dffd73eb0
