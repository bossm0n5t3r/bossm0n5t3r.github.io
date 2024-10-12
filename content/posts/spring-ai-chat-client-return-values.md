+++
date = 2024-10-13T02:00:00+09:00
title = "[Spring AI] ChatClient의 return value들"
authors = ["Ji-Hoon Kim"]
tags = ["Spring AI"]
categories = ["Spring AI"]
series = ["Spring AI"]
+++

## Introduction

- ChatClient 에서 `call()` 메서드와 `stream()` 메서드 각각의 response 타입에 대해 정리해보자.

## `call()` 의 return value 들

- `String content()`
  - 응답의 문자열 내용을 반환
- `ChatResponse chatResponse()`
  - 여러 생성 결과와 응답에 대한 메타데이터 (예: 응답 생성에 사용된 토큰 수) 를 포함하는 ChatResponse 객체를 반환
- `entity()`
  - Java 타입 반환
  - `entity(ParameterizedTypeReference<T> type)`
    - 엔티티 타입의 `Collection` 을 반환할 때 사용
  - `entity(Class<T> type)`
    - 특정 엔티티 타입을 반환할 때 사용
  - `entity(StructuredOutputConverter<T> structuredOutputConverter)`
    - `String` 을 엔티티 타입으로 변환하기 위한 `StructuredOutputConverter` 인스턴스를 지정할 때 사용

## `stream()` 의 return value 들

- `Flux<String> content()`
  - AI 모델이 생성하는 문자열의 `Flux` 를 반환
- `Flux<ChatResponse> chatResponse()`
  - 응답에 대한 추가 메타데이터를 포함하는 `ChatResponse` 객체의 `Flux` 를 반환

## References

- https://docs.spring.io/spring-ai/reference/api/chatclient.html#_call_return_values
- https://docs.spring.io/spring-ai/reference/api/chatclient.html#_stream_return_values
