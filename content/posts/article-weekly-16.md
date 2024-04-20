+++ 
date = 2024-04-20T23:30:00+09:00
title = "Article Weekly, Issue 16"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-04-14` ~ `2024-04-20`

## PuTTY vulnerability vuln-p521-bias

- PuTTY 도구 버전 0.68부터 0.80까지 모든 버전에 NIST P521 곡선을 사용하는 ECDSA 개인 키에서 서명을 생성하는 코드에 중요한 취약점이 있음
- 발견된 취약성은 개인 키를 노출시키는 것
- 공개 키와 서명된 메시지를 가진 공격자가 개인 키를 복구하고 당신으로부터 온 것처럼 서명을 위조할 수 있음
- 이러한 취약성은 SSH 연결을 도청하는 자에게는 노출되지 않음
- 취약한 키로부터의 서명이 가치 없게 되므로 새로운 키 쌍을 생성해야 함
- PuTTY는 RFC 6979 기술을 사용하여 이 취약점을 해결하였음
- 기존 P521 개인 키 정보는 이전 k 생성기를 사용하여 서명이 생성될 때 이미 유출된 상태임

## References

- https://www.chiark.greenend.org.uk/~sgtatham/putty/wishlist/vuln-p521-bias.html
