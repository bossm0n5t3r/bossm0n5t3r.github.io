+++ 
date = 2024-05-01T09:55:00+09:00
title = "Article Weekly, Issue 17"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-04-21` ~ `2024-04-27`

## Valkey is Rapidly Overtaking Redis

- 최근 Redis 가 [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) 라이센스를 버리고 Source 를 사용할 수 있는 라이센스로 변경했음
- 이에 따라 기존 프로젝트에서 fork 한 프로젝트들이 여러 개 나왔고 그 중 하나가 https://github.com/valkey-io/valkey 임
- 다행히 대부분의 서비스가 https://github.com/valkey-io/valkey 를 지원하게 되었고, https://github.com/valkey-io/valkey 포크의 유지관리자는 이러한 비즈니스 요구 사항을 충족하는 데 필요한 기술적 역량을 갖추고 있음
- 현재 많은 사람들이 Redis 를 떠나 https://github.com/valkey-io/valkey 를 사용하는 것으로 보임

## No Abstractions: an Increase API design principle

- API 리소스 네이밍과 모델링 결정은 API 설계에서 가장 어렵고 중요한 부분임
- 리소스는 사용자의 제품 작동 방식과 기능에 대한 멘탈 모델을 구성함
- Increase 팀은 "추상화 없음" 원칙을 사용하여 API 설계를 지원함
- Increase 팀의 대부분은 Stripe 에서 왔고, 복잡한 도메인의 핵심 기능을 사용자가 쉽게 이해하고 사용할 수 있는 API 추상화로 추출하는 데 탁월함
  - https://stripe.com/blog/payment-api-design
  - https://docs.stripe.com/api/payment_intents
- 왜냐하면 Stripe의 사용자 대부분은 결제와 무관한 제품을 개발하는 초기 스타트업으로, 신용카드의 세부 사항을 알 필요가 없음
  - 이들은 Stripe를 빠르게 통합하고 제품 개발에 집중하기를 원함
- 하지만 Increase 사용자는 다름
  - Increase 사용자에게 이러한 네트워크의 근본적인 복잡성을 숨기려는 노력은 삶을 단순화하지 않고 짜증나게 할 것
  - Increase 사용자는 결제 네트워크에 대한 깊은 지식이 있으며, Increase를 선택한 이유가 직접적인 네트워크 연결과 통합 깊이 때문
  - 그들은 정확한 정보를 얻기를 원함
  - 초기 사용자와의 대화를 통해 "추상화 없음" 원칙을 도출하고 API 설계에 적용함
- 따라서
  - API 리소스와 속성에 자체 이름을 만드는 대신 기본 네트워크의 어휘를 사용함
  - 실제 이벤트를 모델로 사용하여 더 많은 API 리소스가 불변하도록 함
  - 불변 리소스 클러스터를 상태 머신 "수명 주기 객체"로 그룹화하는 것이 효과적임
  - 리소스 인스턴스에 따라 사용자가 취할 수 있는 작업 집합이 크게 다른 경우 여러 리소스로 분할함
- 중요한 것은 Increase 엔지니어링 팀이 이러한 접근 방식을 고수해 왔다는 것
- 추상화 없음이 모든 API에 적합한 것은 아니지만 이를 통합하는 개발자에게 적합한 추상화 수준을 고려하는 것은 귀중한 연습임
- 복잡한 API를 몇 년 동안 설계할 때 작은 증분 결정을 항상 내려야 하는데, 사전에 기본 원칙을 준수하기로 약속하면 이러한 결정에 대한 인지 부하가 줄어듦
- https://increase.com/documentation/api#api-reference

## A look at the early impact of Meta Llama 3

- Llama3 가 출시된지 일주일이 됨 (2024-04-18, https://ai.meta.com/blog/meta-llama-3/)
- 커뮤니티 반응이 매우 뜨거움
- 모델이 120만회 이상 다운로드되었고, Hugging Face에서 개발자들이 600개 이상의 파생 모델을 공유했음
- Llama 3 GitHub 레포지토리(https://github.com/meta-llama/llama3)가 17,000개 이상의 별을 받았음
- 산업, 연구쪽에서도 많이 활용하기 시작함
- 앞으로 몇 달에 걸쳐 다중 모드, 다국어 대화 기능, 더 길어진 컨텍스트 창, 향상된 전체 기능을 포함한 새로운 기능을 갖춘 모델을 출시할 것

## You Are What You Read, Even If You Don’t Always Remember It

- Dave Rupert의 말에 따르면, "책을 읽는 목표는 마지막 페이지에 도달하는 것이 아니라 자신의 사고를 확장하는 것"
- 블로그 포스트도 마찬가지로, 읽은 것을 항상 기억하지는 못하더라도 자신을 만드는 데 기여함
- 콘텐츠 다이어트에 주의를 기울일 필요가 있음
- 읽는 것이 자신을 만든다는 것을 상기시켜 줌

## References

- https://devops.com/valkey-is-rapidly-overtaking-redis/
- https://increase.com/articles/no-abstractions
- https://ai.meta.com/blog/meta-llama-3-update/
- https://blog.jim-nielsen.com/2024/you-are-what-you-read/
