+++
date = 2024-06-30T23:44:00+09:00
title = "Article Weekly, Issue 26"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-06-23` ~ `2024-06-29`

## A Three-Step Framework For Solving Problems 👌

- 에어비앤비에 입사해 배운 점 중 하나는 무엇보다도 문제 정의를 올바르게 하는 것이 중요하다는 것
- 프로젝트를 실패로 이끄는 많은 요인이 있지만 **해결 중인 문제를 오해하는 것**보다 더 확실한 건 없음
- 문제를 해결하는 가장 중요한 단계는 문제 정의를 완성하는 것
- 문제 정의를 위해선 세 가지 간단한 단계만 거치면 됨
  - 1단계: 해결하려는 문제 구체화
  - 2단계: 팀 및 이해관계자와 문제 조율
  - 3단계: 다시 문제로 돌아오기
- 이 프레임워크는 새로운 제품이나 새로운 기능을 염두에 두고 프로젝트를 구상할 때 가장 효과적이며, 엔지니어링 전에 수행해야 함
- **Step 1: Crystallize the problem you are solving**
  - _Description: What is it?_
  - _Problem: What problem is this solving?_
  - _Why: How do we know this is a real problem and worth solving?_
  - _Success: How do we know if we’ve solved this problem?_
  - _Audience: Who are we building for?_
  - _What: What does this look like in the product?_
- **Step 2: Align on the problem with your team and stakeholders**
  1. 1 단계를 수행합니다.
  2. 이 프로젝트에 참여할 전체 팀과 초안을 공유하고 피드백을 요청하세요. 이후 피드백을 통합하고 다시 공유합니다.
  3. 피드백이 모아지고 의견이 일치한다면 넘어가세요. 그러나 그렇지 않다면 모든 사람을 한데 모아 의견 불일치를 직접 논의해야 합니다.
  4. 팀이 조율되면 이해관계자와 공유하세요. 디자인이나 엔지니어링 단계에 너무 깊게 들어가기 전에 팀 그리고 프로젝트의 성공 유무를 판단하는 사람들과 해결하려는 문제를 조율해야 합니다.
  5. 대면으로 문제 정의를 다시 검토하고, 질문을 받고, 팀이 해당 업무를 수행하는 데 필요한 것들을 갖추고 있는지 확인하세요.
- **Step 3: Keep coming back to the problem**
  - 제품 개발에서 생기는 고전적인 함정은 ‘시작은 원활하지만 가장 중요한 순간, 즉 작업이 실제로 수행될 땐 해결하고자 하는 문제를 고수하지 않는 경우가 많다.’는 것
  - **여러 가지 방법으로 많은 문제를 해결할 수 있지만, 오히려 어떤 문제도 해결하지 못하는 멋지기만 한 제품을 만들 수도 있음**
  - 이런 함정을 피하기 위한 몇 가지 좋은 습관들
    1. 디자인 리뷰는 디자이너가 문제 정의를 검토하는 것에서부터 시작하세요. 만약 그게 명확하지 않다면 "우리가 어떤 문제를 해결하려고 하지?"라고 질문하기
    2. 이해관계자에게 진행 상황을 업데이트할 때마다 문제 정의를 검토하여 모든 사람이 결과에 동의하고 있는지 확인하기
    3. 디자인을 마무리하기 전에 스스로에게 물어보세요 "이것이 우리가 해결하고자 하는 문제를 해결할 수 있을 것이라고 확신하는가?”

## 1-click Exploit in South Korea's biggest mobile chat app

- 카카오톡 `10.4.3` 버전에서 원격 공격자가 WebView에서 임의의 JavaScript를 실행해 HTTP 요청 헤더에 액세스 토큰을 유출할 수 있는 딥 링크 검증 문제가 있음
- 이 토큰을 사용해 다른 사용자의 계정을 탈취하고 공격자가 제어하는 장치에 등록해 채팅 메시지를 읽을 수 있음
- 이 버그는 CVE-2023-51219로 할당됨

## assert vs Validate.isTrue

- **assert**
  - **목적**: 메서드가 호출될 수 있는 조건과 호출 후 보장되는 조건을 문서화하기 위해 사용됨
  - **기능**: 실행 시 조건이 만족되지 않으면 AssertionError 예외를 던짐
  - **사용 사례**: 사전 조건, 사후 조건, 클래스 불변 조건을 정의하는 데 사용됨. 조건이 만족되지 않으면 시스템의 설계나 구현에 문제가 있음을 나타냄.
- **Validate.isTrue (org.apache.commons.lang.Validate)**
  - **목적**: 조건을 확인하고 조건이 만족되지 않으면 IllegalArgumentException 예외를 던짐
  - **기능**: 잘못된 입력에 대해 관대하게 처리하며, 잘못된 입력이 있을 경우 IllegalArgumentException을 던짐
  - **제한 사항**: postconditions나 invariants를 체크하는 데 적합하지 않음. assertion은 실행 시 비활성화될 수 있으므로 사용자 입력 검증에 사용하는 것은 부적절함
- **동시에 사용**
  - **방법**: 서로 다른 목적에 맞게 둘 다 사용할 수 있음
    - **Validate.isTrue**: 특정 입력에 대해 IllegalArgumentException을 발생시키도록 계약하고 이를 구현
    - **assert**: 불변 조건과 사후 조건을 처리하며, 추가 사전 조건도 assert로 처리
  - 이를 통해 입력 유효성 검사는 Validate.isTrue로, 시스템 설계 관련 조건 검사는 assert로 각각 처리할 수 있음

## Never\* use Datagrams

### TCP vs UDP

- 인터넷 애플리케이션을 개발할 때 TCP와 UDP 중 하나를 선택해야 함
- **TCP**: 신뢰성 있는 데이터 전송을 보장함
- **UDP**: 신뢰성 없는 데이터 전송을 제공함
- 신뢰성 없는 전송이 필요한 경우는 거의 없음

### "신뢰성 없는"(“Unreliable”)

- 실시간 비디오 프로토콜을 설계하는 모임에서 **SUBSCRIBE**가 신뢰성 없도록 해야 한다는 의견이 있었음
- 실제로 필요한 것은 **적시성(timeliness)**임
- 실시간 비디오에서는 최신 데이터를 우선적으로 전달하는 것이 중요함

### 데이터그램

- 데이터그램(IP 패킷)은 출발지 주소에서 목적지 주소로 전송되는 데이터의 단위임
- 데이터그램은 손실되거나 순서가 뒤바뀔 수 있음
- 데이터그램을 사용하는 이유는 네트워크 혼잡 시 패킷을 드롭하는 것이 더 나은 선택이기 때문임

### 당신, 애플리케이션 개발자

- UDP를 직접 사용하면 여러 문제에 직면할 수 있음
- UDP 위에 자체 전송 프로토콜을 구축하려면 재전송, 혼잡 제어 등을 구현해야 함
- QUIC 라이브러리를 사용하는 것이 더 나은 선택임

### 적시성

- **적시성**을 달성하기 위해 QUIC를 사용할 수 있음
  1. **버퍼를 비우기**: 혼잡 제어를 통해 큐를 감지하고 전송 속도를 줄임
  2. **데이터를 스트림으로 분할**: 각 스트림은 독립적으로 전송됨
  3. **스트림 우선순위 지정**: 중요한 스트림을 우선적으로 전달함

### 데이터그램 방어

- QUIC와 MoQ는 데이터그램을 지원함
- 데이터그램 지원은 실험을 허용하기 위해 중요함
- 그러나 데이터그램 사용은 함정일 수 있음

### 결론

- 데이터그램 위에 애플리케이션을 설계하지 말아야 함
- UDP 위에 또 다른 비디오 프로토콜을 만들지 말고, Media over QUIC에 참여하는 것이 좋음

## **Zig vs Rust at work: the choice we made**

- 2023년 한해 동안 Rust와 Zig 중 어떤 언어를 채택할지에 대한 논의 진행
- 주요 고려 사항
  1. C 언어와의 상호 운용성
  2. 엔지니어 확장성 (채용, 유지보수 등)
- **최종 선택: Zig**
- 이 선택 과정은 대규모 회사에서 "코드가 다양한 대상에서 실행되고 수억 명의 사용자에게 영향을 미칠 때 고려하는 요소"들을 잘 보여준다고 생각해서 공유함

### 결론

- Zig가 기존 코드베이스 포팅 및 모든 플랫폼 호환성 보장에 필요한 시간과 노력을 크게 감소시킴
- 예상 외 결정 요인들
  1. 학습 용이성과 채용이 예상보다 큰 영향을 미침 (Zig 에 유리)
  2. 툴체인 관련 개발자 경험이 중요한 역할
  3. Zig 컴파일러와 빌드 시스템이 기존 코드베이스와의 호환성으로 인해 크게 도움됨
  4. Rust의 생태계, 커뮤니티, 메모리 안전성 보장은 예상보다 영향력이 적음

## Automated Unit Test Improvement using Large Language Models at Meta

### 메타의 자동화된 단위 테스트 개선 도구: TestGen-LLM

- 메타에서 개발한 TestGen-LLM 도구는 대규모 언어 모델(LLMs)을 사용하여 기존의 인간이 작성한 테스트를 자동으로 개선함
- TestGen-LLM이 생성한 테스트 클래스는 원래 테스트 스위트에 비해 측정 가능한 개선을 보장하는 일련의 필터를 성공적으로 통과하여 LLM 환각 문제를 해결함
- 메타의 Instagram과 Facebook 플랫폼을 위한 테스트 대회(test-a-thons)에서 TestGen-LLM의 배포를 설명함

### TestGen-LLM의 성능 평가

- Instagram의 Reels와 Stories 제품에 대한 평가에서 TestGen-LLM의 테스트 케이스 중 75%가 정확하게 빌드되었고, 57%가 신뢰성 있게 통과했으며, 25%가 커버리지를 증가시킴
- 메타의 Instagram과 Facebook 테스트 대회에서 TestGen-LLM은 적용된 모든 클래스의 11.5%를 개선했으며, 메타 소프트웨어 엔지니어들이 제작 배포를 위해 73%의 권장 사항을 수락함
- 이는 LLM이 생성한 코드의 산업 규모 배포에 대한 첫 번째 보고서이며, 코드 개선에 대한 이러한 보증을 받은 것임

## References

- https://www.lennysnewsletter.com/p/a-three-step-framework-for-solving
- https://stulle123.github.io/posts/kakaotalk-account-takeover/
- https://stackoverflow.com/a/5452329
- https://quic.video/blog/never-use-datagrams/
- https://ludwigabap.bearblog.dev/zig-vs-rust-at-work-the-choice-we-made/
- https://arxiv.org/abs/2402.09171
