+++
date = 2024-12-25T04:00:00+09:00
title = "Article Weekly, Issue 51"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-12-15` ~ `2024-12-21`

## Why Go Should Sometimes Be a No-Go

- Go 언어의 문제점과 한계에 대한 개발자의 개인적 견해
- Go의 주요 문제점:
  - 지루함: 단순한 문법이 오히려 단점으로 작용
  - 기본 기능의 부족: 필터, 맵, 리듀스 등 기본적인 기능 부재
  - 클린 코드 원칙 위배: 에러 처리 방식으로 인한 코드 복잡성 증가
  - DIY(Do It Yourself) 강요: 기본 라이브러리 부족으로 많은 기능을 직접 구현해야 함
  - 패키지 생태계 미성숙: 많은 프로젝트가 미완성 또는 유지보수 중단 상태
- 추가적인 문제점:
  - 일관성 없는 코딩 스타일: 테스트 작성 방식 등에서 다양한 접근법 존재
  - 디버깅의 어려움: 표현식 평가, 스택 트레이스 해석 등이 불편함
  - 도메인 주도 설계(DDD) 구현의 어려움
- 결론:
  - Go는 인프라 작업에는 적합할 수 있으나, 대규모 애플리케이션 개발에는 부적합
  - 프로젝트 성격에 따라 Go 사용 여부를 신중히 결정해야 함

## Elixir v1.18.0-rc.0 released

- Elixir v1.18.0-rc.0 주요 변경사항
- 타입 시스템 개선:
  - 함수 호출의 타입 체킹 도입
  - 패턴과 반환 타입의 점진적 추론
  - 타입 불일치 경고 기능 추가
- ExUnit 개선:
  - 매개변수화된 테스트 지원
  - 테스트 그룹 기능 도입
- JSON 지원:
  - 내장 JSON 인코딩/디코딩 기능 추가
  - `JSON.Encoder` 프로토콜 지원
- 언어 서버 리스너:
  - 컴파일러 락 도입으로 중복 컴파일 방지
  - 컴파일 결과 공유 기능
- 기타 개선사항:
  - `mix format --migrate` 명령어 추가
  - Windows용 PowerShell 스크립트 지원
  - 새로운 함수 및 모듈 추가 (예: `Duration.to_string/1`, `Registry.lock/3`)
- 주의사항:
  - WERL 지원 중단
  - 재귀적 변수 정의 제한
- 소프트/하드 deprecation 항목 다수 포함

## 스칼라 컴파일 속도 빠르게 하기

- 스칼라로 개발된 쿠키런: 킹덤 서버의 빌드 속도 개선 과정 소개
- 컴파일 속도 저하 요인
  - 프로젝트 규모 증가
  - 스칼라의 강력한 기능(타입 시스템, 매크로, implicit 등)
- 컴파일러 구조 설명
  - 프론트엔드, 피클러, 트랜스폼, 백엔드 단계로 구성
- Typeclass 인스턴스 정의 위치에 따른 컴파일 속도 영향
  - Companion 오브젝트에 정의 시 성능 향상
  - 프로파일링 결과: typer 페이즈 시간 67.1% → 52.8% 감소
  - 해당 서브 프로젝트 컴파일 속도 1.44배 향상 (65초 → 45초)
- Build Pipelining 적용
  - 서브 프로젝트 간 의존성 있을 때 병렬 컴파일 가능
  - sbt에서 `ThisBuild / usePipelining := true`로 활성화
- Pipelining 적용 시 주의사항
  - 매크로 사용 시 pipelining 불가능한 경우 존재
  - `exportPipelining` 옵션으로 순차적 컴파일 부분 조절 가능
- 결과
  - Typeclass 인스턴스를 companion 오브젝트에 정의하여 검색 시간 감소
  - Build pipelining으로 병렬성 확보
  - 전체 프로젝트 컴파일 속도 1.22배 향상

## SWEs how do you future-proof your career in light of LLMs?

- LLM이 소프트웨어 엔지니어링에 미치는 영향에 대한 Hacker News 토론 요약:
- 주요 우려사항:
  - 주니어-미드레벨 엔지니어 직무의 감소 가능성
  - LLM이 코드 생성과 프로젝트 전체 구현에 사용되는 추세
- LLM의 현재 능력:
  - 단순한 CRUD 애플리케이션과 보일러플레이트 코드 생성에 유용
  - 프로토타입 개발과 일회성 프로젝트에 도움됨
  - 복잡한 비즈니스 로직이나 대규모 시스템 설계에는 한계 있음
- LLM 사용의 장단점:
  - 장점: 생산성 향상, 빠른 프로토타이핑, 새로운 기술 학습 지원
  - 단점: 코드 품질 저하 가능성, 유지보수성 문제, 개발자의 학습 기회 감소
- 미래 전망:
  - LLM이 완전히 개발자를 대체하기는 어려울 것
  - 고급 개발자 스킬(시스템 설계, 복잡한 문제 해결 등)은 여전히 중요
  - LLM을 도구로 활용하는 능력이 중요해질 것
- 개발자 대응 전략:
  - 지속적인 학습과 기술 향상
  - LLM을 보조 도구로 활용하는 방법 습득
  - 비즈니스 이해도와 소프트 스킬 개발
  - 복잡한 시스템 설계와 아키텍처 능력 강화
- 결론:
  - LLM은 개발 프로세스를 변화시키고 있지만, 완전한 대체는 아직 멀었음
  - 개발자들은 LLM을 효과적으로 활용하면서 고유의 가치를 유지해야 함

## ISO 8583: The language of credit cards

- ISO 8583: 신용카드 통신의 표준 언어
- 주요 구성 요소:
  - Message Type Indicator (MTI)
    - 예: `0100` (승인 요청), `0110` (승인 응답)
    - 네트워크마다 직렬화 방식 다름 (BCD, ASCII, EBCDIC 등)
  - Bitmap
    - 어떤 필드가 메시지에 포함되었는지 표시
    - 예: `0110 1100`은 2, 3, 5, 6번 필드 존재 의미
  - 데이터 필드
    - 고정 길이 또는 가변 길이
    - 예: `000000002412`는 $24.12 의미
- 데이터 인코딩 주의사항:
  - BCD (Binary Coded Decimal) 사용 시 길이 표시 필요
  - 패딩 처리 주의 (예: `123`을 `0123`으로 잘못 해석하는 문제)
- 구현 예시 (Ruby 사용):
  - Sorbet의 `T::Struct` 클래스 활용한 타입 안전성 확보
  - 필드별 인코딩, 길이, 변환 규칙 정의
  - 태그-길이-값(TLV) 구조 지원
- 미래 호환성 고려:
  - 알려지지 않은 태그 처리를 위한 `missing_tags` 필드 구현
  - 서브메시지의 오류 처리 중요성
- 결론:
  - ISO 8583은 복잡하지만 체계적인 구현으로 관리 가능
  - 네트워크별 차이와 미래 변화에 대비한 유연한 설계 필요

## Java in the Small

- Java의 소규모 프로그램 및 스크립트 작성에 대한 장점 소개
  - 컴파일 타임 타이핑과 우수한 도구 지원이 핵심 기능
- Java 스크립트 작성의 이점:
  - JEP 330과 458로 `.java` 파일을 직접 실행 가능
  - JEP 477로 간소화된 프로그램 구조 (main 메소드만으로 실행 가능)
  - 자동 import 기능으로 코드 간소화
- 유용한 Java 기능:
  - 레코드와 열거형을 통한 데이터 구조화
  - var 키워드와 static import 활용
  - 텍스트 블록으로 데이터 포함 용이
- Java 라이브러리의 장점:
  - 문자열, 정규표현식, 컬렉션, 날짜/시간 처리 우수
  - Files, HTTPClient, 간단한 웹 서버 등 유용한 기능 제공
- 부족한 점:
  - JSON과 커맨드 라인 처리 라이브러리 부재
  - 체크된 예외 처리의 번거로움
- 개발 환경:
  - VS Code나 Emacs와 같은 중량 에디터 추천
  - IDE 사용 시 프로젝트 구조 간소화 방법 제시
- 서드파티 라이브러리 사용:
  - JBang을 통한 Maven 의존성 관리 용이
- Java 노트북:
  - Jupyter 노트북과 Java 커널 사용 가능
  - 탐색적 프로그래밍을 위한 도구로 발전 중
- 결론:
  - 적절한 도구를 사용하면 Java가 소규모 프로그램에 효과적
  - 컴파일 타임 타이핑과 확장성이 주요 장점

## OpenAI o3 Breakthrough High Score on ARC-AGI-Pub

- OpenAI의 새로운 o3 시스템 성과 발표
  - ARC-AGI-1 Public Training set으로 훈련
  - Semi-Private Evaluation set에서 75.7% 달성 (저효율 모드)
  - 고효율 모드에서 87.5% 달성
- o3 시스템의 주요 특징
  - 새로운 작업에 대한 적응 능력 향상
  - 자연어 프로그램 검색 및 실행 메커니즘 사용
  - 체인 오브 소트(CoT) 공간에서 프로그램 검색 수행
- ARC-AGI 벤치마크 결과
  - Semi-Private 세트: 75.7% (고효율), 87.5% (저효율)
  - Public 세트: 82.8% (고효율), 91.5% (저효율)
- o3의 의의
  - AI 능력의 큰 도약 표현
  - 새로운 작업 적응 능력 향상
  - LLM의 한계 극복 (지식 재조합 능력)
- 향후 과제
  - o3 시스템의 한계 및 확장성 연구 필요
  - ARC-AGI-2 벤치마크 개발 중 (2025년 출시 예정)
  - 오픈소스 복제 및 분석 중요성 강조
- 결론
  - o3는 AI 연구의 새로운 영역 개척
  - LLM 기반 자연어 프로그램 검색의 가능성 입증
  - AGI 연구에 중요한 이정표 제시

## References

- https://brainbaking.com/post/2024/12/why-go-should-sometimes-be-a-no-go/
- https://elixirforum.com/t/elixir-v1-18-0-rc-0-released/68015
- https://tech.devsisters.com/posts/improve-scala-compilation-speed/
- https://news.ycombinator.com/item?id=42431103
- https://increase.com/articles/iso-8583-the-language-of-credit-cards
- https://horstmann.com/unblog/2024-12-11/index.html
- https://arcprize.org/blog/oai-o3-pub-breakthrough
