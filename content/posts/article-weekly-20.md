+++
date = 2024-05-22T03:00:00+09:00
title = "Article Weekly, Issue 20"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-05-12` ~ `2024-05-18`

## Google Engineering Practices Documentation

- 최근 팀 내에서 코드 리뷰에 대한 얘기가 나오면서, 구글은 어떻게 코드리뷰를 하는지 궁금해서 찾아본 내용이다.
- CL author 와 Code Reviewer 가 가져야 할 지침등을 정리한 내용이라 생각보다 도움이 많이 되었다.

## 내가 StackOverflow에 시간과 전문 지식을 제공한 이유는 CC-BY-SA 라이선스 였기 때문

- Stack Overflow와 OpenAI의 파트너십 체결에 따른 후속 글 중 하나
- 저자는 StackOverflow에 시간과 전문 지식을 제공한 이유는 CC-BY-SA 라이선스 였기 때문
- 하지만 Stack Overflow와 OpenAI의 파트너십에 따라, Stack Overflow의 모든 질문과 답변이 GenerativeAI 모델 훈련에 사용될 예정이고 이는 CC-BY-SA 라이선스 하에서 요구되는 저작자 표시 없이 이루어질 것임
- 저자는 CC-BY-SA 라이선스는 파생 저작물도 동일한 라이선스로 공유되어야 한다고 생각함
- 저자는 저자가 만드는 데 기여한 데이터가 LLM에 묶여 다시 나에게 팔릴 것이기 때문에 삭제했다고 말함
- 이는 `#enshittification`의 또 다른 사례이자, DevRel 담당자들에게 중요한 교훈임
  - 커뮤니티가 경쟁 우위의 원천이라면, 그들을 화나게 하지 말아야 함
  - `#enshittification` = 점진적인 저하
- 사견
  - 필자도 코파일럿, ChatGPT 등에 대해서 동일한 생각을 했음
  - 오픈소스, 커뮤니티는 예전부터 발전되어왔고, 이를 통해 많은 도움을 받고, 도움을 주게 됨
  - 하지만 이 데이터를 가공해서 상업적 이익을 얻는 것은 괜찮은가에 대한 의문은 남아있음
  - 건설적인 피드백, 발전이 앞으로 이어질까에 대한 두려움도 있음
  - 처음 깃허브에서 private repository 를 무제한으로 풀었던 때와 비슷한 느낌을 받음

## GxHash - GxHash는 엄청나게 빠르고 강력한 비암호화 해싱 알고리즘

- Hash 함수에 대해 기본적인 사실만 알고 있었지만, 실제로 Hash 함수에 필요한 조건들, 그리고 최근 유명한 Hash 함수들에 대해 알게 됨

## Visualizing algorithms for rate limiting

- Rate limiting 에 대한 알고리즘들을 시각화한 자료

## Llama 3 implemented in pure NumPy

- Llama 3 를 NumPy 로 순수 구현한 아티클
- 원리를 쉽게 이해할 수 있어서 도움이 많이 됨

## Beyond public key encryption

- 암호학은 계속 발전하고 있지만, 현재 쓰고 있는 공개키는 꽤 오래전에 나온 암호화
- 지난 20년동안 개발된 암호화들에 대해 소개하는 글

## How to fix bugs in 24 hours or less

- DoltHub 에서 어떻게 버그를 24시간 이내에 해결하는지를 소개하고 있다
- 방법은 다음과 같다.
  - 빠르게 식별
  - 우선순위
  - 코드 품질
  - 테스트 품질
  - 배포 자동화

## References

- https://google.github.io/eng-practices/
- https://aus.social/@KathyReid/112413898118066645
  - https://news.hada.io/topic?id=14810
- https://github.com/ogxd/gxhash
- https://smudge.ai/blog/ratelimit-algorithms
- https://docs.likejazz.com/llama3.np/
- https://blog.cryptographyengineering.com/2017/07/02/beyond-public-key-encryption/
- https://www.dolthub.com/blog/2024-05-15-24-hour-bug-fixes/
