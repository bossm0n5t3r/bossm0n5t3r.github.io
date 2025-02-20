+++
date = 2025-02-20T23:45:00+09:00
title = "[Paper] Your Server as a Function"
authors = ["Ji-Hoon Kim"]
tags = ["paper", "asynchronous", "serverless"]
categories = ["paper", "asynchronous", "serverless"]
series = ["paper", "asynchronous", "serverless"]
+++

## 개요

"Your Server as a Function"는 Twitter의 엔지니어링 팀이 2013년 발표한 논문으로, **Futures**, **Services**, **Filters** 세 가지 추상화를 통해 분산 서버 소프트웨어를 함수형 프로그래밍 방식으로 구성하는 모델을 제시한다.

이 모델은 효율성, 모듈성, 재사용성을 강조하며, 복잡한 서버 로직을 선언적 방식으로 표현한다.

## 왜 함수형 접근이 필요한가?

기존 서버 개발은 “스레드 관리, 리소스 누수 방지, 동시성 제어” 같은 저수준 문제에 집중해야 했다.

논문은 이를 추상화하고 선언적 프로그래밍(declarative programming)으로 전환할 것을 제안한다.

- **불변성(Immutability)**: 데이터 변환을 순수 함수로 표현해 부수 효과(side effect) 최소화
- **조합성(Composability)**: 작은 기능 단위를 레고 블록처럼 결합해 복잡한 시스템 구축

## 핵심 개념

### 1. Futures

- **비동기 연산 결과**를 나타내는 컨테이너. `flatMap`으로 종속성 표현, `rescue`로 에러 복구
- 논문 예시: 타임아웃 발생 시 대체 쿼리 사용

```scala
def rewrite(user: String, query: String): Future[String]
def search(query: String): Future[Set[Result]]

def psearch(user: String, query: String) =
  rewrite(user, query).within(50.milliseconds) rescue { case _: TimeoutError =>
    Future.value(query)
  } flatMap { pquery =>
    search(pquery)
  }
```

### 2. Services

- `Req -> Future[Rep]` **타입**의 비동기 함수
- 클라이언트/서버 대칭적 설계

```scala
// 클라이언트
val client: Service[HttpReq, HttpRep] = Http.newService("twitter.com:80")

// 서버
val server = Http.serve(
  ":80", {
    req:
    HttpReq =>
      Future.value(HttpRep(Status.OK, req.body))
  }
)
```

### 3. Filters

- 횡단 관심사 모듈화
- 체인 연결로 재사용성 극대화

```scala
type Filter[Req, Rep] = (Req, Service[Req, Rep]) => Future[Rep]
```

```scala
def timeoutFilter(d: Duration) = { (req, service) => service(req).within(d) }

val httpClient: Service[HttpReq, HttpRep] = ...
val httpClientWithTimeout: Service[HttpReq, HttpRep] =
		timeoutFilter(10.seconds) andThen httpClient
```

## 구현 사례

### Finagle (Twitter)

- 원본 구현체
- **트위터 전체 인프라**에 적용
- 40줄 내외의 Filter로 Backup Request(지연 요청 재시도) 구현

```scala
class BackupRequestFilter[Req, Rep](
    quantile: Int,
    range: Duration,
    timer: Timer,
    statsReceiver: StatsReceiver,
    history: Duration,
    stopwatch: Stopwatch = Stopwatch
)
extends SimpleFilter[Req, Rep] {
  require(quantile > 0 && quantile < 100)
  require(range < 1.hour)
  private[this] val histo = new LatencyHistogram(range, history)
  private[this] def cutoff() = histo.quantile(quantile)
  private[this] val timeouts = statsReceiver.counter("timeouts")
  private[this] val won = statsReceiver.counter("won")
  private[this] val lost = statsReceiver.counter("lost")
  private[this] val cutoffGauge =
    statsReceiver.addGauge("cutoff_ms") { cutoff().inMilliseconds.toFloat }
  def apply(req: Req, service: Service[Req, Rep]): Future[Rep] = {
    val elapsed = stopwatch.start()
    val howlong = cutoff()
    val backup =
      if (howlong == Duration.Zero) Future.never
      else {
        timer.doLater(howlong) {
          timeouts.incr()
          service(req)
        } flatten
      }
    val orig = service(req)
    Future.select(Seq(orig, backup)) flatMap {
      case (Return(res), Seq(other)) =>
        if (other eq orig) lost.incr()
        else {
          won.incr()
          histo.add(elapsed())
        }
        other.raise(BackupRequestLost)
        Future.value(res)
      case (Throw(_), Seq(other)) => other
    }
  }
}
```

### http4k (Kotlin)

- **순수 함수 조합**으로 서버/클라이언트 구축. AWS Lambda 지원

```kotlin
val app: HttpHandler = { req -> Response(OK).body(req.body) }
val server = app.asServer(SunHttp(8000))
```

## 장점

1. **모듈성**: 타임아웃/인증 등 필터를 독립 컴포넌트로 분리
2. **실행 추상화**: 스레드 풀 크기 등 런타임 최적화를 라이브러리에 위임
3. **에러 추적성**: Future 체인으로 전체 작업 흐름 디버깅 가능
4. **서버리스 대응**: 단일 함수 배포 모델과 친화적

## 결론

이 모델은 **함수형 아키텍처가 대규모 분산 시스템에 실용적**임을 입증

http4k의 사례에서 볼 수 있듯, 서버리스 환경에서도 진가를 발휘하며 지속적으로 영향력을 확장 중

## Sources

- [PDF] Your Server as a Function - Monkey
  - https://monkey.org/~marius/funsrv.pdf
- Server as a Function. In Kotlin. Typesafe. Without the Server. | http4k
  - https://www.http4k.org/news/meet_http4k/
