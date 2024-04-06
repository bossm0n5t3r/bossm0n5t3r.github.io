+++ 
date = 2024-04-07T02:30:00+09:00
title = "Article Weekly, Issue 14"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-03-31` ~ `2024-04-06`

## **Modern Git Commands and Features You Should Be Using**

- 최근에 추가된 몇 가지 Git 명령어를 소개
- `git switch`
  - 브랜치 전환시 사용
  - 이전에는 git checkout을 사용했지만, git switch는 브랜치 전환만 수행하며 추가적인 안정성 검사를 수행
- `git restore`
  - 파일을 마지막 커밋된 버전으로 복원하는 데 사용
  - https://git-scm.com/docs/git#_reset_restore_and_revert
- `git sparse-checkout`
  - 작업 트리를 추적된 파일의 하위 집합으로 줄임
  - https://github.blog/2020-01-17-bring-your-monorepo-down-to-size-with-sparse-checkout/
- `git worktree`
  - 동일한 저장소에 연결된 여러 작업 트리를 관리
  - https://opensource.com/article/21/4/git-worktree
- `git bisect`
  - 버그가 도입된 커밋을 식별하는 데 사용되는 명령어
  - '나쁜' 커밋과 '좋은' 커밋 또는 태그를 제공하여 git이 중간 커밋을 체크아웃하도록 할 수 있음
  - 이후 테스트를 통해 각 커밋이 버그를 포함하는지 여부를 확인하고, git bisect good 또는 git bisect bad를 사용하여 git에게 커밋이 문제를 도입했는지 여부를 알림
  - 이 과정을 반복하여 git이 문제가 도입된 정확한 커밋을 식별하도록 함
  - https://git-scm.com/docs/git-bisect

## **LLaMA Now Goes Faster on CPUs**

- LLaMA의 CPU에서의 속도 향상됨
- Mozilla의 llamafile 프로젝트에서 84개의 새로운 행렬 곱셈 커널을 작성함
- F16과 Q8_0 가중치를 CPU에서 사용할 때 llama.cpp에 비해 프롬프트 평가 시간이 30%에서 500% 더 빨라짐

## **Timeline of the xz open source attack**

- xz 오픈소스 공격에 대한 타임라인 정리

## **HTTP/2 `CONTINUATION` Flood: Technical Details**

- CONTINUITION Flood에 대한 심층적인 기술 분석: 수많은 HTTP/2 프로토콜 구현 내의 취약성 클래스
- 많은 경우 Rapid Reset에 비해 더 심각한 위협이 됨
- 단일 시스템(및 특정 경우에는 단일 TCP 연결 또는 소수의 프레임)은 서버 가용성을 방해할 가능성이 있으며 서버 충돌에서 상당한 성능 저하에 이르기까지 다양한 결과를 초래함
- 공격을 구성하는 요청은 HTTP 액세스 로그에 표시되지 않음
- 간단한 보안 조언과 영향을 받는 프로젝트 목록은 HTTP/2 CONTINUITION Flood에서 찾을 수 있음

## References

- https://martinheinz.dev/blog/109
- https://justine.lol/matmul/
- https://research.swtch.com/xz-timeline
- https://nowotarski.info/http2-continuation-flood-technical-details/
