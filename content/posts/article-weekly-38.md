+++
date = 2024-09-22T09:00:00+09:00
title = "Article Weekly, Issue 38"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-09-15` ~ `2024-09-21`

## How To Solve OutOfMemoryError: Metaspace

- OutOfMemoryError: Metaspace 오류는 Java 애플리케이션에서 흔히 발생하는 문제
- Metaspace는 Java 8부터 도입된 개념으로, 이전의 PermGen을 대체함
- Metaspace는 클래스 메타데이터를 저장하는 네이티브 메모리 영역
- 이 오류의 주요 원인
  - 메모리 누수
  - 과도한 클래스 로딩
  - 부적절한 Metaspace 크기 설정
- 해결 방법:
  - JVM 옵션을 통해 Metaspace 크기 조정
    - `XX:MetaspaceSize`와 `XX:MaxMetaspaceSize` 사용
  - 코드 최적화
    - 불필요한 클래스 로딩 줄이기
    - 동적 클래스 생성 최소화
  - 메모리 누수 해결
    - 프로파일링 도구 사용하여 문제 식별
  - 클래스 언로딩 활성화
    - `XX:+ClassUnloadingWithConcurrentMark` 옵션 사용
- 모니터링과 프로파일링 도구 활용 권장
  - VisualVM, JConsole, Eclipse Memory Analyzer 등
- 장기적으로는 애플리케이션 아키텍처 개선 고려

## A curried composition puzzle

- 함수형 프로그래밍 수업에서 제시된 퍼즐 소개
- 퍼즐의 핵심: 2개 함수 합성을 이용해 3개 함수 합성 구현하기
- 문제 설명:
  - 람다 계산법, Haskell, Scheme, JavaScript로 표현
  - 목표: `c = (g) => (f) => (x) => g(f(x))`를 이용해 `(h) => (g) => (f) => (x) => h(g(f(x)))` 구현
- 함수 합성 개념 설명:
  - 2개 함수 합성: `compose2 = (g, f) => (x) => g(f(x))`
  - 커리된 버전: `curried_compose2 = (g) => (f) => (x) => g(f(x))`
- 해결 접근 방법:
  - 함수 평가 표현을 트리 구조로 시각화
  - `c` 함수를 특정 트리 재작성 규칙으로 해석
- 해결책:
  - `(c (c c)) c` 또는 `((c (c c)) c)` 또는 `c(c(c))(c)`
- 해결 과정 분석:
  - 직관을 버리고 대수적 문제로 접근하여 해결
  - 의미 있는 해석보다는 기계적 재작성 규칙에 집중
- 추가 퍼즐 제시:
  - n개 함수 합성으로 일반화 가능한지 탐구
  - 역순 3개 함수 합성이 `c`만으로 불가능한 이유 고찰
- 이 퍼즐은 함수형 프로그래밍의 깊이 있는 개념을 탐구하고, 추상적 사고를 통해 문제를 해결하는 과정을 보여줌

## Hybrid search with PostgreSQL and pgvector

- 하이브리드 검색은 벡터 유사도 검색과 다른 검색 방법을 결합하는 기술
- 주요 목적: 검색 결과의 품질(recall) 향상
- PostgreSQL과 pgvector를 사용한 하이브리드 검색 구현 방법 소개
- Reciprocal Ranked Fusion (RRF) 스코어링 방식 설명
  - `rrf_score` 함수 구현 및 `rrf_k` 파라미터의 영향 설명
- PostgreSQL의 전문 검색(Full-text search) 기능 소개
  - tsearch2, GIN 인덱스, `ts_rank_cd` 랭킹 방법 사용
- 실제 예제 구현:
  - 'products' 테이블 생성 (id, description, embedding 컬럼)
  - Python을 사용한 더미 데이터 생성 및 벡터 임베딩
  - 전문 검색 및 벡터 검색을 위한 인덱스 생성
- 개별 검색 방법 비교:
  - 벡터 유사도 검색 쿼리 예시
  - 전문 검색 쿼리 예시
- 하이브리드 검색 구현:
  - 벡터 검색과 전문 검색 결과를 결합
  - RRF 스코어를 사용한 최종 랭킹 계산
- 결론:
  - 하이브리드 검색이 단일 검색 방법보다 더 나은 결과를 제공할 수 있음
  - 벡터 검색의 의미론적 관계와 전문 검색의 정확한 일치를 결합하여 검색 품질 향상

## Why wordfreq will not be updated

- wordfreq는 2021년까지의 언어 사용 데이터 스냅샷을 제공하는 프로젝트
- 프로젝트가 더 이상 업데이트되지 않는 이유
- 생성형 AI의 데이터 오염
  - 2021년 이후 인간의 언어 사용에 대한 신뢰할 수 있는 정보 부족
  - 웹상의 대규모 언어 모델 생성 텍스트로 인한 단어 빈도 왜곡
  - 예: ChatGPT가 "delve" 단어에 비정상적으로 집착하는 현상
- 무료 정보의 유료화
  - Twitter와 Reddit 등 대화형 언어 사용 데이터 소스의 변화
  - Twitter(현 X)의 공개 API 중단 및 스팸 증가
  - Reddit의 데이터 아카이브 유료화
- 프로젝트 개발자의 입장 변화
  - NLP 분야가 생성형 AI에 잠식되는 현상에 대한 우려
  - 텍스트 수집이 표절 기계 제작으로 오해받을 수 있는 상황
  - 생성형 AI와 연관되거나 이를 지원하는 작업을 피하고자 함

## The HTTP QUERY Method

- 새로운 HTTP 메소드인 QUERY를 제안
  - Request시에 콘텐츠를 전달할 수 있는, 안전하고 멱등성(idempotent)이 있는 요청 메소드
  - Request에 전달되는 데이터가 너무 커서 URI로 인코딩할 수 없을 때 이 방법을 사용가능
- 쿼리 매개변수가 수KB 이상일 경우 많은 구현체에서 제한을 둠
  - 요청 전에 이 제한을 미리 알 수 없는 경우가 많고, 인코딩 해야하므로 비효율적
- 그래서 많은 구현에서는 GET 대신 POST를 사용하여 쿼리를 수행
  - 하지만 서버에 대한 구체적인 지식이 없으면, 안전하고 멱등성이 있는지 등을 알 수 없어서 GET과 동일한 기본적 제한이 있음
- QUERY 메소드는 GET과 POST 사용 간의 격차를 해소하는 솔루션을 제공
  - POST와 마찬가지로 쿼리 작업에 대한 입력은 요청 URI의 일부가 아닌 요청의 컨텐츠 내에서 전달
  - 그러나 POST와 달리 이 메소드는 명시적으로 안전하고 멱등성이 있어, 캐싱 및 자동 재시도와 같은 기능을 할 수 있음
- request

  ```text
  QUERY /contacts HTTP/1.1
  Host: example.org
  Content-Type: example/query
  Accept: text/csv

  select surname, givenname, email limit 10
  ```

- response

  ```text
  HTTP/1.1 200 OK
  Content-Type: text/csv
  Content-Location: /contacts/responses/42
  Location: /contacts/queries/17

  surname, givenname, email
  Smith, John, john.smith@example.org
  Jones, Sally, sally.jones@example.com
  Dubois, Camille, camille.dubois@example.net
  ```

## Why Scrum is Stressing You Out

- 오늘날의 프로그래밍은 90년대와 2000년대 초반보다 훨씬 더 스트레스가 많음
- 당시에는 마감일 근처에서만 일이 미쳤었고, 다른 때는 비교적 평온했음
- 최근 몇 십 년 동안 스트레스가 증가한 이유를 고민해 봤음
- 경쟁, 시장 변화, 엄격한 마감일 때문이 아니라, 스프린트 방식의 작업 때문임
  - 스프린트는 멈추지 않음
  - 스프린트는 자발적이지 않음
  - 스프린트는 중요한 지원 활동을 무시함
  - 스크럼폴: 실제 (그리고 더 나쁜) 그림
    - 대부분의 스크럼 구현은 워터폴과 스크럼의 혼합임
    - 큰 마감일이 항상 배경에 존재함
    - 큰 마감일이 다가오면 스크럼이 중단되고, 스트레스가 증가함
- 결론
  - 스프린트에는 휴식이 없고, 자율성이 부족하며, 준비 시간이 부족함
  - 개발자들은 자신의 작업과 프로세스를 통제할 수 있어야 함
  - 이를 위해서는 윤리적인 조직을 구축하거나 프리랜서로 전환하는 등의 노력이 필요함

## Java 21 Virtual Threads - Dude, Where’s My Lock?

- Netflix가 Java 21의 가상 스레드(Virtual Threads) 도입 과정에서 겪은 문제와 해결 과정을 설명
- 주요 내용
  - Java 21과 SpringBoot 3, 내장 Tomcat을 사용하는 앱에서 간헐적 타임아웃과 정지 현상 발생
  - 문제의 주요 증상: closeWait 상태의 소켓 수 지속적 증가
  - 가상 스레드 사용으로 인해 일반적인 스레드 덤프로는 문제 파악 어려움
  - jcmd 명령어를 통해 가상 스레드 상태 확인
  - 문제의 원인: 동기화 블록 내에서 블로킹 작업 수행 시 가상 스레드가 OS 스레드에 고정되는 현상
  - Zipkin 관련 코드에서 ReentrantLock 획득 과정에서 교착 상태 발생
  - 4개의 가상 스레드가 OS 스레드를 점유한 채 락 획득 대기
  - 나머지 가상 스레드들은 실행될 OS 스레드 부족으로 대기 상태
- 결론
  - 가상 스레드는 성능 향상에 도움이 되지만, Java 21에서는 일부 문제점 존재
  - Java 23 이후 버전에서 가상 스레드와 락 프리미티브 간의 통합 개선 기대
  - Netflix의 성능 엔지니어링 팀의 문제 해결 접근 방식 공유

## Digital signatures and how to avoid them

- 디지털 서명의 문제점
  - 상호작용 식별 프로토콜에서 파생되었지만, 중요한 특성들을 잃었음
  - 특정 시간과 당사자에 국한되지 않아 보안 취약점 발생 가능
  - JWT, WebAuthn, TLS 등에서 추가적인 보안 조치 필요
- 서명 체계의 취약성
  - 특수 건전성(special soundness)으로 인한 취약점
  - 난수 재사용 시 개인키 노출 위험
  - 결정론적 서명과 헤지된 서명 방식의 도입, 그러나 여전히 문제 존재
- 과도한 기능
  - 단순 인증 이상의 기능 제공 (제3자 검증, 부인 방지)
  - 의도치 않은 부작용 발생 가능
- 대안
  - 가능한 경우 HMAC 사용 권장
  - 공개키 암호화가 필요한 경우, 인증된 KEM과 X25519를 사용하여 공유 비밀 생성 후 HMAC 사용
  - 서명은 소프트웨어/펌웨어 업데이트에만 적합

## References

- https://dzone.com/articles/how-to-solve-outofmemoryerror-metaspace
- https://franklin.dyer.me/post/212
- https://jkatz05.com/post/postgres/hybrid-search-postgres-pgvector/
- https://github.com/rspeer/wordfreq/blob/master/SUNSET.md
- https://www.ietf.org/archive/id/draft-ietf-httpbis-safe-method-w-body-05.html
- https://rethinkingsoftware.substack.com/p/why-scrum-is-stressing-you-out
- https://netflixtechblog.com/java-21-virtual-threads-dude-wheres-my-lock-3052540e231d
- https://neilmadden.blog/2024/09/18/digital-signatures-and-how-to-avoid-them/
