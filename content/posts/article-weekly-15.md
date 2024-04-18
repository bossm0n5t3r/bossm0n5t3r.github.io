+++ 
date = 2024-04-18T22:30:00+09:00
title = "Article Weekly, Issue 15"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-04-07` ~ `2024-04-13`

## CAP Theorem for Distributed System

- 분산 시스템에서의 CAP 이론에 대한 탐구
- 분산 시스템은 네트워크 내에서 여러 연결된 노드에 계산과 데이터를 분배함
- 이는 처리 능력을 분산하거나 데이터를 지리적으로 분산하여 빠른 전달을 위해 사용될 수 있음
- 중앙 집중식 시스템과 달리 분산 시스템은 데이터를 여러 연결된 지점에 분산시킴
- 이러한 분산은 네트워크 실패와 같은 도전과 함께 오는데, 네트워크 링크가 끊어지면 네트워크가 격리된 그룹으로 나뉘어 네트워크 분할이 발생
- 이 때문에 시스템이 이러한 분할을 견딜 수 있는 능력을 분할 허용성 (partition tolerance) 이라고 함
- CAP 이론은 분산 시스템에 제한을 부여하는데, 시스템 디자이너와 개발자로서 우리는 일관성, 가용성 또는 분할 허용성 중 어떤 속성을 우선시할지 선택해야 함
- 선택한 일관성 모델은 높은 가용성을 우선시할지 일관성을 보장하기 위해 일부 가용성을 희생할지를 결정
- 이러한 트레이드 오프에 기반한 애플리케이션을 설계하는 데 도움이 되는 다양한 도구들이 있음

## ETag and HTTP caching

- HTTP ETag 헤더의 사용 사례와 클라이언트 측 HTTP 캐싱에 관한 것
- GET 요청에 대한 클라이언트 측 HTTP 캐싱을 위해 ETag 헤더를 사용
- If-Match 또는 If-None-Match 와 같은 조건부 HTTP 헤더를 사용하는 것이 필요
- 이 워크플로우는 클라이언트가 GET 요청을 보내고 서버가 200 OK 상태로 응답하며 ETag 값을 포함하여 캐싱하는 과정을 포함
- ETag 값이 변경되지 않으면 클라이언트는 내용을 다시 다운로드하지 않고 저장소에서 제공하여 대역폭을 절약하고 액세스 속도를 높일 수 있음
- 그러나 서버 간 ETag의 불일치로 인해 클라이언트가 이미 보유한 콘텐츠를 다시 다운로드하거나 서버가 캐싱 된 콘텐츠를 사용하는 데 더 많은 요청을 처리해야하는 문제가 발생할 수 있음

## References

- https://dzone.com/articles/cap-theorem-for-distributed-system
- https://rednafi.com/misc/etag_and_http_caching/
