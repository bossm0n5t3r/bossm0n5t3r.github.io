+++ 
date = 2024-02-13T03:00:00+09:00
title = "Base64 인코딩 길이 계산하기"
authors = ["Ji-Hoon Kim"]
tags = ["CS"]
categories = ["CS"]
series = ["CS"]
+++

## Introduction

- 길이가 `n` 인 문자열 `S` 가 있다고 해보자.
- 만약 이 문자열 `S` 를 `Base64 Encoding` 했을 때 생성되는 인코딩 문자열의 길이는 몇이 될까?

## Calculation

- `Base64` 의 각 `character` 들은 `6 bits` 로 표현된다.
  - $log_2(64) = 6$
- 따라서 원래 문자열의 `3 bytes` 는 `4 chars` 로 표현가능하다.
  - $3\ bytes = 24\ bits = 4*6 = 4\ chars\ (base64)$
- 따라서 `n bytes` 를 나타내려면 $4*(n/3)$ `chars` 가 필요하다.
- 결과적으로 대충 `4 * ceil(n/3)` 로 계산하면 된다.

## References

- https://stackoverflow.com/questions/13378815/base64-length-calculation
