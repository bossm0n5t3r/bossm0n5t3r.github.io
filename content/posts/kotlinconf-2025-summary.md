+++
date = 2025-05-29T21:00:00+09:00
title = "KotlinConf 2025 키노트 주요 발표 내용 총정리"
authors = ["Ji-Hoon Kim"]
tags = ["kotlin", "kotlinconf", "2025", "keynote", "summary"]
categories = ["kotlin", "kotlinconf", "2025", "keynote", "summary"]
series = ["kotlin", "kotlinconf", "2025", "keynote", "summary"]
+++

![](/images/logos/kotlin-logo.png)

## Introduction

- 2025년 5월 21-23일 덴마크 코펜하겐에서 개최된 KotlinConf 2025가 성공적으로 막을 내렸다.
- 이번 컨퍼런스에서는 103명의 연사와 2,150명의 참석자가 함께하며 Kotlin의 미래를 향한 혁신적인 발표들이 이어졌다.
- 전 세계 250만 명의 개발자들이 사용하는 Kotlin이 AI 시대에 맞춰 어떻게 진화하고 있는지를 보여주는 중요한 순간이었다.

## Kotlin 2.2와 언어 진화

## 새로운 언어 기능들

- Kotlin 2.2가 릴리스 후보 버전으로 공개되면서 여러 혁신적인 기능들이 소개됨
- 주요 신기능
  - **guard conditions in when-with-subject**
  - **multi-dollar string interpolation**
  - **non-local break and continue**
  - 그리고 베타 단계의 **context parameters**
- 특히 주목할 만한 것은 **name-based destructuring** 기능
  - 기존의 positional destructuring에서 발생할 수 있는 실수를 방지하기 위해, 변수명이 프로퍼티명과 일치해야 한다는 제약을 통해 더 안전한 코드 작성을 가능하게 함
  - 이 기능은 Kotlin 2.4에서 실험적 기능으로 출시될 예정

## Must-Use Return Values

- 새로운 **must-use return values** 기능은 함수의 반환값을 무시할 때 경고를 발생시켜 에러 처리를 강화함
- 이는 null safety와 함께 Kotlin의 안전성을 더욱 향상시키는 중요한 기능으로, Kotlin 2.3부터 표준 라이브러리와 kotlinx 라이브러리에 적용될 예정

## K2 컴파일러의 기본 설정화

## 획기적인 성능 향상

- 가장 인상적인 발표 중 하나는 K2 컴파일러가 IntelliJ IDEA 2025.1에서 기본 설정이 되었다는 소식
- JetBrains의 IntelliJ monorepo(1,200만 줄의 Kotlin 코드)에서 테스트한 결과, **컴파일 시간이 40% 이상 단축됨**
- Google의 Android Studio에서도 30%의 성능 향상을 기록함

## 안정적인 컴파일러 플러그인 API

- K2 컴파일러의 안정화와 함께 더욱 안정적인 **컴파일러 플러그인 API**가 제공될 예정
- 이를 통해 개발자들은 더 쉽게 커스텀 체크와 코드 생성 확장을 추가할 수 있게 됨

## AI 기반 개발 도구의 혁신

## JetBrains AI와 Mellum

- AI 시대에 맞춰 JetBrains는 Kotlin에 특화된 AI 도구들을 대거 공개
- **Mellum**이라는 JetBrains만의 LLM이 소개되었으며, 이는 코드 관련 작업에 특화되어 빠르고 정확한 결과를 제공함
- Mellum은 특히 Kotlin에 최적화되어 있으며, 오픈소스로 공개될 예정

## Junie AI 코딩 에이전트

- **Junie** 라는 AI 코딩 에이전트도 발표됨
- 이는 서버 사이드, Android, Kotlin Multiplatform 등 모든 유형의 Kotlin 애플리케이션에서 복잡한 작업을 수행할 수 있는 능력을 갖추고 있음
- 실제로도 매우 유용함!

## Koog AI 프레임워크

- 새로운 AI 프레임워크인 **Koog**가 공개되어, 개발자들이 LLM과 Kotlin의 장점을 결합한 AI 에이전트를 쉽게 구축할 수 있도록 지원

## Kotlin Multiplatform의 대약진

## Compose Multiplatform for iOS 안정화

- Kotlin Multiplatform 생태계에서 가장 중요한 소식 중 하나는 **Compose Multiplatform for iOS가 안정화 버전에 도달**했다는 것
- 이제 프로덕션 환경에서 iOS 네이티브와 같은 스크롤링, 텍스트 선택, 드래그 앤 드롭 기능을 제공함

## Swift Export 실험적 릴리스

- Kotlin 2.2.20에서 **Swift Export의 첫 실험적 릴리스**가 제공될 예정
- 이를 통해 Kotlin 코드를 Swift로 직접 내보낼 수 있어 Apple 생태계와의 통합이 훨씬 쉬워질 전망임

## 새로운 KMP 플러그인

- IntelliJ IDEA와 Android Studio를 위한 **완전히 새로운 KMP 플러그인**이 출시됨
- 이는 올인원 KMP IDE 경험을 제공하여 개발자들의 생산성을 크게 향상시킬 것으로 기대됨

## 백엔드 개발 생태계 강화

## Spring과의 전략적 파트너십

- JetBrains는 Spring 팀과의 전략적 파트너십을 발표함
- 이번 협력을 통해 다음과 같은 영역에서 개선이 이루어질 예정
  - Kotlin과 Spring 앱의 완전한 null safety 구현
  - Kotlin 기반 공식 학습 자료 제공
  - kotlinx.reflect를 통한 더 빠른 Kotlin 리플렉션

## Ktor 3와 Exposed 라이브러리 개편

- **Ktor 3**에서는 Kotlin X IO로의 전환을 통해 **최대 3배 빠른 I/O 성능**을 제공
- Ktor의 채택률은 지난해 37% 증가했으며, 서버 전송 이벤트, WebAssembly 지원 등 새로운 기능들이 추가됨
- **Exposed 라이브러리**는 완전히 재작업되어 새로운 SQL 개념 지원, 향상된 문서화, 그리고 퍼스트 클래스 IDE 지원을 제공

## 공식 Kotlin Language Server Protocol

- 백엔드 개발자들에게 가장 환영받는 소식 중 하나는 **공식 Kotlin Language Server Protocol (LSP)**의 개발 발표
- 이를 통해 IntelliJ 외의 다양한 IDE(VSCode, vim, Sublime Text 등)에서도 Kotlin을 완전히 지원받을 수 있게 됨
- Visual Studio Code용 새로운 Kotlin 확장도 개발 중이며, 기본적인 코드 완성, 네비게이션, 검사, 빠른 수정, Java 상호 운용성 등을 지원함
- 알파 릴리스는 올해 말로 예정되어 있음

## 웹 플랫폼의 발전

## Kotlin/Wasm 성능 향상

- Kotlin/Wasm에서도 상당한 개선이 이루어짐
- 증분 컴파일 지원으로 **빌드 속도가 2배 빨라졌고**, 바이너리 크기는 **평균 30% 감소**
- 런타임 성능은 KotlinJS 대비 **평균 50% 향상**되었으며, Compose Multiplatform에서는 **거의 3배 빠른 성능**을 보여줌

## Compose for Web 베타 예정

- 모든 개선사항과 함께 Kotlin과 Compose for Web 모두 올해 후반기에 **베타 버전으로 이동**할 예정

## 빌드 도구 혁신: Amper

- 실험적 Kotlin 및 JVM 빌드 도구인 **Amper**가 알파 버전을 향해 계속 발전하고 있음
- Amper는 개발자 친화적이며 명확한 구성 경로, IDE 지원, 오류 보고 기능을 제공

## 결론

- KotlinConf 2025는 Kotlin이 단순한 프로그래밍 언어를 넘어 AI 시대의 핵심 개발 플랫폼으로 자리잡고 있음을 보여주는 중요한 이벤트
- K2 컴파일러의 성숙화, 강력한 AI 도구들의 통합, Kotlin Multiplatform의 안정화, 그리고 백엔드 생태계의 강화를 통해 Kotlin은 더욱 매력적인 개발 선택지가 되고 있음
- 특히 공식 Language Server Protocol의 발표는 Kotlin 생태계가 더욱 개방적이고 포용적인 방향으로 나아가고 있음을 보여주는 상징적인 발표
- 이러한 혁신들을 통해 Kotlin은 앞으로도 전 세계 개발자들에게 사랑받는 언어로 성장해 나갈 것으로 기대됨

## 관련 링크 및 자료

| 링크 유형     | 설명                                            | URL                                                                                                                          |
| ------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 공식 컨퍼런스 | KotlinConf 2025 메인 사이트                     | [https://kotlinconf.com](https://kotlinconf.com/)                                                                            |
| 공식 블로그   | JetBrains Kotlin 블로그 주요 발표 내용          | https://blog.jetbrains.com/kotlin/2025/05/kotlinconf-2025-language-features-ai-powered-development-and-kotlin-multiplatform/ |
| 키노트 영상   | KotlinConf 2025 키노트 YouTube                  | https://www.youtube.com/watch?v=F5NaqGF9oT4                                                                                  |
| 컨퍼런스 일정 | KotlinConf 2025 세션 스케줄                     | https://kotlinconf.com/schedule/                                                                                             |
| 로드맵        | 2025년 Kotlin Multiplatform 개발 로드맵         | https://blog.jetbrains.com/ko/kotlin/2024/11/kotlin-multiplatform-development-roadmap-for-2025/                              |
| Google 발표   | Google I/O 및 KotlinConf 2025 Android 관련 발표 | https://android-developers.googleblog.com/2025/05/android-kotlin-multiplatform-google-io-kotlinconf-2025.html                |
