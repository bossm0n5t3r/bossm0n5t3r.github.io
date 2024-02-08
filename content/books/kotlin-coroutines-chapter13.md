+++ 
date = 2024-02-08T15:00:00+09:00
title = "[Kotlin Coroutines] 13장. 코루틴 스코프 만들기"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## CoroutineScope 팩토리 함수

- CoroutineScope 는 coroutineContext 를 유일한 프로퍼티로 가지고 있는 인터페이스

```kotlin
public interface CoroutineScope {
    /**
     * The context of this scope.
     * Context is encapsulated by the scope and used for implementation of coroutine builders that are extensions on the scope.
     * Accessing this property in general code is not recommended for any purposes except accessing the [Job] instance for advanced usages.
     *
     * By convention, should contain an instance of a [job][Job] to enforce structured concurrency.
     */
    public val coroutineContext: CoroutineContext
}
```

- 코루틴 스코프 객체를 만드는 가장 쉬운 방법은 CoroutineScope 팩토리 함수를 사용하는 것
  - 이 함수는 컨텍스트를 넘겨 받아 스코프를 만듦
  - 잡이 컨텍스트에 없으면 구조화된 동시성을 위해 Job 을 추가할 수도 있음

## 안드로이드에서 스코프 만들기

- skip

## viewModelScope 와 lifecycleScope

- skip

## 백엔드에서 코루틴 만들기

- 많은 백엔드 프레임워크에서 중단 함수를 기본적으로 지원
  - 스프링 부트
    - 컨트롤러 함수가 suspend 로 선언되는 걸 허용
  - Ktor
    - 모든 핸들러는 기본적으로 중단 함수
- 따로 스코프를 만들 필요가 없음
- 그럴 필요가 있다면 다음과 같은 것들이 필요
  - 스레드 풀 (또는 Dispatchers.Default) 을 가진 커스텀 디스패처
  - 각각의 코루틴을 독립적으로 만들어 주는 SupervisorJob
  - 적절한 에러 코드에 응답하고, 데드 레터를 보내거나, 발생한 문제에 대해 로그를 남기는 CoroutineExceptionHandler
- 생성자를 통해 커스텀하게 만들어진 스코프를 클래스로 주입되는 방법이 가장 많이 사용됨
- 스코프는 한 번만 정의되면 수많은 클래스에서 활용될 수 있으며, 테스트를 위해 다른 스코프로 쉽게 대체할 수도 있음

## 추가적인 호출을 위한 스코프 만들기

- 추가적인 연산을 하기 위한 스코프는 함수나 생성자의 인자를 통해 주로 주입됨
- 스코프를 호출을 중단하기 위한 목적으로만 사용하려는 경우 SupervisorScope 를 사용하는 것만으로 충분함
- 모든 예외는 로그를 통해 볼 수 있으므로, 예외를 관제 시스템으로 보내고 싶다면 CoroutineExceptionHandler 를 사용해야 함
- 다른 디스패처를 사용하는 것 또한 자주 사용하는 커스텀 방법
- 스코프에서 블로킹 호출을 한다면 Dispatchers.IO 를 사용

## 요약

- 일반적인 상황에서 스코프를 만드는 방법에 대해 알게 되었을 것
- 현업에서 코루틴을 사용할 때 스코프를 만드는 건 중요
- 지금까지 배운 것으로도 작고 간단한 애플리케이션을 만드는 데는 충분하지만, 좀 더 거대한 프로젝트를 진행한다면 적절한 동기화와 테스트라느느 두 가지 주제에 대해 알아야 함
