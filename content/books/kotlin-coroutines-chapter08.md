+++ 
date = 2024-01-07T00:30:00+09:00
title = "[Kotlin Coroutines] 8장. 잡과 자식 코루틴 기다리기"
+++

<img src="/images/books/kotlin-coroutines/cover.webp" width="400px">

## 개요

- 부모-자식 관계의 특성
  - 자식은 부모로부터 컨텍스트를 상속받음
  - 부모는 모든 자식이 작업을 마칠 때까지 기다림
  - 부모 코루틴이 취소되면 자식 코루틴도 취소됨
  - 자식 코루틴에서 에러가 발생하면, 부모 코루틴 또한 에러로 소멸
- 자식이 부모 컨텍스트를 물려 받는건 코루틴 빌더의 가장 기본적인 특징
- 이외의 중요한 특성들은 Job 컨텍스트와 관련
- Job은
  - 코루틴을 취소하고,
  - 상태를 파악하는 등 다양하게 사용될 수 있음

## Job 이란 무엇인가?

- 잡은 수명을 가지고 있다.
- 잡은 취소 가능하다.
- 잡은 인터페이스지만, 구체적인 사용법과 상태를 가지고 있으므로 추상 클래스처럼 다룰 수 있다.
- 잡의 수명은 상태로 나타낸다.

![kotlin_coroutines_job_status.svg](/images/books/kotlin-coroutines/chapter08/kotlin_coroutines_job_status.svg)

- Active
  - 잡이 실행되고 코루틴은 잡을 수행
  - 잡이 코루틴 빌더에 의해 생성되었을 때 코루틴의 본체가 실행되는 상태
  - 이 상태에서 자식 코루틴을 시작할 수 있음
  - 대부분의 코루틴은 Active 상태로 시작
    - 지연 시작되는 코루틴만 New 상태에서 시작
- New
  - 지연 시작되는 코루틴만 New 상태에서 시작
  - Active 가 되려면 작업이 실행되어야 함
  - 코루틴이 본체를 실행하면 Active 로 가게 됨
- Completing
  - 실행 완료 후 상태 변경
  - 자식을 기다림
  - 자식도 모두 마무리 되면 Completed 로 변경
- Cancelling
  - 잡 실행 도중 (active or completing)에 취소되거나 실패한 경우
  - 연결을 끊거나 자원을 반납하는 등의 후처리 작업 가능
  - 후처리가 완료되면 Cancelled 상태
- 잡의 상태는 toString 으로 확인 가능
- join 은 코루틴이 완료되는 걸 기다리기 위해 사용됨

```kotlin
suspend fun main() =
    coroutineScope {
        // Job created with a builder is active
        val job = Job()
        println(job) // JobImpl{Active}@ADD
        // until we complete it with a method
        job.complete()
        println(job) // JobImpl{Completed}@ADD

        // launch is initially active by default
        val activeJob =
            launch {
                delay(1000)
            }
        println(activeJob) // StandaloneCoroutine{Active}@ADD
        // here we wait until this job is done
        activeJob.join() // (1 sec)
        println(activeJob) // StandaloneCoroutine{Completed}@ADD

        // launch started lazily is in New state
        val lazyJob =
            launch(start = CoroutineStart.LAZY) {
                delay(1000)
            }
        println(lazyJob) // LazyStandaloneCoroutine{New}@ADD
        // we need to start it, to make it active
        lazyJob.start()
        println(lazyJob) // LazyStandaloneCoroutine{Active}@ADD
        lazyJob.join() // (1 sec)
        println(lazyJob) // LazyStandaloneCoroutine{Completed}@ADD
    }
```

- 코드에서 잡의 상태를 확인하기 위해서는 `isActive`, `isCompleted`, `isCancelled` 프로퍼티를 사용하면 됨

| 상태                           | isActive | isCompleted | isCancelled |
| ------------------------------ | -------- | ----------- | ----------- |
| New (지연 시작될 때 시작 상태) | false    | false       | false       |
| Active (시작 상태 기본값)      | true     | false       | false       |
| Completing (일시적인 상태)     | true     | false       | false       |
| Cancelling (일시적인 상태)     | false    | false       | true        |
| Cancelled (최종 상태)          | false    | true        | true        |
| Completed (최종 상태)          | false    | true        | false       |

## 코루틴 빌더는 부모의 잡을 기초로 자신들의 잡을 생성한다

- 코틀린 코루틴 라이브러리의 모든 코루틴 빌더는 자신만의 잡을 생성
- 대부분의 코루틴 빌더는 잡을 반환하므로 어느 곳에서든 사용할 수 있음
- launch 의 명시적 반환 타입이 Job 이라는 사실을 통해 확인할 수 있음

```kotlin
fun main(): Unit =
    runBlocking {
        val job: Job =
            launch {
                delay(1000)
                println("Test")
            }
    }
```

- async 함수의 리턴 타입은 Deferred<T> 이지만, Job 인터페이스를 구현하고 있음

```kotlin
fun main(): Unit =
    runBlocking {
        val deferred: Deferred<String> =
            async {
                delay(1000)
                "Test"
            }
        val job: Job = deferred
    }
```

- 잡을 좀 더 접근하기 편하게 만들어 주는 확장 프로퍼티 job 도 있음
- **Job 은 코루틴이 상속하지 않는 유일한 코루틴 컨텍스트**
  - **이는 코루틴에서 아주 중요한 법칙**
- 모든 코루틴은 자신만의 Job 을 생성하며 인자 또는 부모 코루틴으로부터 온 잡은 새로운 잡의 부모로 사용됨

```kotlin
fun main(): Unit =
    runBlocking {
        val name = CoroutineName("Some name")
        val job = Job()

        launch(name + job) {
            val childName = coroutineContext[CoroutineName]
            assert(childName == name) // true
            val childJob = coroutineContext[Job]
            assert(childJob == null)
            assert(childJob != job) // false
            assert(childJob == job.children.first()) // true
        }
    }
```

- 부모 잡은 자식 잡 모두를 참조 가능
- 자식 또한 부모를 참조 가능
- 잡을 참조할 수 있는 부모-자식 관계가 있기 때문에 **코루틴 스코프 내에서 취소와 예외 처리 구현이 가능**

```kotlin
fun main(): Unit =
    runBlocking {
        val job: Job =
            launch {
                delay(1000)
            }

        val parentJob: Job = coroutineContext.job
        // or coroutineContext[Job]!!
        assert(job != parentJob) // false
        val parentChildren: Sequence<Job> = parentJob.children
        assert(parentChildren.first() == job) // true
    }
```

- 새로운 Job 컨텍스트가 부모의 잡을 대체하면 구조화된 동시성의 작동 방식은 유효하지 않음

```kotlin
fun main(): Unit =
    runBlocking {
        launch(Job()) { // the new job replaces one from parent
            delay(1000)
            println("Will not be printed")
        }
    } // (prints nothing, finishes immediately)
```

- 코루틴이 자신만의 독자적인 잡을 가지고 있으면 부모와 아무런 관계가 없다고 할 수 있음
- 자식은 다른 컨텍스트를 상속받게 되지만, 부모-자식 간의 관계가 정립되지는 못함
- 부모-자식 관계가 없으면 구조화된 동시성을 잃게되어, 코루틴을 다룰 때 골치 아파짐
  - 구조화된 동시성으로 편리하게 관리할 수 있다!

## 자식들 기다리기

- 잡의 첫 번째 중요한 이점
  - 코루틴이 완료될 때까지 기다리는 데 사용될 수 있다는 점
  - 이를 위해 join 메서드를 사용
  - join 은 지정한 잡이 Completed 나 Cancelled 와 같은 마지막 상태에 도달할 때까지 기다리는 중단 함수

```kotlin
fun main(): Unit =
    runBlocking {
        val job1 =
            launch {
                delay(1000)
                println("Test1")
            }
        val job2 =
            launch {
                delay(2000)
                println("Test2")
            }

        job1.join()
        job2.join()
        println("All tests are done")
    }
```

- 모든 자식을 참조하는 children 프로퍼티로도 사용 가능하다

```kotlin
fun main(): Unit =
    runBlocking {
        launch {
            delay(1000)
            println("Test1")
        }
        launch {
            delay(2000)
            println("Test2")
        }

        val children =
            coroutineContext[Job]
                ?.children

        val childrenNum = children?.count()
        println("Number of children: $childrenNum")
        children?.forEach { it.join() }
        println("All tests are done")
    }
```

## 잡 팩토리 함수

- Job 은 Job() 팩토리 함수를 사용하면 코루틴 없이도 Job 을 만들 수 있음
  - 팩토리 함수로 생성하는 잡은 어떤 코루틴과도 연관 X
  - 컨텍스트로 사용될 수 있음
  - 즉, 한 개 이상의 자식 코루틴을 가진 부모 잡으로 사용할 수 있음
- 흔한 실수 중 하나
  - Job() 팩토리 함수를 사용해 잡을 생성하고,
  - 다른 코루틴의 부모로 지정한 뒤에 join 을 호출하는 것
  - 이렇게 되면 자식 코루틴이 모두 작업을 끝마쳐도 Job 이 여전히 액티브 상태에 있기 때문에 프로그램이 종료되지 않음
    - 상태를 생각!
  - 팩토리 함수로 만들어진 잡은 다른 코루티넹 의해 여전히 사용될 수 있기 때문

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val job = Job()
        launch(job) { // the new job replaces one from parent
            delay(1000)
            println("Text 1")
        }
        launch(job) { // the new job replaces one from parent
            delay(2000)
            println("Text 2")
        }
        job.join() // Here we will await forever
        println("Will not be printed")
    }
```

- **따라서 잡의 모든 자식 코루틴에서 join 을 호출하는 것이 바람직한 방법**

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val job = Job()
        launch(job) { // the new job replaces one from parent
            delay(1000)
            println("Text 1")
        }
        launch(job) { // the new job replaces one from parent
            delay(2000)
            println("Text 2")
        }
        job.children.forEach { it.join() }
    }
```

- Job() 은 팩토리 함수의 좋은 예
  - 처음 보면 Job 의 생성자를 호출한다고 생각할 수 있지만, Job 은 인터페이스이며, 인터페이스는 생성자를 갖지 못함
  - 즉, Job() 은 생성자처럼 보이는 간단한 함수로, 가짜 생성자
  - 그리고 팩토리 함수가 반환하는 실제 타입은 Job 이 아니라 하위 인터페이스인 CompletableJob
  ```kotlin
  /**
   * Creates a job object in an active state.
   * A failure of any child of this job immediately causes this job to fail, too, and cancels the rest of its children.
   *
   * To handle children failure independently of each other use [SupervisorJob].
   *
   * If [parent] job is specified, then this job becomes a child job of its parent and
   * is cancelled when its parent fails or is cancelled. All this job's children are cancelled in this case, too.
   *
   * Conceptually, the resulting job works in the same way as the job created by the `launch { body }` invocation
   * (see [launch]), but without any code in the body. It is active until cancelled or completed. Invocation of
   * [CompletableJob.complete] or [CompletableJob.completeExceptionally] corresponds to the successful or
   * failed completion of the body of the coroutine.
   *
   * @param parent an optional parent job.
   */
  @Suppress("FunctionName")
  public fun Job(parent: Job? = null): CompletableJob = JobImpl(parent)
  ```
- CompletableJob 인터페이스는 다음 두 가지 메서드를 추가하여 Job 인터페이스의 기능성을 확장함

  ```kotlin
  public interface CompletableJob : Job {
      /**
       * Completes this job. The result is `true` if this job was completed as a result of this invocation and
       * `false` otherwise (if it was already completed).
       *
       * Subsequent invocations of this function have no effect and always produce `false`.
       *
       * This function transitions this job into _completed_ state if it was not completed or cancelled yet.
       * However, that if this job has children, then it transitions into _completing_ state and becomes _complete_
       * once all its children are [complete][isCompleted]. See [Job] for details.
       */
      public fun complete(): Boolean

      /**
       * Completes this job exceptionally with a given [exception]. The result is `true` if this job was
       * completed as a result of this invocation and `false` otherwise (if it was already completed).
       * [exception] parameter is used as an additional debug information that is not handled by any exception handlers.
       *
       * Subsequent invocations of this function have no effect and always produce `false`.
       *
       * This function transitions this job into _cancelled_ state if it was not completed or cancelled yet.
       * However, that if this job has children, then it transitions into _cancelling_ state and becomes _cancelled_
       * once all its children are [complete][isCompleted]. See [Job] for details.
       *
       * Its responsibility of the caller to properly handle and report the given [exception], all job's children will receive
       * a [CancellationException] with the [exception] as a cause for the sake of diagnostic.
       */
      public fun completeExceptionally(exception: Throwable): Boolean
  }
  ```

  - `complete(): Boolean`

    - 잡을 완료하는데 사용
    - 사용하면 모든 자식 코루틴은 작업이 완료될 때까지 실행된 상태를 유지하지만,
    - complete 를 호출한 잡에서 새로운 코루틴이 시작될 수는 없음
    - 잡이 완료되면 true, 그렇지 않을 경우 false

    ```kotlin
    fun main() =
        runBlocking {
            val job = Job()

            launch(job) {
                repeat(5) { num ->
                    delay(200)
                    println("Rep$num")
                }
            }

            launch {
                delay(500)
                job.complete()
            }

            job.join()

            launch(job) {
                println("Will not be printed")
            }

            println("Done")
        }
    ```

  - `completeExceptionally(exception: Throwable): Boolean`

    - 인자로 받은 예외로 잡을 완료시킴
    - 모든 자식 코루틴은 주어진 예외를 래핑한 CancellationException 으로 즉시 취소됨
    - complete 메서드처럼 반환값은 “잡이 메서드의 실행으로 종료되었습니까?” 라는 질문에 대한 응답

    ```kotlin
    fun main() =
        runBlocking {
            val job = Job()

            launch(job) {
                repeat(5) { num ->
                    delay(200)
                    println("Rep$num")
                }
            }

            launch {
                delay(500)
                job.completeExceptionally(Error("Some error"))
            }

            job.join()

            launch(job) {
                println("Will not be printed")
            }

            println("Done")
        }
    ```

- complete 함수는 잡의 마지막 코루틴을 시작한 후 자주 사용됨
  - 이후에는 join 함수를 사용해 잡이 완료되는 걸 기다리기만 하면 됨
  ```kotlin
  fun main() =
      runBlocking {
          val job = Job()
          launch(job) { // the new job replaces one from parent
              delay(1000)
              println("Text 1")
          }
          launch(job) { // the new job replaces one from parent
              delay(2000)
              println("Text 2")
          }
          job.complete()
          job.join()
      }
  ```
- Job 함수의 인자로 부모 잡의 참조값을 전달할 수 있음
  - 이때 부모 잡이 취소되면 해당 잡 또한 취소됨

```kotlin
suspend fun main(): Unit =
    coroutineScope {
        val parentJob = Job()
        val job = Job(parentJob)
        launch(job) {
            delay(1000)
            println("Text 1")
        }
        launch(job) {
            delay(2000)
            println("Text 2") // This will not be printed
        }
        delay(1100)
        parentJob.cancel()
        job.children.forEach { it.join() }
    }
```
