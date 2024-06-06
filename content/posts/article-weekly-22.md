+++
date = 2024-06-07T02:30:00+09:00
title = "Article Weekly, Issue 22"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-05-26` ~ `2024-06-01`

## Big Data is Dead

- 대부분의 사람들은 그렇게 많은 데이터를 가지고 있지 않음
- 작업 크기는 전체 데이터 크기보다 작음
- 대부분의 데이터는 거의 쿼리되지 않음
- 빅 데이터의 경계는 계속 후퇴함
- 데이터는 책임임

## Instead of "auth", we should say "permissions" and "login”

- "auth"라는 용어는 인증(authentication)과 권한 부여(authorization) 두 가지 의미를 가짐
- 인증을 "login"으로, 권한 부여를 "permissions"로 명확히 구분할 것을 제안함
  - "login"은 명사와 동사 형태로 사용 가능함
    - 명사: 시스템에 접근하기 위해 입력하는 정보
    - 동사: 시스템을 사용하기 위해 로그인하는 행위
  - "permissions"는 명사 형태로 사용하며, 동사 형태로는 "check permissions"를 사용함
- 명확한 용어 사용은 쉽게 이해 가능하게 하며, 더 나은 추상화를 가능하게 함

## Your API Shouldn't Redirect HTTP to HTTPS

- API 호출을 HTTP에서 HTTPS로 리디렉션하는 대신 실패를 표시할 것
- HTTP를 완전 비활성화 하거나 명확한 HTTP 오류 응답을 반환하고 비암호화 연결로 전송된 API키를 취소할 것
- 안타깝게도 현재 많은 유명 API 제공업체는 그렇게 하지 않음

## Why, after 6 years, I’m over GraphQL

- 2018년부터 6년간 사용 후, 진정한 GraphQL 열혈 팬이었지만 이제 회의가 듦
- 모든 필드에 대해 사용자 권한을 확인해야함
  - REST API에서 엔드포인트마다 권한을 검사하는 것이 더 간단함
- GraphQL 쿼리는 크기 제한이 없어서 서버에 큰 부담을 줄 수 있음
  - REST API에서는 요청 수를 제한하는 것이 더 간단함
- 권한 부여 코드가 N+1 문제를 일으킬 수 있음
- GraphQL의 보안 및 성능 문제를 해결하기 위한 다양한 방법들이 코드베이스의 복잡성을 증가시킴
- 통합테스트가 필요하고, 디버깅은 어려움

## Don't DRY Your Code Prematurely

- 중복이 진짜로 불필요한지, 아니면 시간이 지나면서 독립적으로 발전할 기능인지 생각해야 함
- 기능이 다르게 발전할 가능성이 있는 경우, 추상화가 오히려 해로울 수 있음
- 의심스러울 때는 시간이 지나면서 결합을 정당화하는 충분한 공통 패턴이 나타날 때까지 동작을 분리해 두어야 함
- 미래의 요구사항은 종종 예측할 수 없음
  - 중복이 문제가 되지 않을 것이거나, 시간이 지나면서 충분히 고려된 추상화의 필요성을 분명히 나타낼 것임

## References

- https://motherduck.com/blog/big-data-is-dead/
- https://ntietz.com/blog/lets-say-instead-of-auth/
- https://jviide.iki.fi/http-redirects
- https://bessey.dev/blog/2024/05/24/why-im-over-graphql/
- https://testing.googleblog.com/2024/05/dont-dry-your-code-prematurely.html
