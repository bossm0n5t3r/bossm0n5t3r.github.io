+++ 
date = 2024-02-23T02:03:00+09:00
title = "[Kotlin Coroutines] 19장. 플로우란 무엇인가?"
+++

![](/images/books/kotlin-coroutines/cover.webp)

## introduction

- 플로우는 비동기적으로 계산해야 할 값의 스트림
- Flow 인터페이스 자체는 떠다니는 원소들을 모으는 역할
- 플로우의 끝에 도달할 때까지 각 값을 처리하는 걸 의미

```kotlin
interface Flow<out T> {
		suspend fun collect(collector: FlowController<T>)
}
```

- Flow 의 유일한 멤버 함수는 collect
- 다른 함수들은 확장 함수로 정의되어 있음

## 플로우와 값들을 나타내는 다른 방법들의 비교

- Flow 의 개념은 RxJava 나 Reactor 를 사용하는 사람들은 잘 알고 있음

### 여러 개의 값을 반환하는 함수

- List 나 Set
  - 한 번에 모든 값을 만들 때는 List 나 Set 과 같은 컬렉션을 사용
  - List 와 Set 은 모든 원소의 계산이 완료된 컬렉션
- Sequence

  - 시퀀스는 (복잡한 결괏값을 계산하는 등의) CPU 집약적인 연산 또는 (파일을 읽는 등의) 블로킹 연산일 때 필요할 때마다 값을 계산하는 플로우를 나타내기에 적절
  - 시퀀스의 최종 연산은 중단 함수가 아니기 때문에, 시퀀스 빌더 내부에 중단점이 있다면 값을 기다리는 스레드가 블로킹됨
  - 따라서 sequence 빌더의 스코프에서 SequenceScope 의 리시버에서 호출되는 함수 (yield 와 yieldAll) 외의 중단 함수를 사용할 수 없음

  ```kotlin
  fun getSequence(): Sequence<String> = sequence {
     repeat(3) {
         delay(1000) // Compilation error
         yield("User$it")
     }
  }
  ```

  - 시퀀스를 잘못 사용하면 안되기 때문에 중단 함수를 사용할 수 없다는 제약 사항이 도입됨
  - 위 예제는 컴파일이 되더라도 최종 연산이 코루틴을 중단시키는 대신 스레드를 블로킹하여 생각지도 못한 스레드 블로킹이 발생할 수 있음
  - 시퀀스를 사용하기 적합한 경우
    - 데이터 소스의 개수가 많거나 (또는 무한정이거나)
    - 원소가 무거운 경우
    - 원소를 필요할 때만 계산하거나 읽는 지연 연산을 하게 되는 상황

  ```kotlin
  val fibonacci: Sequence<BigInteger> = sequence {
      var first = 0.toBigInteger()
      var second = 1.toBigInteger()
      while (true) {
          yield(first)
          val temp = first
          first += second
          second = temp
      }
  }

  fun countCharactersInFile(path: String): Int =
      File(path).useLines { lines ->
          lines.sumBy { it.length }
      }
  ```

  - 스레드 블로킹이 매우 위험하고 예기치 않은 상황을 유발할 수 있다고 느꼈을 것
  - 아래 예제
    - Sequence 를 사용했기 때문에 forEach 가 블로킹 연산이 됨
    - 같은 스레드에서 launch 로 시작된 코루틴이 대기하게 됨
    - 하나의 코루틴이 다른 코루틴을 블로킹하게 됨

  ```kotlin
  private fun getSequence(): Sequence<String> =
      sequence {
          repeat(3) {
              Thread.sleep(1000)
              // the same result as if there were delay(1000) here
              yield("User$it")
          }
      }

  @OptIn(ExperimentalCoroutinesApi::class, DelicateCoroutinesApi::class)
  suspend fun main() {
      withContext(newSingleThreadContext("main")) {
          launch {
              repeat(3) {
                  delay(100)
                  println("Processing on coroutine")
              }
          }

          val list = getSequence()
          list.forEach { println(it) }
      }
  }

  // (1 sec)
  // User0
  // (1 sec)
  // User1
  // (1 sec)
  // User2
  // Processing on coroutine
  // (0.1 sec)
  // Processing on coroutine
  // (0.1 sec)
  // Processing on coroutine
  ```

  - 이런 상황에서 Sequence 대신 Flow 를 사용해야 함

- Flow

  - 코루틴이 연산을 수행하는 데 필요한 기능을 전부 사용할 수 있음
  - 플로우의 빌더와 연산은 중단 함수
  - 구조화된 동시성과 적절한 예외 처리를 지원함

  ```kotlin
  private fun getFlow(): Flow<String> =
      flow {
          repeat(3) {
              delay(1000)
              emit("User$it")
          }
      }

  @OptIn(ExperimentalCoroutinesApi::class, DelicateCoroutinesApi::class)
  suspend fun main() {
      withContext(newSingleThreadContext("main")) {
          launch {
              repeat(3) {
                  delay(100)
                  println("Processing on coroutine")
              }
          }

          val list = getFlow()
          list.collect { println(it) }
      }
  }

  // (0.1 sec)
  // Processing on coroutine
  // (0.1 sec)
  // Processing on coroutine
  // (0.1 sec)
  // Processing on coroutine
  // (1 - 3 * 0.1 = 0.7 sec)
  // User0
  // (1 sec)
  // User1
  // (1 sec)
  // User2
  ```

  - 플로우는 코루틴을 사용해야 하는 데이터 스트림으로 사용되어야 함
  - 예
    - API 페이지에서 페이지별로 사용자를 얻은 뒤 사용자 스트림을 만드는 데 사용할 수 있음
    - 플로우 함수를 호출함으로써 다음 페이지가 나오자마자 처리할 수 있음
    - 얼마나 많은 페이지를 얻어와야 하는지 정할 수 있음

## 플로우의 특징

- 플로우의 최종 연산은 스레드를 블로킹하는 대신 코루틴을 중단시킴
- 플로우는 코루틴 컨텍스트를 활용하고 예외를 처리하는 등의 코루틴 기능도 제공
- 플로우 처리는 취소 가능하며, 구조화된 동시성을 기본적으로 갖추고 있음
- flow 빌더는 중단 함수가 아니며 어떠한 스코프도 필요로 하지 않음
- 플로우의 최종 연산은 중단 가능, 연산이 실행될 때 부모 코루틴과의 관계가 정립됨
  - coroutineScope 함수와 비슷
- 예제

  - CoroutineName 컨텍스트가 collect 에서 flow 빌더의 람다 표현식으로 전달되는 것을 보여줌
  - launch 를 취소하면 플로우 처리도 적절하게 취소된다는 것 또한 확인 가능

  ```kotlin
  // Notice, that this function is not suspending
  // and does not need CoroutineScope
  private fun usersFlow(): Flow<String> =
      flow {
          repeat(3) {
              delay(1000)
              val ctx = currentCoroutineContext()
              val name = ctx[CoroutineName]?.name
              emit("User$it in $name")
          }
      }

  suspend fun main() {
      val users = usersFlow()

      withContext(CoroutineName("Name")) {
          val job =
              launch {
                  // collect is suspending
                  users.collect { println(it) }
              }

          launch {
              delay(2100)
              println("I got enough")
              job.cancel()
          }
      }
  }

  // (1 sec)
  // User0 in Name
  // (1 sec)
  // User1 in Name
  // (0.1 sec)
  // I got enough
  ```

## 플로우 명명법

- 모든 플로우는 몇 가지 요소로 구성됨
- 플로우는 어딘가에서 시작되어야 함
  - 플로우 빌더, 다른 객체에서의 변환, 또는 헬퍼 함수로부터 시작됨
- 플로우의 마지막 연산은 **최종 연산**이라 불리며, **중단 가능하거나 스코프를 필요로 하는 유일한 연산이라는 점에서 아주 중요**
  - 최종 연산은 주로 람다 표현식을 가진 또는 가지지 않는 collect 가 됨 `why?`
  - 하지만 다른 최종 연산 또한 존재함
- 시작 연산과 최종 연산 사이에 플로우를 변경하는 **중간 연산 (intermediate operation)** 을 가질 수 있음

```kotlin
suspend fun main() {
		flow { emit("Message 1") }
				.onEach { println(it) }
				.onStart { println("Do something before") }
				.onCompletion { println("Do something after") }
				.catch { emit("Error") }
				.collect { println("Collected $it") }
}
```

## 실제 사용 예

- 현업에서는 채널보다 플로우가 필요한 경우가 더 많음
- 몇몇 경우에는 두 가지를 섞어서 사용하기도 함
- 플로우가 사용되는 전형적인 예
  - 웹소켓이나 RSocket 알림과 같이 서버가 보낸 이벤트를 통해 전달된 메시지를 받는 경우
  - 텍스트 입력 또는 클릭과 같은 사용자 액션이 감지된 경우
  - 센서 또는 위치나 지도와 같은 기기의 정보 변경을 받는 경우
  - 데이터베이스의 변경을 감지하는 경우
    - 음? CDC? change data capture?
    - Room 라이브러리?
- 채팅이나 검색에 대한 실시간 제안을 제공하는 클라이언트
- 동시성 처리
  - 예를 들어 판매자 목록을 가지고 있고, 그들이 제공하는 상품을 가져와야 하는 경우
  - 컬렉션 내부 처리에서 async 를 사용하면 동시 처리 가능
  - 하지만 판매자 목록의 크기가 클 때, 많은 요청을 한 번에 보내면 좋지 않음
  - 이럴 때 사용자 측면에서 제어하고 싶다면 플로우를 사용할 수도 있음
  - 이 경우 동시성 호출의 수를 20으로 제한하기 위해 동시성 속성이 20으로 제한된 `flatMapMerge` 를 사용할 수 있음
  ```kotlin
  suspend fun getOffers(
     sellers: List<Seller>
  ): List<Offer> = sellers
     .asFlow()
     .flatMapMerge(concurrency = 20) { seller ->
         suspend { api.requestOffers(seller.id) }.asFlow()
     }
     .toList()
  ```
- 컬렉션 대신 플로우로 처리하면 동시 처리, 컨텍스트, 예외를 비롯한 많은 것을 조절할 수 있음
- 마지막으로 리액티브 형태의 프로그래밍을 선호한다는 이유로 몇몇 팀에서 중단 함수 대신 플로우를 사용
  - 중단 함수 대신 플로우를 사용하는 팀에서는 함수가 단 하나의 값을 반환하는 경우에도 플로우를 자주 사용함
  - 이런 경우 필자는 중단 함수만 써도 된다고 생각하지만, 중단 함수와 플로우 모두 사용 가능할 수 있음
- 플로우를 실제로 적용한 예는 상당히 많음

## 요약

- 플로우의 개념
- 플로우는 코루틴을 지원하며, 비동기적으로 계산되는 값을 나타냄
- 플로우가 유용한 경우는 상당히 많음
