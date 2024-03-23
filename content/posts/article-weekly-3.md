+++ 
date = 2024-01-21T17:30:00+09:00
title = "Article Weekly, Issue 3"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-01-14` ~ `2024-01-20`

## 개요

- [Understanding x86_64 Paging](https://zolutal.github.io/understanding-paging/)
  - 요약
    - 이 문서는 x86_64 CPU에서 페이지 테이블과 주소 변환에 대해 설명
    - 가상 주소가 네 수준의 페이지 테이블(PML4, PUD, PMD, PT)을 사용하여 물리 주소로 어떻게 변환되는지 설명
    - 각 페이지 테이블 항목의 레이아웃과 의미를 보여주며, 거대한 페이지를 설명하고 GDB를 사용하여 단계별로 가상 주소를 탐색하는 예제를 제공
  - 질문:
    - x86_64 주소 변환에 사용되는 네 가지 페이지 테이블 레벨은 무엇인가요?
    - 페이지 테이블 항목은 무엇을 인코딩하고 있나요 (예: 물리 주소, 권한 등)?
    - x86_64에서 일반 페이지와 거대 페이지의 크기는 어떻게 되나요?
    - 최상위 페이지 테이블 (PML4)의 물리 주소를 저장하는 레지스터는 무엇인가요?
    - 가상 주소에서 각 페이지 테이블 레벨로의 인덱스는 어떻게 계산되나요?
- [RSA is deceptively simple (and fun)](https://ntietz.com/blog/rsa-deceptively-simple/)
  - 요약
    - 이 문서는 처음부터 RSA 암호화를 구현하는 방법에 대해 논의
    - 이는 RSA를 위해 소수 p와 q를 선택하고 모듈러 n 및 totient t를 계산하며, 공개 및 개인 키를 생성하는 방법을 설명
    - 그런 다음 메시지를 정수로 인코딩하고 이를 지수로 n으로 나눈 나머지로 암호화하고, 개인 키로 복호화하는 방법을 보여줌
    - 또한 메시지 인코딩에 관한 몇 가지 문제와 RSA가 직접 사용되어서는 안 되며 하이브리드 암호 시스템의 일부로 사용되어야 함을 강조
  - 질문:
    - RSA 공개 키와 개인 키의 구성 요소는 무엇인가요?
    - 공개 및 개인 지수인 e와 d는 수학적으로 어떻게 관련되어 있나요?
    - 모듈러 n이 주어졌을 때 RSA로 직접 암호화할 수 있는 메시지의 최대 크기는 얼마인가요?
    - 어떤 메시지 인코딩 체계들이 언급되었으며 그 중 하나가 갖는 문제는 무엇인가요?
    - 문서에 따르면 왜 RSA가 직접적으로 암호화에 사용되지 말아야 하는지는 무엇인가요?

## References

- [Understanding x86_64 Paging](https://zolutal.github.io/understanding-paging/)
- [RSA is deceptively simple (and fun) | nicole@web](https://ntietz.com/blog/rsa-deceptively-simple/)
