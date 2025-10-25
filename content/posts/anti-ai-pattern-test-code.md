+++
date = 2025-10-25T23:00:00+09:00
title = "안티 AI 사용 패턴: 테스트 코드 작성"
authors = ["Ji-Hoon Kim"]
tags = ["AI", "Testing", "TDD"]
categories = ["AI", "Testing", "TDD"]
series = ["AI", "Testing", "TDD"]
+++

## 들어가며

AI 코드 생성 도구의 등장으로 개발 생산성은 눈에 띄게 향상되었다. GitHub Copilot, Cursor, Claude Code 와 같은 도구들은 코드 작성 시간을 극적으로
단축시켜주며, 많은 개발자들이 일상적으로 활용하고 있다.

실제로 최근 조사에 따르면 개발자의 82%가 AI 코딩 도구를 매일 또는 주간 단위로 사용하고 있다[^1]. 그러나 이러한 생산성 향상의 이면에는 중대한 위험이 숨어 있다. 특히
AI를 활용한 테스트 코드 작성 방식은 신중하게 접근해야 할 필요가 있다.

## AI 코드 생성의 근본적인 문제: 자기 참조적 검증

### 잘못된 코드가 잘못된 테스트를 생성한다

AI가 코드를 생성한 후 테스트를 작성하도록 하면 심각한 문제가 발생한다.
AI 도구는 기존 코드를 분석하여 그 코드가 **현재 하는 동작**을 검증하는 테스트를 생성하지,
**원래 의도한 동작**을 검증하는 테스트를 작성하지 않는다[^2].

이는 마치 잘못 작성된 답안지를 보고 그 답안을 정답으로 간주하는 채점 기준을 만드는 것과 같다.

예를 들어, 다음과 같은 잘못된 코드를 AI가 생성했다고 가정해보자:

```kotlin
fun divide(a: Int, b: Int): Int {
    if (b == 0) {
        return 0  // 버그: 예외를 발생시켜야 함
    }
    return a / b
}
```

이후 AI에게 테스트 코드를 작성하도록 요청하면, AI는 이 잘못된 구현을 기반으로 다음과 같은 테스트를 생성할 수 있다:

```kotlin
@Test
fun `0으로 나눌 때 0을 반환한다`() {
    assertEquals(0, divide(10, 0))
}
```

이 테스트는 통과하지만, 실제로는 버그를 정당화하는 역할만 한다[^2]. 테스트가 구현을 검증하는 것이 아니라, 잘못된 구현을 승인하는 문서가 되어버린 것이다.

### AI 생성 코드의 보안 취약점

더욱 심각한 문제는 AI가 생성한 코드에 보안 취약점이 포함될 가능성이 높다는 점이다. 여러 연구에 따르면 AI 생성 코드의 45%가 보안 결함을 포함하고 있으며[^3], 특정
취약점 유형에서는 실패율이 86-88%에 달한다[^3][^4]. 구체적으로 살펴보면:

- **Cross-Site Scripting (XSS)**: 86% 실패율
- **Log Injection**: 88% 실패율
- **SQL Injection**: 20% 실패율
- **암호화 오류**: 14% 실패율

Java의 경우 보안 실패율이 70%를 초과하여 가장 위험한 언어로 나타났다[^4]. 만약 이러한 취약한 코드를 먼저 작성한 후 AI에게 테스트를 생성하도록 하면, 보안 취약점을
검증하는 테스트가 만들어지지 않거나, 오히려 취약한 동작을 "정상"으로 간주하는 테스트가 생성될 수 있다[^5].

### 반복적 개선의 역설

더 놀라운 사실은 AI에게 코드를 반복적으로 개선하도록 요청할수록 보안 취약점이 증가한다는 연구 결과다[^6].

400개의 코드 샘플을 대상으로 한 실험에서 5번의 반복 후 중대한 취약점이 37.6% 증가했다[^6].

이는 피드백 루프가 인간의 검토 없이 진행될 때 보안이 점진적으로 악화됨을 의미한다. AI는 이전 반복의 코드를 "정답"으로 간주하면서, 기존 취약점을 "의도된 동작"으로 인식하고
새로운 코드에도 이를 반영하기 때문이다.

"효율성"에 초점을 둔 프롬프트는 가장 심각한 보안 문제를 야기했고, "기능 추가"에 초점을 둔 프롬프트는 가장 높은 취약점 수를 기록했다[^6]. 심지어 "보안"을 명시적으로
요청한 프롬프트에서도 보안 성능이 크게 개선되지 않았다[^3].

## TDD로 AI를 안전하게 활용하기

### 테스트 주도 개발의 핵심 원칙

테스트 주도 개발(Test-Driven Development, TDD)은 이러한 AI 코드 생성의 문제점을 근본적으로 해결할 수 있는 방법론이다. TDD는 1990년대 후반
Kent Beck에 의해 개발된 방법론으로, **Red-Green-Refactor** 사이클을 따른다[^7]:

1. **Red (실패하는 테스트 작성)**: 구현하고자 하는 기능을 정의하는 테스트를 먼저 작성한다. 이 테스트는 아직 구현이 없으므로 실패해야 한다[^8].
2. **Green (테스트 통과)**: 테스트를 통과하는 최소한의 코드만 작성한다. 과도한 엔지니어링을 피하고 요구사항만 충족시킨다[^8].
3. **Refactor (리팩토링)**: 테스트가 통과하는 상태를 유지하면서 코드를 개선한다. 중복을 제거하고 가독성을 높인다[^8].

TDD의 핵심은 **테스트가 개발을 주도(driven)** 한다는 점이다[^9]. 코드를 먼저 작성하고 테스트를 나중에 추가하는 것은 TDD가 아니다.

### AI와 TDD를 결합하는 올바른 방법

AI 시대에 TDD를 적용하는 가장 효과적인 방법은 다음과 같다:

**1단계: 명확한 요구사항 정의 (주석 작성)**

구현하고자 하는 기능을 메서드 내부에 주석으로 상세히 작성한다. 이는 AI에게 명확한 컨텍스트를 제공하는 동시에, 개발자 자신도 요구사항을 명확히 이해하도록 돕는다[^9]:

```kotlin
/**
 * 두 정수를 나눈다.
 * @param dividend 피제수
 * @param divisor 제수
 * @return 나눗셈 결과
 * @throws ArithmeticException 제수가 0인 경우
 */
fun divide(dividend: Int, divisor: Int): Int {
    // 제수가 0인 경우 ArithmeticException을 발생시킨다
    // 그 외의 경우 정상적으로 나눗셈을 수행한다
}
```

**2단계: 테스트 코드 먼저 작성**

주석을 기반으로 테스트 코드를 작성한다. 이 단계에서는 개발자가 직접 테스트를 작성하거나, AI에게 테스트 스텁(stub)만 생성하도록 요청한다[^9]:

```kotlin
@Test
fun `정상적인 나눗셈을 수행한다`() {
    assertEquals(5, divide(10, 2))
    assertEquals(3, divide(9, 3))
}

@Test
fun `제수가 0인 경우 예외를 발생시킨다`() {
    assertThrows<ArithmeticException> {
        divide(10, 0)
    }
}

@Test
fun `음수 나눗셈을 올바르게 처리한다`() {
    assertEquals(-5, divide(-10, 2))
    assertEquals(-3, divide(9, -3))
}
```

**3단계: AI에게 구현 요청**

이제 테스트를 통과하는 코드를 AI에게 생성하도록 한다. 테스트가 명확한 **목표(target)** 와
**즉각적인 정확성 검증 도구**로 작용하기 때문에, AI는 훨씬 더 정확한 코드를 생성한다[^9]:

```kotlin
fun divide(dividend: Int, divisor: Int): Int {
    if (divisor == 0) {
        throw ArithmeticException("0으로 나눌 수 없습니다")
    }
    return dividend / divisor
}
```

**4단계: 테스트 실행 및 반복**

각 AI 생성 코드 변경마다 테스트를 실행한다[^9]. 이는 AI가 예상치 못한 변경을 도입했을 때 즉시 감지할 수 있게 한다. 테스트가 실패하면 AI에게 피드백을 제공하고 수정을
요청한다.

### TDD와 AI의 시너지 효과

연구에 따르면 TDD 접근 방식을 사용할 때 AI의 효과가 극대화된다. 올바른 코드로 프롬프트했을 때와 잘못된 코드로 프롬프트했을 때를 비교한 연구에서, 올바른 코드는 테스트
정확도 57%, 코드 커버리지 12%, 버그 탐지율 24% 향상을 보였다[^10]. 실제 프로덕션 환경에서는 버그 탐지율이 47% 차이를 보였다[^10].

또한 AI를 테스트 생성에 활용하는 팀은 테스트 스위트에 대한 신뢰도가 34포인트 더 높았다[^1]. 이는 TDD 방식으로 AI를 활용할 때 더 높은 품질의 결과를 얻을 수 있음을
시사한다.

## 실무 적용 가이드

### 역할 분담의 중요성

AI와의 협업에서 명확한 역할 분담이 핵심이다[^9][^11]:

- **개발자의 역할 (Navigator)**: 전체 개발 전략 수립, 아키텍처 결정, 테스트 케이스 정의, AI 생성 코드 검토
- **AI의 역할 (Driver)**: 코드 구현 생성, 리팩토링 제안, 복잡한 알고리즘 설명

테스트는 개발자의 정신적 작업 결과물이어야 한다[^9]. LLM은 몇 초 만에 코드를 생성할 수 있지만, 올바른 증거인 테스트가 있어야만 그 가치가 있다. 테스트가 시스템의 작동
방식을 정의한다면, 코드 리팩토링과 재생성은 빠르고 저렴하다[^9].

### 구체적인 워크플로우

효과적인 AI-TDD 워크플로우는 다음과 같다[^12]:

1. **계획 수립**: AI와 대화하며 요구사항 브레인스토밍, AI에게 계획 초안 작성 요청 후 개발자가 비평 및 수정
2. **인터페이스 정의**: 함수 시그니처와 docstring 작성으로 명확한 계약 정의
3. **테스트 스캐폴드 생성**: AI에게 테스트 스텁 생성 요청 (선택적)
4. **테스트 구현**: 개발자가 직접 또는 AI 도움으로 구체적인 테스트 케이스 작성
5. **코드 생성**: AI에게 테스트를 통과하는 코드 생성 요청
6. **편집-테스트 사이클**: 변경 → 테스트 실행 → 수정 반복

이 과정에서 AI가 혼란스러워하는 순간의 80%를 줄일 수 있다[^13].

### 프롬프팅 전략

AI에게 효과적으로 지시하는 방법도 중요하다[^11]:

**명확한 프롬프트 작성**:

```
"정수 리스트를 입력으로 받아 중복을 제거하고 오름차순으로 정렬된 리스트를 반환하는 Kotlin 함수를 생성하세요."
```

**반복적 피드백 제공**:

```
"이 코드는 동작하지만 성능을 최적화하세요."
"더 나은 라이브러리를 사용하여 다시 작성하세요."
```

**컨텍스트 제공**:
프로젝트 아키텍처, 코딩 표준, 제약사항을 명확히 공유한다[^11].

### 주의사항과 한계

AI-TDD를 실천할 때 주의해야 할 점들이 있다:

**과도한 의존 방지**: AI 생성 코드를 맹목적으로 수용하지 말고, 항상 철저히 검토해야 한다[^11]. 코드 리뷰 프로토콜을 수립하고, 생성된 코드를 배포 전에 완전히
이해해야 한다.

**보안 검증**: AI 생성 코드는 반드시 보안 전문가나 자동화된 보안 검사를 거쳐야 한다[^5]. SonarQube, Snyk과 같은 정적 분석 도구를 활용하여 취약점을 사전에
탐지한다[^14].

**적절한 범위**: TDD는 모든 영역에 적용하기 어려울 수 있다[^15]. 반복적이고 명확한 요구사항을 가진 작업에 우선 적용하고, 점진적으로 확대한다.

## 결론: 안전하고 효율적인 AI 활용

AI 코드 생성 도구는 개발 생산성을 크게 향상시킬 수 있지만, 잘못 사용하면 오히려 기술 부채와 보안 취약점을 증가시킨다. 특히 서비스 로직을 먼저 작성한 후 테스트 코드를
생성하는 방식은 "잘못된 코드를 검증하는 잘못된 테스트"라는 악순환을 만들어낸다[^2].

TDD 방법론을 적용하여 **테스트 먼저, 구현은 나중에** 접근하면 이러한 위험을 크게 줄일 수 있다. 주석으로 요구사항을 명확히 하고, 개발자가 직접 테스트를 작성한 후,
AI에게 구현을 맡기는 방식은 AI의 강점을 최대한 활용하면서도 품질과 보안을 보장한다[^9].

연구 결과들은 이러한 접근 방식의 효과를 뒷받침한다. TDD를 적용한 팀은 더 높은 코드 품질, 더 나은 테스트 신뢰도, 그리고 더 적은 버그를 경험했다[^1] [^10].
IBM과 Microsoft는 TDD를 통해 출시 전 결함을 최대 90% 줄였다고 보고했다[^16].

AI는 강력한 도구이지만, 여전히 도구일 뿐이다. 개발자가 아키텍처를 설계하고, 테스트를 통해 방향을 제시하며, AI가 생성한 코드를 검증하는 **인간 주도의 협업**이 성공의
핵심이다[^9][^6]. TDD는 단순한 테스트 방법론을 넘어, AI 시대에 소프트웨어 품질을 보장하는 필수 전략이 되었다.

## References

- Augmented Coding: Beyond the
  Vibes (https://tidyfirst.substack.com/p/augmented-coding-beyond-the-vibes)

---

[^1]: State of AI code quality in 2025 https://www.qodo.ai/reports/state-of-ai-code-quality/
[^2]: AI-Generated Tests are Lying to
You https://davidadamojr.com/ai-generated-tests-are-lying-to-you/
[^3]: AI-Generated Code: A Double-Edged Sword for
Developers https://www.veracode.com/blog/ai-generated-code-security-risks/
[^4]: Study reveals flaws and risks of AI-generated
code https://futurecio.tech/study-reveals-flaws-and-risks-of-ai-generated-code/
[^5]: AI-Generated Code Quality: How to Fix Issues &
Secure ... https://www.cisin.com/coffee-break/ai-generated-code-quality-issues-and-how-to-fix.html
[^6]: Security Degradation in Iterative AI Code Generation https://arxiv.org/html/2506.11022v1
[^7]: Test-driven development https://en.wikipedia.org/wiki/Test-driven_development
[^8]: What is Red-Green-Refactor https://www.qodo.ai/glossary/red-green-refactor/
[^9]: How to Handle TDD with AI https://testrigor.com/blog/how-to-handle-tdd-with-ai/
[^10]: Measuring the Influence of Incorrect Code on Test ... https://arxiv.org/abs/2409.09464
[^11]: Pair Programming with AI Coding Agents: Is It
Beneficial? https://zencoder.ai/blog/best-practices-for-pair-programming-with-ai-coding-agents
[^12]: Rethinking TDD: Modern AI Workflow for Better
Software https://michalzalecki.com/rethinking-ttd-ai-workflow/
[^13]: After 6 months of daily AI pair programming, here's
what ... https://www.reddit.com/r/ClaudeAI/comments/1l1uea1/after_6_months_of_daily_ai_pair_programming_heres/
[^14]: The risks of generative AI coding in software
development https://blog.secureflag.com/2024/10/16/the-risks-of-generative-ai-coding-in-software-development/
[^15]: 테스트 주도 개발(TDD)의 이해와 실천 https://f-lab.kr/insight/understanding-and-practicing-tdd
[^16]: Test-Driven Development (TDD) Guide 2025 | AI
Best ... https://www.nopaccelerate.com/test-driven-development-guide-2025/
