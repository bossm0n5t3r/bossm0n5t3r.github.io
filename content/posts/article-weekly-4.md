+++ 
date = 2024-01-28T03:45:00+09:00
title = "Article Weekly, Issue 4"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## 개요

- 이번 주는 유독 많았다. 우열을 가리기 힘들 정도…
- 굳이 하나만 골라야 하는건 아니니, 모두 정리해보겠다.

## Trunk Based Development

- https://trunkbaseddevelopment.com/
- 트렁크 기반 개발(TBD)은 소스 제어 브랜칭 모델로, 개발자들이 '트렁크' 또는 '메인'이라 불리는 단일 브랜치에서 코드에 협업합니다.
- 메인 라인에서의 공유 브랜치 사용을 피하기 위해 공유 브랜치 사용은 권장되지 않습니다. 이는 "병합 지옥"을 피하기 위함입니다.
- TBD는 단기 특징 브랜치, 추상화별 브랜치, 그리고 특징 플래그와 같은 기술을 통해 소규모 및 확장된 팀을 지원합니다.
- 이는 지속적인 통합 및 배포를 가능하게 합니다.
- TBD의 주장에는 장기 브랜치를 사용하는 모델보다 나은 성과를 내며, 팀의 규모를 늘리거나 줄이는 데 도움이 된다는 내용이 포함되어 있습니다.
- 다만 주의해야 할 점으로는 브랜치에서의 코드 리뷰 및 빌드 확인이 필요하며, 트렁크에서 릴리스하는 것이 모든 팀에 적합하지 않을 수 있다는 것이 언급되고 있습니다.

## How I’m (re)learning math as an adult

- https://gmays.com/how-im-relearning-math-as-an-adult/
- 사실 이 내용은 저자가 기계 학습 모델에 대한 이해를 증진 시키기 위해 수학을 다시 공부하고 있다는 내용이다.
- 나도 이걸 보면서 다시 수학을 공부하고 싶다는 생각이 들어서 추가하게 되었다.
  - 이제 슬슬…?

## CAP Twelve Years Later: How the "Rules" Have Changed

- https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/
- 이 기사는 CAP 이론이 처음 소개된 이후 12년 동안 "규칙"이 어떻게 변화했는지에 대해 다룹니다.
- CAP 이론은 어떤 네트워크 기반의 공유 데이터 시스템도 일관성, 가용성, 분할 허용성 중 두 가지만 가질 수 있다고 주장합니다.
- 그러나 이 기사는 분할을 명시적으로 처리함으로써 디자이너가 일관성과 가용성을 최적화할 수 있으며, 결과적으로 세 가지 속성 중 어느 정도의 트레이드 오프를 달성할 수 있다고 주장합니다.
- 기사는 CAP 이론의 개발 과정과 다양한 시스템이 일관성과 가용성을 처리하는 방식에 대한 역사적 맥락을 제공합니다.
- NoSQL 데이터베이스, 최종적 일관성, 그리고 합의 알고리즘과 같은 것들이 응용 프로그램 요구에 따라 다양한 속성을 최적화할 수 있는 더 유연한 구현을 가능케 한 방법에 대해 논의합니다.

## Measuring Developer Productivity: Real-World Examples

- https://newsletter.pragmaticengineer.com/p/measuring-developer-productivity-bae
- 여러 기술 회사에서 개발자의 생산성을 측정하는 방법에 대해 소개한 글이다.
- 자세한 내용은 들어가서 보자. 내용이 알차다.

## Caches: LRU v. random

- https://danluu.com/2choices-eviction/
- 캐시를 지우는 방법에 대해 LRU 와 랜덤으로 적용한 방법에 대해서 비교한 내용이다.
- 작성자는 캐시 대체 정책을 탐구하며 최근 사용된(LRU) 및 2-랜덤 선택을 비교합니다.
- Sandy Bridge와 유사한 캐시에서의 결과는 2-랜덤이 특히 큰 캐시에서 잘 수행된다는 것을 보여줍니다.
- 의사 2-랜덤 및 의사 3-랜덤을 대안으로 소개하며 의사 3-랜덤이 유망한 결과를 보여줍니다.
- 연구는 2-랜덤이 적응형 정책에 비해 비용 효율적인 대안일 수 있다고 제안합니다.
- 2-랜덤 선택의 수학적 근거가 설명되며, 캐시 관리 이외의 다양한 분야에서의 응용을 강조합니다.
- 글은 시뮬레이션에 사용된 도구와 기여자들을 인정하고 감사의 마음을 전합니다.

## Performance Analysis of Python’s dict() and {}

- https://madebyme.today/blog/python-dict-vs-curly-brackets/
- 코드리뷰를 하던 도중 이 둘의 사용에 대한 리뷰를 받게 되었고, 파이썬에서 동일한 기능을 하는 `dict()` 와 `{}` 에 대해 성능을 비교한 아티클이다.
- 이런… 생각을 하지 않았기 때문에 인상 깊었던 아티클이었다.
- 앞으로 당연하다고 생각했던 것도 한 번 더 생각해보는건 어떨까?

## Reading QR codes without a computer!

- https://qr.blinry.org/
- QR Code 를 하나하나 분석하는 페이지다. 재미있어서 ㅊㅊ

## How we built a fair multi-tenant queuing system

- https://www.inngest.com/blog/building-the-inngest-queue-pt-i-fairness-multi-tenancy
- 이 글은 현대 애플리케이션을 위한 안정성 레이어로서의 Inngest에서 공정한 다중 테넌시 큐 시스템을 구축하는 과제에 대해 논의합니다.
- 전통적인 큐는 공정성, 다중 테넌시, 경합, 동시성, 읽기/쓰기 부하, 인프라, 관측성 및 사용자 정의 가능성과 같은 문제에 직면합니다.
- Inngest는 이러한 도전 과제에 대응하기 위해 새로운 큐를 개발했습니다. 이 큐는 공정성, 저지연 및 다중 테넌시에 중점을 두었습니다.
- 큐는 여러 공유되지 않는 워커를 처리하고, 거의 경합이 없는 방식으로 작업을 차지하며, 개별 함수 레벨 큐를 지원합니다.
- 안정성 레이어는 코드에서 선언적 단계 기능을 관리하기 위해 큐를 활용하여 신뢰성, 동시성 제어 및 기타 기능을 보장합니다.
- 시스템은 확장 가능하며, 비용 효과적이며, 모든 사용자에 대한 플로우 제어 기능을 제공합니다.
- 글은 Inngest와 같은 안정성 레이어가 큐 시스템의 복잡성을 추상화하며, 개발자가 큐 메커니즘을 구현하거나 심층적으로 이해할 필요 없이 신뢰성 있는 시스템을 구축할 수 있도록 하는 것을 강조합니다.

## What Are Elliptic Curve Pairings?

- https://www.zellic.io/blog/what-are-elliptic-curve-pairings/
- 타원 곡선 페어링에 대해 수학적으로 설명한 글이다.

## References

- https://trunkbaseddevelopment.com/
- https://gmays.com/how-im-relearning-math-as-an-adult/
- https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/
- https://newsletter.pragmaticengineer.com/p/measuring-developer-productivity-bae
- https://danluu.com/2choices-eviction/
- https://madebyme.today/blog/python-dict-vs-curly-brackets/
- https://qr.blinry.org/
- https://www.inngest.com/blog/building-the-inngest-queue-pt-i-fairness-multi-tenancy
- https://www.zellic.io/blog/what-are-elliptic-curve-pairings/
