---
layout: post
title: "정보보안기사 필기 정리 - 4과목"
description: "암호학"
categories: [정보보안기사]
tags: [정보보안기사]
redirect_from:
  - /2019/12/27/
math: true
published: false
---

# Part 02. 암호학

# Section 02. 암호학 개요

## 1. 암호학의 기본 개념

### 1. 암호학(Cryptology)의 정의

> 암호란?<br>
> 약속된 당사자 또는 집단에서만 암호문에 내포된 내용을 알 수 있게 하는 일종의 문서

> 암호학(Cryptology)이란?<br>
> 평문을 다른 사람이 알아볼 수 없는 형태의 암호문으로 만들고
> 특정한 비밀키를 알고 있는 사람만이 다시 평문으로 복원시킬 수 있도록 하는 암호기술(cryptography)과
> 이를 제3자(도청자)가 해독하는 방법을 분석하는 암호해독(cryptanalysis)에 관하여 연구하는 학문

### 2. 암호에서 사용하는 이름

- 앨리스와 밥(Alice and Bob)
  - 일반적으로 앨리스는 메시지를 전송하고 밥이 수신하는 모델에 사용
  - RSA를 만든 사람 중 하나인 Ron Rivest가 처음으로 사용
- 이브(Eve)
  - 도청자(eavesdropper)
  - 소극적인 공격자
  - 앨리스와 밥 사이에 이루어지는 통신을 도청하기는 하지만 통신 중인 메시지를 수정 못함
- 멜로리(Mallory)
  - 악의를 가진(malicious) 공격자
  - 메시지 수정 가능
  - 자신의 메시지로 대체한 이전의 메시지를 재전송 가능
- 트렌트(Trent)
  - 신뢰할 수 있는 중재자(trusted arbitrator)
  - 중립적인 위치에 있는 제3자

### 3. 송신자, 수신자, 도청자

어떤 사람이 다른 사람에게 정보를 보낼때

- 보내는 사람
  - 송신자(sender)
- 받는 사람
  - 수신자(receiver)
- 송신된 정보
  - 메시지(message)
- 적극적인 공격자 멜로리는 전송 중인 메시지를 갈취한 다음 내용을 수정해서 수신자에게 송신가능
- 도청자 이브(eavesdropper)는 반드시 사람만 의미하는 것은 아님
  - 통신기기에 장치된 도청용 기계도 가능
  - 메일 소프트웨어나 메일 서버에 설치된 프로그램 일수도 있다.

### 4. 암호화와 복호화

<img src="/assets/img/posts/2019-12-27-information-security-4/In_Page_Encryption_Decryption_Diagram_700.png">

- 평문(plaintext) -> 암호화(Encrypt) -> 암호문(ciphertext)
- 평문(plaintext) <- 복호화(Decrypt) <- 암호문(ciphertext)
- 암호(cryptography)라는 기술을 사용해서 정보의 기밀성(confidentiality, 비밀성)을 유지

### 5. 암호화와 복호화의 기호적 표현

|                 기호                  |                       의미                       |
| :-----------------------------------: | :----------------------------------------------: |
|                M or P                 |                       평문                       |
|                   C                   |                      암호문                      |
|                   E                   |                 암호화 알고리즘                  |
|                   D                   |                 복호화 알고리즘                  |
|                   K                   |                        키                        |
| $$ C = E_k(P) $$ or $$ C = E(K, P) $$ | 평문 P를 키 K로 암호화하여(E) 암호문 C를 얻는다. |
| $$ P = D_k(C) $$ or $$ P = D(K, C) $$ | 암호문 C를 키 K로 복호화하여(D) 평문 P를 얻는다. |
