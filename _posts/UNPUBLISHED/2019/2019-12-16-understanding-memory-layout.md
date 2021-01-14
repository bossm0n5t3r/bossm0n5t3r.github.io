---
layout: post
title: "Understanding Memory Layout"
description: "Understanding Memory Layout"
categories: [메모리, Memory]
tags: [메모리, Memory]
redirect_from:
  - /2019/12/16/
math: false
published: false
---

# Understanding Memory Layout

## 메모리 구조

- 프로그램이 실행되기 위해서는 프로그램이 메모리에 로드(load)
- 프로그램에서 사용되는 변수들을 저장할 메모리도 필요
- 따라서 OS는 프로그램의 실행을 위해 다양한 메모리 공간을 제공
- 프로그램이 운영체제로부터 할당받는 대표적인 메모리 공간은 다음과 같음
  - 1. 스택(Stack) 영역
  - 2. 힙(Heap) 영역
  - 3. 데이터(Data) 영역
  - 4. 코드(Code) 영역

<img src="/assets/img/posts/2019-12-16-understanding-memory-layout/memory_layout.png">

## Stack

- 스택공간은 OS 커널 공간 바로 밑에 위치
- 일반적으로 힙 공간과 반대편에 위치해있음
- 낮은 주소방향으로 할당
- LIFO(Last-In-First-Out) 자료구조
- 컴퓨터 과학에서는 원소들의 collection 기능을 수행하는 추상적인 데이터 타입으로서, 다음의 2가지 중요한 기능을 수행
  - push
    - collection 으로 원소를 추가
  - pop
    - 아직 제거되지 않은 가장 최근에 추가된 원소를 제거
- 이 공간은 프로그램 안에서 함수의 호출에 필요한 모든 data를 저장
- 함수의 호출과 함께 **할당**, 함수의 호출이 완료되면 **소멸**
- 스택 프레임 (stack frame)
  - 함수 호출에 의해서 넣어진 dataset
  - 다음의 data를 포함
    - 함수의 매개변수
    - 호출이 끝난 뒤 돌아갈 반환 주소값
    - 함수에서 선언된 지역 변수

## Heap

## References

- [https://medium.com/@shoheiyokoyama/understanding-memory-layout-4ef452c2e709](https://medium.com/@shoheiyokoyama/understanding-memory-layout-4ef452c2e709)
- [http://tcpschool.com/c/c_memory_structure](http://tcpschool.com/c/c_memory_structure)
- [https://www.geeksforgeeks.org/memory-layout-of-c-program/](https://www.geeksforgeeks.org/memory-layout-of-c-program/)
- [https://sfixer.tistory.com/entry/%EB%A9%94%EB%AA%A8%EB%A6%AC-%EC%98%81%EC%97%ADcode-data-Stack-Heap](https://sfixer.tistory.com/entry/%EB%A9%94%EB%AA%A8%EB%A6%AC-%EC%98%81%EC%97%ADcode-data-Stack-Heap)
- [https://m.blog.naver.com/PostView.nhn?blogId=yoonjinym&logNo=30089450819&proxyReferer=https%3A%2F%2Fwww.google.co.kr%2F](https://m.blog.naver.com/PostView.nhn?blogId=yoonjinym&logNo=30089450819&proxyReferer=https%3A%2F%2Fwww.google.co.kr%2F)
- [https://en.wikipedia.org/wiki/Data_segment](https://en.wikipedia.org/wiki/Data_segment)
- [https://gabrieletolomei.wordpress.com/miscellanea/operating-systems/in-memory-layout/](https://gabrieletolomei.wordpress.com/miscellanea/operating-systems/in-memory-layout/)
- [https://wayhome25.github.io/cs/2017/04/13/cs-15-1/](https://wayhome25.github.io/cs/2017/04/13/cs-15-1/)
