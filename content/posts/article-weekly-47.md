+++
date = 2024-11-27T01:00:00+09:00
title = "Article Weekly, Issue 47"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-11-17` ~ `2024-11-23`

## O2 unveils Daisy, the AI granny wasting scammers’ time

- O2는 전화 사기꾼과 실시간 대화를 하며 고객을 대신해 시간을 낭비하게 만드는 인간처럼 보이는 AI 할머니 ‘Daisy’를 개발
- 데이지는 최첨단 기술과 유명 스캠베이터(사기꾼과 통화하여 고의적으로 시간을 끄는 사람) Jim Browning의 콘텐츠를 기반으로 훈련되어, 진짜 사람과 구별이 불가능할 정도로 정교함
- 사기꾼은 실제 피해자를 찾았다고 착각하지만, 사실 Daisy가 사기꾼을 역으로 속이고 있음
- 사기 피해자 Amy Hart는 Daisy와 협력해 사기꾼의 전술을 폭로하고, O2 고객이 사기를 피할 수 있도록 돕는 동영상을 제작했음
- Daisy는 사기꾼이 실제 사람과 대화하고 있다고 믿도록 만들며, 고객 보호와 사기 방지의 중요성을 강조함

## Node.js Frameworks Roundup 2024 — Elysia / Hono / Nest / Encore — Which should you pick?

- 2024년 Node.js 프레임워크 비교: Nest, Elysia, Encore.ts, Hono
- Encore.ts:
  - TypeScript 기반의 오픈 소스 프레임워크
  - 내장된 요청 검증 기능
  - 서비스 생성 및 호출 용이성
  - 인프라를 타입 안전한 객체로 통합
  - 내장된 개발 대시보드 제공
  - 0 npm 의존성
- Hono:
  - Cloudflare Workers에 최적화
  - 경량 (13kB 미만)
  - 다중 런타임 지원 (Node.js, Bun, Deno)
  - 0 NPM 의존성
- Elysia:
  - TypeScript 기반, 타입 안전성 제공
  - Swagger 문서화 지원
  - OpenTelemetry 지원
- Nest.js:
  - 더 의견이 강한(opinionated) 구조
  - 대규모 애플리케이션에 적합
  - Express 또는 Fastify를 기반으로 함
- 성능 비교:
  - Encore.ts가 가장 빠름 (Rust 런타임 사용)
  - Elysia, Hono, Fastify, Express 순
- 코드 구조:
  - Hono, Elysia, Encore는 비교적 유사한 API 구조
  - Nest.js는 데코레이터 사용 등 차별화된 구조
- 배포 및 인프라:
  - 모든 프레임워크가 주요 클라우드 플랫폼 지원
  - Encore는 자동 로컬 인프라 제공
  - Hono는 다양한 런타임 지원으로 배포 옵션 다양

## Constraints in Go

- Go의 제네릭 프로그래밍에서 제약(constraints)의 중요성 소개
- 제약의 종류:
  - 메서드 집합 제약
  - 타입 집합 제약
- `any` 제약의 한계 설명
- 기본 인터페이스를 이용한 제약:
  - `fmt.Stringer` 예시
- 타입 집합 제약:
  - 타입 요소 사용
  - 유니온을 통한 다중 타입 지원
  - 인터섹션을 통한 복합 제약
- 복합 타입 리터럴:
  - 구조체 타입 리터럴 사용
  - 구조체 필드 접근의 제한점
- 타입 집합 제약의 한계:
  - 변수나 매개변수 선언에 사용 불가
  - 클래스와의 차이점
- 근사(approximation) 타입:
  - `~` 연산자를 통한 기본 타입 및 파생 타입 포함
- 인터페이스 리터럴:
  - 제약 조건으로 직접 사용 가능
  - 예제와 연습문제를 통한 개념 설명

## How I use Erlang Hot Code Updates

- Erlang 생태계의 강력한 기능 중 하나는 핫 코드 업데이트임
- 이 기능은 거의 다른 런타임에서는 불가능하며 매우 독특함
- Elixir는 Erlang 위에서 빌드되었으며 동일한 기능을 지원함
- 핫 코드 업데이트는 실무에서 크게 두 가지로 나뉨:
  1. 간단한 코드 리로드
     - 예: 개발 중 `IEx`에서 `r MyModule` 또는 `recompile` 명령을 실행하는 것
     - 이는 간단하고 유용하지만, 새로운 컴파일러나 빌더의 일부처럼 느껴짐
  2. 더 복잡한 응용
     - **Nerves** 프로젝트에서 핫 코드 업데이트를 자주 활용:
       - 내장 Elixir 디바이스에서 숫자를 튜닝하거나 모듈을 수정할 때, 펌웨어 업로드 및 재부팅을 기다리는 대신 `IEx`로 업데이트
       - 애플리케이션의 특정 부분을 시작/중지하거나, `GenServer`를 종료하여 상태를 초기화
     - **NervesHub**를 통해 원격 디바이스에 핫 코드 업데이트 적용:
       - 예: 실시간 클럭 디버깅 시 I2C 호출을 직접 실행하며 문제를 빠르게 파악

## 코루틴과 Virtual Thread 비교와 사용

- 동시성 처리의 중요성:
  - 빠른 응답과 높은 처리량이 필수적.
  - 대규모 요청, 데이터베이스 트랜잭션, CPU 연산에서 중요함.
- 전통적 접근법의 문제점:
  - 고비용의 스레드 생성 및 관리.
  - 복잡한 동기화 문제.
  - 한정된 스레드 풀.
  - 블로킹 I/O에 따른 성능 저하.
- 코루틴 소개:
  - Kotlin에서 비동기 작업을 위한 경량화된 동시성 처리 방식.
  - 자원 절약, 협력적 멀티태스킹 지원.
- Virtual Thread 소개:
  - Java에서 도입된 경량 스레드 모델.
  - JVM에서 관리, 수십만 개 스레드 생성 가능.
  - 기존 코드와 API 호환성.
- 비교:
  - 두 기술 모두 경량성, 코드 수정 필요성, 디버깅의 용이성을 고려.
- 예제 코드:
  - 코루틴의 간단한 사용 예제 및 Virtual Thread 예제 제공.
- 성능 비교:
  - Virtual Thread가 코루틴보다 성능 우위에 있음 (10~15% 더 빠름).
  - 메모리 사용량과 CPU 시간에서도 Virtual Thread가 우세.
- 결론:
  - 코루틴은 성숙한 기술, Virtual Thread는 신기술이지만 훌륭한 성능과 관리 용이성 제공.
  - 기술 선택은 프로젝트 특성과 개발 팀의 경험에 따라 달라짐.

## 코틀린 함수형 프로그래밍의 길을 찾아서

- 작성자는 코틀린 함수형 프로그래밍에 매료되어 여러 시행착오를 겪으며 실무 적용을 시도했다.
- 추상적 이론 대신 간단한 기법부터 시작해 점차 복잡한 방법을 도입하며 인사이트를 얻음.
- 함수형 프로그래밍의 기본 원칙, 고차함수, 패턴 추상화, Kotlin Arrow 라이브러리 사례 등을 통한 실용적 접근 제시.
- 주요 내용:
  - 함수형 프로그래밍의 기본 원칙:
    - 참조 투명성, 불변성, 순수 함수를 강조.
    - 실무에서 불변성 및 참조 투명성 지키기 어려움 설명.
  - 함수형 프로그래밍 실무 활용 전략:
    1. 함수형 기초 사상(불변성, 순수함수 등) 따르기.
    2. 고차함수 활용: 예외 처리, 재시도, 배치 처리 로직 예시 제공.
    3. 데이터 패턴 재사용: 반복되는 데이터 구조를 추상화하여 유용성 증대.
    4. Kotlin Arrow 라이브러리 활용: Either 타입을 통한 오류 처리 및 복잡한 비즈니스 로직 단순화.
- 리뷰어 한줄평:
  - 함수형 프로그래밍의 기초부터 실무 적용 사례까지 잘 나열되어 있음.
  - 코드를 전환하지 않고 작은 부분부터 시작할 수 있는 유용한 방법 소개.
- 마무리:
  - 함수형 프로그래밍의 기법들을 실무에서 간단하게 적용할 수 있는 지침.
  - 다양한 방법을 공유하고 실험하여 더 나은 프로그래밍을 지속적으로 추구할 것을 권장.

## References

- https://news.virginmediao2.co.uk/o2-unveils-daisy-the-ai-granny-wasting-scammers-time/
- https://dev.to/encore/nodejs-frameworks-roundup-2024-elysia-hono-nest-encore-which-should-you-pick-19oj
- https://bitfieldconsulting.com/posts/constraints
- https://underjord.io/how-i-use-erlang-hot-code-updates.html
- https://tech.kakaopay.com/post/coroutine_virtual_thread_wayne/
- https://tech.kakaopay.com/post/way-to-functional-programming/
