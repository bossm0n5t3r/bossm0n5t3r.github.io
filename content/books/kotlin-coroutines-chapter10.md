+++ 
date = 2024-01-12T23:30:00+09:00
title = "[Kotlin Coroutines] 10장. 예외 처리"
+++

![](/images/books/kotlin-coroutines/cover.webp)

## 개요

- 예외 처리는 코루틴의 작동 원리 중 아주 중요한 기능
- 잡히지 않은 예외가 발생하면 프로그램이 종료되는 것처럼 코루틴도 잡히지 않은 예외가 발생했을 때 종료됨
  - 이런 방식은 전혀 새로운 것이 아님
  - 스레드 또한 같은 경우에 종료됨
- 코루틴 빌더는 부모도 종료시키며, 취소된 부모는 자식들 모두를 취소시킴
- 코루틴이 예외를 받았을 때 자기 자신을 취소하고 예외를 부모로 전파 (launch)
  - 부모는 자기 자신과 자식들 모두를 취소, 예외를 부모에게 전파 (runBlocking)
  - runBlocking 은 부모가 없는 루트 코루틴이기 때문에 프로그램을 종료
  - runBlocking 은 예외를 다시 던짐

```kotlin
fun main(): Unit = runBlocking {
    launch {
        launch {
            delay(1000)
            throw Error("Some error")
        }

        launch {
            delay(2000)
            println("Will not be printed")
        }

        launch {
            delay(500) // faster than the exception
            println("Will be printed")
        }
    }

    launch {
        delay(2000)
        println("Will not be printed")
    }
}
```

- launch 코루틴을 더하는 건 아무것도 바꾸지 못함
- 예외는 자식에서 부모로 전파되며, 부모가 취소되면 자식도 취소되기 때문에 쌍방으로 전파됨
- 예외 전파가 정지되지 않으면 계통 구조상 모든 코루틴이 취소됨

## 코루틴 종료 멈추기

- 코루틴이 종료되기 전에 예외를 잡는 건 도움이 되지만, 조금이라도 늦으면 이미 손쓸 수 없는 상황이 됨
- 코루틴 간의 상호작용은 잡을 통해서 일어나기 때문에, 코루틴 빌더 내부에서 새로운 코루틴 빌더를 try-catch 문을 통해 래핑하는 건 전혀 도움이 되지 않음

```kotlin
fun main(): Unit =
    runBlocking {
        // Don't wrap in a try-catch here. It will be ignored.
        try {
            launch {
                delay(1000)
                throw Error("Some error")
            }
        } catch (e: Throwable) {
            // nope, does not help here
            println("Will not be printed")
        }

        launch {
            delay(2000)
            println("Will not be printed")
        }
    }
```

### SupervisorJob

- 코루틴 종료를 멈추는 가장 중요한 방법은 **SupervisorJob 을 사용**하는 것
- **SupervisorJob 을 사용하면 자식에서 발생한 모든 예외를 무시할 수 있음**
- 일반적으로 SupervisorJob 은 다수의 코루틴을 시작하는 스코프로 사용됨

```kotlin
fun main(): Unit =
    runBlocking {
        val scope = CoroutineScope(SupervisorJob())
        scope.launch {
            delay(1000)
            throw Error("Some error")
        }

        scope.launch {
            delay(2000)
            println("Will be printed")
        }

        delay(3000)
    }
// Exception...
// Will be printed
```

- 흔한 실수 중 하나는 SupervisorJob 을 다음 코드처럼 부모 코루틴의 인자로 사용하는 것

  - launch 가 SupervisorJob 을 인자로 받는데, **이럴 경우 SupervisorJob 은 단 하나의 자식만 가지기 때문에 예외를 처리하는 데 아무런 도움이 되지 않는다.**

    - 따라서 SupervisorJob 을 Job 대신 사용하더라도 아무 도움이 되지 않음
    - 두 경우 모두 runBlocking 의 잡을 사용하지 않기 때문에 예외는 runBlocking 으로 전파되지 않음

    ```kotlin
    fun main(): Unit =
        runBlocking {
            // Don't do that, SupervisorJob with one child
            // and no parent works similar to just Job
            launch(SupervisorJob()) { // 1
                launch {
                    delay(1000)
                    throw Error("Some error")
                }

                launch {
                    delay(2000)
                    println("Will not be printed")
                }
            }

            delay(3000)
        }
    ```

  - 하나의 코루틴이 취소되어도 다른 코루틴이 취소되지 않는다는 점에서, 같은 잡을 다수의 코루틴에서 컨텍스트로 사용하는 것이 좀 더 나은 방법
    ```kotlin
    fun main(): Unit =
        runBlocking {
            val job = SupervisorJob()
            launch(job) {
                delay(1000)
                throw Error("Some error")
            }
            launch(job) {
                delay(2000)
                println("Will be printed")
            }
            job.join()
            println("Done") // will not be printed
        }
    ```

### supervisorScope

- 예외 전파를 막는 또 다른 방법은 코루틴 빌더를 supervisorScope 로 래핑하는 것
- 다른 코루틴에서 발생한 예외를 무시하고 부모와의 연결을 유지한다는 점에서 아주 편리함

```kotlin
fun main(): Unit =
    runBlocking {
        supervisorScope {
            launch {
                delay(1000)
                throw Error("Some error")
            }

            launch {
                delay(2000)
                println("Will be printed")
            }
        }
        delay(1000)
        println("Done")
    }
```

- supervisorScope 는 단지 중단 함수일 뿐
  - 중단 함수 본체를 래핑하는 데 사용됨
- supervisorScope 를 사용하는 일반적인 방법은 서로 무관한 다수의 작업을 스코프 내에서 실행하는 것
- 예외 전파를 멈추는 또 다른 방법은 coroutineScope 를 사용하는 것
  - 이 함수는 코루틴 빌더와 달리 부모에 영향을 미치는 대신 try-catch 를 이용해 잡을 수 있는 예외를 던짐
- **supervisorScope 는 withContext(SupervisorJob()) 으로 대체될 수 없다는 것을 명심**

```kotlin
// 이렇게 하면 안 됨
suspend fun sendNotification(
		notifications: List<Notification>,
) = withContext(SupervisorJob()) {
		for (notification in notifications) {
				launch {
						client.send(notification)
				}
		}
}
```

- Job 이 상속되지 않는 유일한 컨텍스트이기 때문에 문제가 됨
- 코루틴은 각각 자신만의 잡을 가지고 있고, 잡을 다른 코루틴에 전달하여 부모 관계를 맺음
- 여기서는 SupervisorJob 이 withContext 의 부모
- 자식 코루틴에서 예외가 발생하면, withContext 코루틴으로 전달
  - Job 이 취소되고, 자식 코루틴 또한 전부 취소되며, 마지막으로 예외를 던짐
  - SupervisorJob 이 부모가 되어도 바뀌는 건 아무것도 없음

## await

- 예외가 발생했을 때 async 코루틴 빌더는 launch 처럼 부모 코루틴을 종료하고 부모와 관련있는 다른 코루틴 빌더도 종료시킴
- SupervisorJob 이나 supervisorScope 를 사용하면 이런 과정이 일어나지 않는데, await 를 호출하면 어떻게 되는지 보자.

```kotlin
private class MyException : Throwable()

suspend fun main() =
    supervisorScope {
        val str1 =
            async<String> {
                delay(1000)
                throw MyException()
            }

        val str2 =
            async {
                delay(2000)
                "Text2"
            }

        try {
            println(str1.await())
        } catch (e: MyException) {
            println(e)
        }

        println(str2.await())
    }
```

- 코루틴이 예외로 종료되었기 때문에 반환할 값은 없음
  - 하지만 await 가 MyException 을 던지게 되어 MyException 이 출력됨
- supervisorScope 가 사용되었기 때문에 또 다른 async 는 중단되지 않고 끝까지 실행됨

## CancellationException 은 부모까지 전파되지 않는다

- 예외가 CancellationException 의 서브 클래스라면 부모로 전파되지 않음
  - 현재 코루틴을 취소시킬 뿐
- CancellationException 은 열린 클래스
  - 다른 클래스나 객체로 확장될 수 있음

```kotlin
private object MyNonPropagatingException : CancellationException() {
    private fun readResolve(): Any = MyNonPropagatingException
}

suspend fun main(): Unit =
    coroutineScope {
        launch { // 1
            launch { // 2
                delay(2000)
                println("Will not be printed")
            }
            throw MyNonPropagatingException // 3
        }
        launch { // 4
            delay(2000)
            println("Will be printed")
        }
    }
```

- 두 개의 코루틴이 1과 4의 빌더로 시작됨
- 3에서 CancellationException 의 서브 타입인 MyNonPropagatingException 예외를 던짐
- 예외는 1에서 시작된 launch 에서 잡힘
- 1에서 시작된 코루틴은 자기 자신을 취소하고, 2에서 정의된 빌더로 만들어진 자식 코루틴 또한 취소시킴
- 4에서 시작된 두 번째 launch 는 영향을 받지 않고 2초 후에 Will be printed 를 출력

## 코루틴 예외 핸들러

- 예외를 다룰 때 예외를 처리하는 기본 행동을 정의하는 것이 유용할 때가 있음
- 이런 경우 CoroutineExceptionHandler 컨텍스트르르 사용하면 편리함
- 예외 전파를 중단시키지는 않지만, 예외가 발생했을 때 해야할 것들 (예외 스택 트레이스 출력 등)을 정의하는데 사용할 수 있음

```kotlin
public inline fun CoroutineExceptionHandler(crossinline handler: (CoroutineContext, Throwable) -> Unit): CoroutineExceptionHandler =
    object : AbstractCoroutineContextElement(CoroutineExceptionHandler), CoroutineExceptionHandler {
        override fun handleException(context: CoroutineContext, exception: Throwable) =
            handler.invoke(context, exception)
    }

public interface CoroutineExceptionHandler : CoroutineContext.Element {
    /**
     * Key for [CoroutineExceptionHandler] instance in the coroutine context.
     */
    public companion object Key : CoroutineContext.Key<CoroutineExceptionHandler>

    /**
     * Handles uncaught [exception] in the given [context]. It is invoked
     * if coroutine has an uncaught exception.
     */
    public fun handleException(context: CoroutineContext, exception: Throwable)
}
```

```kotlin
fun main(): Unit =
    runBlocking {
        val handler =
            CoroutineExceptionHandler { ctx, exception ->
                println("Caught $exception")
            }
        val scope = CoroutineScope(SupervisorJob() + handler)
        scope.launch {
            delay(1000)
            throw Error("Some error")
        }

        scope.launch {
            delay(2000)
            println("Will be printed")
        }

        delay(3000)
    }
```

## 요약

- 예외 처리는 kotlinx.coroutines 라이브러리의 중요한 기능
- 지금은 기본 빌더에서 예외가 자식에서 부모로 전파되는 것을 이해하고 어떻게 멈추는지만 이해하면 됨
