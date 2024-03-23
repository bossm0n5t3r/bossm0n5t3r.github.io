+++ 
date = 2024-03-23T21:00:00+09:00
title = "Article Weekly, Issue 12"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-03-17` ~ `2024-03-23`

## Java 22 Features

- 2024년 03월 21일에 자바 22가 출시되었고, 해당 기능에 대해 정리한 내용이다.
- Unnamed Variables & Patterns – JEP 456
- Launch Multi-File Source-Code Programs – JEP 458
- Foreign Function & Memory API – JEP 454
- Locale-Dependent List Patterns
- New Preview Features in Java 22
  - Statements Before Super(...) (Preview) – JEP 447
  - Stream Gatherers (Preview) – JEP 461
  - Class-File API (Preview) – JEP 457
- Resubmitted Preview and Incubator Features
  - Structured Concurrency (Second Preview) – JEP 462
  - Scoped Values (Second Preview) – JEP 464
  - String Templates (Second Preview) – JEP 459
  - Implicitly Declared Classes and Instance Main Methods (Second Preview) – JEP 463
  - Vector API (Seventh Incubator) – JEP 460
- Deprecations and Deletions
  - Thread.countStackFrames Has Been Removed
  - The Old Core Reflection Implementation Has Been Removed
  - Deprecations and Deletions in sun.misc.Unsafe
- Other Changes in Java 22
  - Region Pinning for G1 – JEP 423
  - Support for Unicode 15.1
  - Complete List of Changes in Java 22

## WebSockets vs Server-Sent-Events vs Long-Polling vs WebRTC vs WebTransport

- 이 웹 페이지의 핵심 내용은 "웹 소켓 vs 서버 보내는 이벤트 vs 롱 폴링 vs WebRTC vs WebTransport"
- 실시간 웹 애플리케이션에 대한 서버에서 클라이언트로 이벤트를 전송할 수 있는 여러 방법에 대해 비교
- 초기에는 롱 폴링이 유일한 옵션이었지만, 웹 소켓이 이를 대체하여 양방향 통신에 더 강력한 솔루션을 제공
- 서버 보내는 이벤트(SSE)는 서버에서 클라이언트로의 단방향 통신에 간단한 방법을 제공
- 이외에도 WebTransport 프로토콜이 더 효율적이고 유연하며 확장 가능한 접근 방식을 제공할 것으로 기대되며, 특정한 경우에는 WebRTC도 서버-클라이언트 이벤트에 고려될 수 있습니다.
- 이 기사는 이러한 기술들을 탐구하고 그들의 성능을 비교하며 혜택과 제한사항을 강조
- 실시간 웹 애플리케이션을 구축할 때 개발자가 합리적인 결정을 할 수 있도록 다양한 사용 사례에 대한 권장 사항을 제공
- 이는 RxDB 복제 프로토콜을 다양한 백엔드 기술과 호환되도록 구현하는 경험에서 얻은 내용을 요약

## Logarithm: A logging engine for AI training workflows and services

- Meta에서 수행되는 AI 교육 워크플로 및 서비스를 위한 로깅 엔진 "Logarithm"
- Logarithm은 Meta에서 내부적으로만 사용되는 호스팅된, 서버리스, 멀티테넌트 서비스
- 시스템 및 애플리케이션 로그를 소비하고 색인화하여 상호작용하는 쿼리 인터페이스를 제공
- 실시간으로 초당 100GB 이상의 로그를 색인화하고 초당 수천 개의 쿼리를 처리
- 서비스 수준의 로그 신선도, 완전성, 내구성, 쿼리 대기시간, 결과 완전성에 대한 보장을 제공
- 사용자는 Google Logging Library [glog] 와 같은 로깅 라이브러리를 선택하여 로그를 발행
- 로그 라인에 대한 정규식, 로그에 첨부된 임의의 메타데이터 필드, 호스트 및 서비스의 로그 파일을 통해 쿼리 가능
- 또한 Logarithm은 간단한 설계로 확장성을 중심으로 하고 도메인별 및 로그 분석 능력을 지속적으로 구축
- 성능 최적화를 위한 적절한 pushdown과 함께 Logarithm 내에 또는 Logarithm 위에 적층된 도메인별 및 도메인 간 분석 능력을 구축
- 경량화된 분산 디버깅 UI를 지원
- 이렇게 Logarithm은 AI 교육 디버깅 유즈 케이스를 자원하기 위한 디자인과 강력한 성능을 제공
- 이를 통해 AI 시스템의 스토리지 및 쿼리 시간 개선을 위한 투자를 계속하고 있음

## References

- https://www.happycoders.eu/java/java-22-features/
- https://rxdb.info/articles/websockets-sse-polling-webrtc-webtransport.html
  - https://news.hada.io/topic?id=13888
- https://engineering.fb.com/2024/03/18/data-infrastructure/logarithm-logging-engine-ai-training-workflows-services-meta/
