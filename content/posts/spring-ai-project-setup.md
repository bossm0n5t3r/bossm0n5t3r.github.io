+++
date = 2024-09-27T23:00:00+09:00
title = "[Spring AI] 프로젝트 만들기"
authors = ["Ji-Hoon Kim"]
tags = ["Spring AI"]
categories = ["Spring AI"]
series = ["Spring AI"]
+++

## Introduction

- Spring AI 를 활용한 프로젝트를 만들어보면서 배운 내용을 별도의 repo 에 정리하고자 한다.
- 우선 해당 repo 를 만들어도록 한다.

## 프로젝트 생성하기

- Spring AI 프로젝트를 생성하는 방법은 크게 3가지가 있다.
  1. 단순하게 gradle, maven 프로젝트부터 생성한 후 직접 라이브러리 추가
  2. spring initializer (https://start.spring.io/) 를 통해 생성
  3. IntelliJ 를 통해 Spring Boot 프로젝트 생성
     - 이 방법도 결국 https://start.spring.io/ 를 통해 생성하는 것과 동일하다.
- 필자는 간단하게 IntelliJ 를 통해 생성하도록 하겠다.

![0.png](/images/posts/spring-ai-project-setup/0.png)

![1.png](/images/posts/spring-ai-project-setup/1.png)

- 추가한 기본 라이브러리는 아래와 같다.
  - Docker Compose Support
    - H2 를 사용해도 되지만, 나중에는 Vector Database 도 사용할 것 같아, 처음부터 compose 를 사용한 Database 를 가볍게 사용하고자 추가했다.
  - Spring Web
    - 기본적인 통신은 Restful API 를 통해 처리하고자 추가했다.
  - Spring Data JPA
    - 가장 많이 사용하는 ORM 인 JPA 를 추가했다.
  - PostgreSQL Driver
    - Database 는 PostgreSQL 을 사용하고자 추가했다.
  - OpenAI
    - 다양한 AI 서비스 API 가 있지만, 가장 많이 사용하는 ~~사용할 것 같은~~ OpenAI 를 추가했다.

## 추가 설정

- 기본적으로 프로젝트를 생성해주만, 기계적으로 만들어주는 부분이라 손을 조금 대야할 부분들이 있다.
- 아래는 필자의 개인 취향도 포함된 추가설정 부분이라, 본인이 만족하는 수준에서 끝내도 충분하다.
- **전제조건은 서버를 실행했을 때 아무런 문제 없이 정상적으로 실행이 되어야 한다는 것이다.**

### JDK 버전 설정

- JDK 버전은 21 로 했기 때문에, jenv local 설정을 추가해주었다.

### Kotlin 버전 설정

- 현재 최신 버전인 `2.0.20` 으로 설정했다.

### Gradle 버전 설정

- 현재 최신 버전인 `8.10.1` 으로 설정했다.

### Spring AI bom 버전 설정

- 공식 문서의 버전인 `1.0.0-SNAPSHOT` 버전으로 설정했다.
- 그러기 위해서는 아래 추가가 필요하다.
- AS-IS

  ```kotlin
  repositories {
      mavenCentral()
      maven { url = uri("https://repo.spring.io/milestone") }
  }

  extra["springAiVersion"] = "1.0.0-M2"
  ```

  ![2.png](/images/posts/spring-ai-project-setup/2.png)

- TO-BE

  ```kotlin
  repositories {
      mavenCentral()
      maven { url = uri("https://repo.spring.io/milestone") }
      **maven { url = uri("https://repo.spring.io/snapshot") }**
  }

  **extra["springAiVersion"] = "1.0.0-SNAPSHOT"**
  ```

  ![3.png](/images/posts/spring-ai-project-setup/3.png)

### Ktlint 설정

- gradle ktlint 을 추가해주고, ktlint 버전만 설정하고 실행

```kotlin
plugins {
    kotlin("jvm") version "2.0.20"
    kotlin("plugin.spring") version "2.0.20"
    id("org.springframework.boot") version "3.3.4"
    id("io.spring.dependency-management") version "1.1.6"
    kotlin("plugin.jpa") version "2.0.20"
    id("org.jlleitschuh.gradle.ktlint") version "12.1.1"
}

...

ktlint {
    version.set("1.3.1")
}
```

### compose.yml 수정

- 현재 기본적으로 아래와 같이 작성되어 있다.

```yaml
services:
  postgres:
    image: 'postgres:latest'
    environment:
      - 'POSTGRES_DB=mydatabase'
      - 'POSTGRES_PASSWORD=secret'
      - 'POSTGRES_USER=myuser'
    ports:
      - '5432'
```

- 이러면 기존 다른 docker 와 충돌이 발생할 수 있으므로, 아래와 같이 가볍게 수정을 했다.

```yaml
services:
  postgres:
    container_name: 'kotlin-spring-ai-postgres'
    image: 'postgres:latest'
    environment:
      - 'POSTGRES_DB=kotlin_spring_ai_database'
      - 'POSTGRES_PASSWORD=postgres'
      - 'POSTGRES_USER=postgres'
    ports:
      - '54324:5432'
```

### application.properties 를 application.yaml 로 수정

- 기본적으로 yaml 를 구조를 선호하기에 수정했다.

### application.yaml 에 spring.ai.openai.api-key 추가

- 현재 상태에서 서버를 가볍게 실행하면 위의 api-key 설정이 누락되어 있어서 정상적으로 실행이 되지 않는다.
- 아래처럼 property 를 추가해주자.

```yaml
spring:
  application:
    name: kotlin-spring-ai-playground
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}
```

- 값만 존재하면 되므로, 위의 상태에서는 문제 없이 서버가 실행될 것이다.

## Conclusion

- 이제 프로젝트 설정은 끝났다.
- 마지막으로 꼭 서버를 실행해서 잘 실행되는지 확인해보자.
- 이제 가볍게 OpenAI 통신부터 시작하겠다.
