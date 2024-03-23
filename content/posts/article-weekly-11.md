+++ 
date = 2024-03-16T20:00:00+09:00
title = "Article Weekly, Issue 11"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-03-10` ~ `2024-03-16`

## Lessons Learned in Software Development

- 개발
  - 작게 시작한 후 확장하기
  - 한 번에 하나씩 변경하기
  - 로깅과 에러 처리를 조기에 추가하기
  - 새로운 코드 라인은 최소 한 번은 실행되어야 함
  - 전체를 테스트하기 전에 부분을 테스트하기
  - 모든 일은 생각보다 오래 걸림
  - 기존 코드를 먼저 이해하기
  - 읽고 실행하기
- 문제 해결
  - 버그는 항상 존재함
  - 문제 보고서 해결하기
  - 문제 재현하기
  - 알려진 오류를 수정한 후 남은 것을 확인하기
  - 우연의 일치가 없다고 가정하기
  - 타임스탬프와 상관관계 맺기
- 협력
  - 대면이 가장 높은 대역폭을 가짐
  - 러버덕 디버깅
  - 물어보기
  - 공로 공유하기
- 기타
  - 시도해보기
  - 잠자기
  - 변화
  - 계속 배우기

## Why Facebook doesn’t use Git

- 이 글의 저자는 기존에는 Git에 대해 당연시 여겼지만, Mercurial과 Facebook의 "stacked diffs" 워크플로우에 대한 팀원들의 설득으로 Mercurial을 채택하고 자사 스타트업의 방향을 변경하게 됨
- Facebook은 Git 대신 Mercurial을 채택한 이유
  - 성능보다는 협업에 더 열린 코드베이스와 유지보수자에 대한 긍정적 인상 때문
  - 기술 결정은 기술적이 아닌 인간적 요소에 의해 주도된다는 고전적인 지혜를 상기시킴
- 디벨로퍼로서의 인간미와 개방성은 기술 도구의 역사에 기여할 때 발휘되는 중요한 가치임을 강조
- Mercurial-style stacked diffs를 Git과 GitHub에 적용하여 이 가치를 지키겠다는 의지를 표명함

## References

- https://henrikwarne.com/2015/04/16/lessons-learned-in-software-development/
- https://graphite.dev/blog/why-facebook-doesnt-use-git
