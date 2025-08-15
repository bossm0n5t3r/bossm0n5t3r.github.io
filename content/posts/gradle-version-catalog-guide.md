+++
date = 2025-08-15T11:00:00+09:00
title = "Gradle Version Catalog 완벽 가이드: 기본부터 팀 거버넌스까지"
authors = ["Ji-Hoon Kim"]
tags = ["gradle", "version-catalog", "dependency-management", "build"]
categories = ["gradle", "version-catalog", "dependency-management", "build"]
series = ["gradle"]
+++

![](/images/logos/LOGO-GRADLE.png)

## Introduction

Gradle Version Catalog는 이제 선택이 아닌 표준입니다. Gradle 7.4에서 정식 기능으로 채택된 이후, Gradle 8.x를 거치며 더욱 안정화되었고, 곧 출시될 Gradle 9.0에서는
핵심적인 빌드 구성 요소로 자리 잡았습니다. 이 글에서는 기본 개념부터 대규모 프로젝트를 위한 고급 전략, 그리고 **팀의 협업 문화를 바꾸는 거버넌스**까지 모든 것을 다룹니다.

## 1. Version Catalog, 그래서 그게 뭔데?

### 한눈에 보는 Before & After

Version Catalog를 처음 접하신다면, 가장 간단한 변화부터 살펴보는 것이 좋습니다.

- Before: 복잡하고 오류에 취약한 문자열
  - `implementation("org.springframework.boot:spring-boot-starter-web:3.2.1")`
- **After: 깔끔하고 타입 세이프한 코드**
  - `implementation(libs.spring.boot.starter.web)`

이처럼 Version Catalog는 복잡한 의존성 문자열을 중앙에서 관리하고, 코드에서는 명확하고 안전한 방식으로 참조할 수 있게 해주는 기능입니다.

### Version Catalog의 구조

모든 의존성 정보는 `gradle/libs.versions.toml`이라는 단일 파일에서 중앙 관리됩니다.

- **[versions]**: 버전 변수를 정의합니다.
- **[libraries]**: 라이브러리 좌표를 정의합니다.
- **[bundles]**: 여러 라이브러리를 묶습니다.
- **[plugins]**: Gradle 플러그인을 정의합니다.

Gradle은 이 TOML 파일을 기반으로 타입 세이프한 접근자(`libs.*`)를 자동으로 생성하여, IDE의 강력한 지원을 받을 수 있습니다.

- **참조 링크**
  - [Gradle Version Catalog 공식 문서](https://docs.gradle.org/current/userguide/version_catalogs.html)

## 2. 왜 Version Catalog를 사용해야 하는가?

- **중앙집중식 관리**
  - 버전 업그레이드 시 TOML 파일 한 곳만 수정하면 모든 모듈에 반영됩니다. 이는 프로젝트의 일관성을 유지하는 데 결정적입니다.
- **빌드 성능 향상**
  - `buildSrc` 방식과 비교할 때 큰 이점이 있습니다.
  - 예를 들어, 100개 모듈을 가진 프로젝트에서 `buildSrc`의 유틸리티 함수 하나를 수정하면 100개 모듈 전체의 빌드 캐시가 무효화될 수 있습니다.
  - 반면, Version Catalog는 의존성 그래프에 따라 영향을 받는 모듈만 재빌드하므로 **반복적인 빌드 시간을 수 분 이상 단축**시킬 수 있습니다.
- **신속한 보안 대응**
  - **Log4Shell과 같은 치명적인 취약점이 발견되었을 때, Version Catalog의 진가가 드러납니다.**
  - 여러 `build.gradle`에 흩어져 있는 버전을 찾는 것은 재앙에 가깝습니다.
  - 하지만 Version Catalog를 사용하면 `libs.versions.toml` 파일의 **단 한 줄**만 수정하고 모든 모듈에 즉시 패치를 적용할 수 있어 신속한 보안 대응이 가능합니다.
- **타입 세이프티와 가독성**
  - `implementation(libs.spring.boot.starter.web)` 처럼 명시적이고 오타 없는 스크립트를 작성할 수 있어 휴먼 에러를 원천적으로 방지합니다.
- **프로젝트 간 공유**
  - TOML 파일을 Git Submodule 등으로 관리하여 여러 프로젝트에서 동일한 의존성 세트를 공유하고 표준화할 수 있습니다.

## 3. 대규모 프로젝트를 위한 고급 전략

### 1. Convention Plugin과 `buildSrc`에서 Catalog 활용하기

`buildSrc`나 Convention Plugin은 독립된 빌드 단위이므로, 기본적으로 메인 빌드의 `libs` 접근자를 직접 참조할 수 없습니다.

**해결책**: `settings.gradle.kts`에서 Version Catalog를 `buildSrc`의 `dependencyResolutionManagement`에 연결해줍니다.

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
    versionCatalogs {
        create("libs") {
            from(files("gradle/libs.versions.toml"))
        }
    }
}
```

### 2. 멀티 Catalog 전략과 대규모 TOML 관리

프로젝트가 커지면 하나의 TOML 파일이 수백 줄을 넘어갈 수 있습니다. 이때는 기능/팀별로 Catalog를 분리하는 **멀티 Catalog 전략**을 사용하거나, 파일 내에서 가독성을 높이는 방법을 사용해야
합니다.

- **주석을 활용한 그룹화**: TOML 파일 내에서 `# Spring Boot Core`, `# Testing Libraries`와 같이 주석으로 관련 라이브러리를 묶어 가독성을 확보하세요.
- **별칭(Alias) 정책 수립**: `libs.spring.boot.starter.web`처럼 긴 이름 대신 `libs.spring.web`처럼 짧은 별칭을 사용할 수 있습니다. 단, 팀 내에서 명시성이
  저하되지 않도록 명확한 네이밍 컨벤션을 합의해야 합니다.

## 4. 주요 한계와 실무 이슈 해결

### 1. 캐시 무효화 이슈 (여전히 진행 중)

가장 잘 알려진 한계점입니다. `libs.versions.toml`에 라이브러리를 추가/제거하면 Gradle이 생성하는 `libs` 접근자 코드가 변경되어 **빌드 캐시가 전체 무효화**됩니다.

> 해결 노력: Gradle 팀은 이 문제를 인지하고 있으며, 이슈 트래커에서 관련 논의가 활발히 진행 중입니다. 근본적인 해결 전까지는 원격 캐시(Gradle Enterprise 등) 활용으로 영향을 완화할 수
> 있습니다.
>

### 2. Dynamic Version 사용 불가

Version Catalog는 `1.+`, `latest.release`와 같은 동적 버전을 지원하지 않습니다. 이는 **빌드의 재현성(Reproducibility)** 을 보장하기 위한 설계적 선택입니다.

> 권장 대안: dependency locking 기능을 사용하세요.
>

- **참조 링크**
  - [GitHub Issue: build cache invalidation 현상](https://github.com/gradle/gradle/issues/29998)
  - [Gradle Discuss: 해당 이슈 토론](https://discuss.gradle.org/t/adding-library-to-version-catalog-changes-build-classpath-therefore-invalidates-build-cache/48893/16)

## 5. 팀을 위한 Version Catalog 운영 전략 (거버넌스)

기술 도입의 성패는 사람이 결정합니다. Version Catalog를 성공적으로 안착시키려면 명확한 규칙과 프로세스가 필요합니다.

### 1. `CODEOWNERS` 지정

`gradle/libs.versions.toml` 파일의 변경을 승인할 책임자를 지정하여 무분별한 의존성 추가를 막고, 전문적인 검토를 보장합니다.

`.github/CODEOWNERS`

```kotlin
# 모든 gradle / libs . versions . toml 파일 변경은 build - masters 팀의 리뷰가 필요합니다 .
gradle / libs.versions.toml @my-org/build-masters
```

### 2. Pull Request 템플릿 활용

새로운 라이브러리 추가 시, PR 본문에 반드시 포함해야 할 내용을 템플릿화하여 협업의 질을 높입니다.

`.github/PULL_REQUEST_TEMPLATE.md`

```kotlin
### 어떤 라이브러리를 추가했나요?

### 왜 이 라이브러리가 필요한가요?

### 라이선스를 확인했나요? (Apache 2.0, MIT 등)

### 보안 취약점 검토를 완료했나요?
```

### 3. 의존성 자동 업데이트 (Renovate/Dependabot)

`Renovate`나 `Dependabot` 같은 도구를 Version Catalog와 연동하여 의존성을 안전하게 최신으로 유지하는 파이프라인을 구축하세요.

## 6. 우리 팀에 바로 적용하기: Action Checklist

이 글을 읽고 바로 실천할 수 있는 체크리스트입니다.

- [ ]  팀원들과 함께 `libs.versions.toml`의 네이밍 컨벤션 합의하기
- [ ]  `gradle/libs.versions.toml` 파일에 대한 `CODEOWNERS` 설정하기
- [ ]  신규 의존성 추가를 위한 PR 템플릿 만들기
- [ ]  점진적 마이그레이션을 위한 첫 번째 대상 모듈 1~2개 선정하기
- [ ]  자동 의존성 업데이트 도구(Renovate 등) 연동 계획 수립하기

## 결론: 기술을 넘어 문화로

Version Catalog는 단순히 의존성 버전을 관리하는 도구를 넘어, **우리 팀의 빌드 시스템을 투명하게 만들고, 의존성 관리에 대한 논의를 활성화하며, 궁극적으로 더 안정적이고 안전한 소프트웨어를 만드는
문화적 기반**이 될 것입니다.

기술 도입의 최종 목표는 더 나은 협업과 더 높은 품질의 제품입니다. Version Catalog는 그 목표를 향한 여정에서 가장 강력한 무기 중 하나입니다.

## **참고자료 모음**

- **공식 문서 및 릴리즈 노트**
  - [Gradle Version Catalog 공식 문서](https://docs.gradle.org/current/userguide/version_catalogs.html)
  - [Gradle Release Notes](https://docs.gradle.org/current/release-notes.html)
- **발표 자료**
  - [Getting your Gradle setup right, at the right time | Kotlin by JetBrains (YouTube)](https://www.youtube.com/watch?v=QSoG8OaCSgw)
- **커뮤니티 토론 및 이슈 트래커**
  - [Gradle Discuss: 빌드 캐시 무효화 이슈](https://discuss.gradle.org/t/adding-library-to-version-catalog-changes-build-classpath-therefore-invalidates-build-cache/48893/16)
  - [GitHub Issue: catalog 변경 시 빌드 캐시](https://github.com/gradle/gradle/issues/29998)
