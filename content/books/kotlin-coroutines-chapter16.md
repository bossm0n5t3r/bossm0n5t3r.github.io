+++ 
date = 2024-02-17T21:44:00+09:00
title = "[Kotlin Coroutines] 16장. 채널"
+++

![](/images/books/kotlin-coroutines/cover.webp)

## introduction

- 코루틴끼리의 통신을 위한 기본적인 방법으로 채널 API 가 추가
- 책을 교환하는 데 사용되는 공공 책장을 보면, 다른 사람이 찾는 책을 한 사람이 먼저 가지고 와야 하는데, 채널이 동작하는 방식과 비슷
- 채널은 송신자와 수신자의 수에 제한이 없으며, 채널을 통해 전송된 모든 값은 단 한 번만 받을 수 있음
- Channel 은 두 개의 서로 다른 인터페이스를 구현한 하나의 인터페이스
  - SendChannel 은 원소를 보내거나(또는 더하거나) 채널을 닫는 용도로 사용됨
  - ReceiveChannel 은 원소를 받을 때(또는 꺼낼 때) 사용됨

````kotlin
public interface SendChannel<in E> {
    /**
     * Returns `true` if this channel was closed by an invocation of [close] or its receiving side was [cancelled][ReceiveChannel.cancel].
     * This means that calling [send] will result in an exception.
     *
     * Note that if this property returns `false`, it does not guarantee that consecutive call to [send] will succeed, as the
     * channel can be concurrently closed right after the check. For such scenarios, it is recommended to use [trySend] instead.
     *
     * @see SendChannel.trySend
     * @see SendChannel.close
     * @see ReceiveChannel.cancel
     */
    @DelicateCoroutinesApi
    public val isClosedForSend: Boolean

    /**
     * Sends the specified [element] to this channel, suspending the caller while the buffer of this channel is full
     * or if it does not exist, or throws an exception if the channel [is closed for `send`][isClosedForSend] (see [close] for details).
     *
     * [Closing][close] a channel _after_ this function has suspended does not cause this suspended [send] invocation
     * to abort, because closing a channel is conceptually like sending a special "close token" over this channel.
     * All elements sent over the channel are delivered in first-in first-out order. The sent element
     * will be delivered to receivers before the close token.
     *
     * This suspending function is cancellable. If the [Job] of the current coroutine is cancelled or completed while this
     * function is suspended, this function immediately resumes with a [CancellationException].
     * There is a **prompt cancellation guarantee**. If the job was cancelled while this function was
     * suspended, it will not resume successfully. The `send` call can send the element to the channel,
     * but then throw [CancellationException], thus an exception should not be treated as a failure to deliver the element.
     * See "Undelivered elements" section in [Channel] documentation for details on handling undelivered elements.
     *
     * Note that this function does not check for cancellation when it is not suspended.
     * Use [yield] or [CoroutineScope.isActive] to periodically check for cancellation in tight loops if needed.
     *
     * This function can be used in [select] invocations with the [onSend] clause.
     * Use [trySend] to try sending to this channel without waiting.
     */
    public suspend fun send(element: E)

    /**
     * Clause for the [select] expression of the [send] suspending function that selects when the element that is specified
     * as the parameter is sent to the channel. When the clause is selected, the reference to this channel
     * is passed into the corresponding block.
     *
     * The [select] invocation fails with an exception if the channel [is closed for `send`][isClosedForSend] (see [close] for details).
     */
    public val onSend: SelectClause2<E, SendChannel<E>>

    /**
     * Immediately adds the specified [element] to this channel, if this doesn't violate its capacity restrictions,
     * and returns the successful result. Otherwise, returns failed or closed result.
     * This is synchronous variant of [send], which backs off in situations when `send` suspends or throws.
     *
     * When `trySend` call returns a non-successful result, it guarantees that the element was not delivered to the consumer, and
     * it does not call `onUndeliveredElement` that was installed for this channel.
     * See "Undelivered elements" section in [Channel] documentation for details on handling undelivered elements.
     */
    public fun trySend(element: E): ChannelResult<Unit>

    /**
     * Closes this channel.
     * This is an idempotent operation &mdash; subsequent invocations of this function have no effect and return `false`.
     * Conceptually, it sends a special "close token" over this channel.
     *
     * Immediately after invocation of this function,
     * [isClosedForSend] starts returning `true`. However, [isClosedForReceive][ReceiveChannel.isClosedForReceive]
     * on the side of [ReceiveChannel] starts returning `true` only after all previously sent elements
     * are received.
     *
     * A channel that was closed without a [cause] throws a [ClosedSendChannelException] on attempts to [send]
     * and [ClosedReceiveChannelException] on attempts to [receive][ReceiveChannel.receive].
     * A channel that was closed with non-null [cause] is called a _failed_ channel. Attempts to send or
     * receive on a failed channel throw the specified [cause] exception.
     */
    public fun close(cause: Throwable? = null): Boolean

    /**
     * Registers a [handler] which is synchronously invoked once the channel is [closed][close]
     * or the receiving side of this channel is [cancelled][ReceiveChannel.cancel].
     * Only one handler can be attached to a channel during its lifetime.
     * The `handler` is invoked when [isClosedForSend] starts to return `true`.
     * If the channel is closed already, the handler is invoked immediately.
     *
     * The meaning of `cause` that is passed to the handler:
     * - `null` if the channel was closed normally without the corresponding argument.
     * - Instance of [CancellationException] if the channel was cancelled normally without the corresponding argument.
     * - The cause of `close` or `cancel` otherwise.
     *
     * ### Execution context and exception safety
     *
     * The [handler] is executed as part of the closing or cancelling operation, and only after the channel reaches its final state.
     * This means that if the handler throws an exception or hangs, the channel will still be successfully closed or cancelled.
     * Unhandled exceptions from [handler] are propagated to the closing or cancelling operation's caller.
     *
     * Example of usage:
     * ```
     * val events = Channel<Event>(UNLIMITED)
     * callbackBasedApi.registerCallback { event ->
     *   events.trySend(event)
     *       .onClosed { /* channel is already closed, but the callback hasn't stopped yet */ }
     * }
     *
     * val uiUpdater = uiScope.launch(Dispatchers.Main) {
     *    events.consume { /* handle events */ }
     * }
     * // Stop the callback after the channel is closed or cancelled
     * events.invokeOnClose { callbackBasedApi.stop() }
     * ```
     *
     * **Stability note.** This function constitutes a stable API surface, with the only exception being
     * that an [IllegalStateException] is thrown when multiple handlers are registered.
     * This restriction could be lifted in the future.
     *
     * @throws UnsupportedOperationException if the underlying channel does not support [invokeOnClose].
     * Implementation note: currently, [invokeOnClose] is unsupported only by Rx-like integrations
     *
     * @throws IllegalStateException if another handler was already registered
     */
    public fun invokeOnClose(handler: (cause: Throwable?) -> Unit)

    /**
     * **Deprecated** offer method.
     *
     * This method was deprecated in the favour of [trySend].
     * It has proven itself as the most error-prone method in Channel API:
     *
     * * `Boolean` return type creates the false sense of security, implying that `false`
     *    is returned instead of throwing an exception.
     * * It was used mostly from non-suspending APIs where CancellationException triggered
     *   internal failures in the application (the most common source of bugs).
     * * Due to signature and explicit `if (ch.offer(...))` checks it was easy to
     *   oversee such error during code review.
     * * Its name was not aligned with the rest of the API and tried to mimic Java's queue instead.
     *
     * **NB** Automatic migration provides best-effort for the user experience, but requires removal
     * or adjusting of the code that relied on the exception handling.
     * The complete replacement has a more verbose form:
     * ```
     * channel.trySend(element)
     *     .onClosed { throw it ?: ClosedSendChannelException("Channel was closed normally") }
     *     .isSuccess
     * ```
     *
     * See https://github.com/Kotlin/kotlinx.coroutines/issues/974 for more context.
     *
     * @suppress **Deprecated**.
     */
    @Deprecated(
        level = DeprecationLevel.ERROR,
        message = "Deprecated in the favour of 'trySend' method",
        replaceWith = ReplaceWith("trySend(element).isSuccess")
    ) // Warning since 1.5.0, error since 1.6.0, not hidden until 1.8+ because API is quite widespread
    public fun offer(element: E): Boolean {
        val result = trySend(element)
        if (result.isSuccess) return true
        throw recoverStackTrace(result.exceptionOrNull() ?: return false)
    }
}
````

```kotlin
/**
 * Receiver's interface to [Channel].
 */
public interface ReceiveChannel<out E> {
    /**
     * Returns `true` if this channel was closed by invocation of [close][SendChannel.close] on the [SendChannel]
     * side and all previously sent items were already received, or if the receiving side was [cancelled][ReceiveChannel.cancel].
     *
     * This means that calling [receive] will result in a [ClosedReceiveChannelException] or a corresponding cancellation cause.
     * If the channel was closed because of an exception, it is considered closed, too, but is called a _failed_ channel.
     * All suspending attempts to receive an element from a failed channel throw the original [close][SendChannel.close] cause exception.
     *
     * Note that if this property returns `false`, it does not guarantee that consecutive call to [receive] will succeed, as the
     * channel can be concurrently closed right after the check. For such scenarios, it is recommended to use [receiveCatching] instead.
     *
     * @see ReceiveChannel.receiveCatching
     * @see ReceiveChannel.cancel
     * @see SendChannel.close
     */
    @DelicateCoroutinesApi
    public val isClosedForReceive: Boolean

    /**
     * Returns `true` if the channel is empty (contains no elements), which means that an attempt to [receive] will suspend.
     * This function returns `false` if the channel [is closed for `receive`][isClosedForReceive].
     */
    @ExperimentalCoroutinesApi
    public val isEmpty: Boolean

    /**
     * Retrieves and removes an element from this channel if it's not empty, or suspends the caller while the channel is empty,
     * or throws a [ClosedReceiveChannelException] if the channel [is closed for `receive`][isClosedForReceive].
     * If the channel was closed because of an exception, it is called a _failed_ channel and this function
     * will throw the original [close][SendChannel.close] cause exception.
     *
     * This suspending function is cancellable. If the [Job] of the current coroutine is cancelled or completed while this
     * function is suspended, this function immediately resumes with a [CancellationException].
     * There is a **prompt cancellation guarantee**. If the job was cancelled while this function was
     * suspended, it will not resume successfully. The `receive` call can retrieve the element from the channel,
     * but then throw [CancellationException], thus failing to deliver the element.
     * See "Undelivered elements" section in [Channel] documentation for details on handling undelivered elements.
     *
     * Note that this function does not check for cancellation when it is not suspended.
     * Use [yield] or [CoroutineScope.isActive] to periodically check for cancellation in tight loops if needed.
     *
     * This function can be used in [select] invocations with the [onReceive] clause.
     * Use [tryReceive] to try receiving from this channel without waiting.
     */
    public suspend fun receive(): E

    /**
     * Clause for the [select] expression of the [receive] suspending function that selects with the element
     * received from the channel.
     * The [select] invocation fails with an exception if the channel
     * [is closed for `receive`][isClosedForReceive] (see [close][SendChannel.close] for details).
     */
    public val onReceive: SelectClause1<E>

    /**
     * Retrieves and removes an element from this channel if it's not empty, or suspends the caller while this channel is empty.
     * This method returns [ChannelResult] with the value of an element successfully retrieved from the channel
     * or the close cause if the channel was closed. Closed cause may be `null` if the channel was closed normally.
     * The result cannot be [failed][ChannelResult.isFailure] without being [closed][ChannelResult.isClosed].
     *
     * This suspending function is cancellable. If the [Job] of the current coroutine is cancelled or completed while this
     * function is suspended, this function immediately resumes with a [CancellationException].
     * There is a **prompt cancellation guarantee**. If the job was cancelled while this function was
     * suspended, it will not resume successfully. The `receiveCatching` call can retrieve the element from the channel,
     * but then throw [CancellationException], thus failing to deliver the element.
     * See "Undelivered elements" section in [Channel] documentation for details on handling undelivered elements.
     *
     * Note that this function does not check for cancellation when it is not suspended.
     * Use [yield] or [CoroutineScope.isActive] to periodically check for cancellation in tight loops if needed.
     *
     * This function can be used in [select] invocations with the [onReceiveCatching] clause.
     * Use [tryReceive] to try receiving from this channel without waiting.
     */
    public suspend fun receiveCatching(): ChannelResult<E>

    /**
     * Clause for the [select] expression of the [onReceiveCatching] suspending function that selects with the [ChannelResult] with a value
     * that is received from the channel or with a close cause if the channel
     * [is closed for `receive`][isClosedForReceive].
     */
    public val onReceiveCatching: SelectClause1<ChannelResult<E>>

    /**
     * Retrieves and removes an element from this channel if it's not empty, returning a [successful][ChannelResult.success]
     * result, returns [failed][ChannelResult.failed] result if the channel is empty, and [closed][ChannelResult.closed]
     * result if the channel is closed.
     */
    public fun tryReceive(): ChannelResult<E>

    /**
     * Returns a new iterator to receive elements from this channel using a `for` loop.
     * Iteration completes normally when the channel [is closed for `receive`][isClosedForReceive] without a cause and
     * throws the original [close][SendChannel.close] cause exception if the channel has _failed_.
     */
    public operator fun iterator(): ChannelIterator<E>

    /**
     * Cancels reception of remaining elements from this channel with an optional [cause].
     * This function closes the channel and removes all buffered sent elements from it.
     *
     * A cause can be used to specify an error message or to provide other details on
     * the cancellation reason for debugging purposes.
     * If the cause is not specified, then an instance of [CancellationException] with a
     * default message is created to [close][SendChannel.close] the channel.
     *
     * Immediately after invocation of this function [isClosedForReceive] and
     * [isClosedForSend][SendChannel.isClosedForSend]
     * on the side of [SendChannel] start returning `true`. Any attempt to send to or receive from this channel
     * will lead to a [CancellationException].
     */
    public fun cancel(cause: CancellationException? = null)

    /**
     * @suppress This method implements old version of JVM ABI. Use [cancel].
     */
    @Deprecated(level = DeprecationLevel.HIDDEN, message = "Since 1.2.0, binary compatibility with versions <= 1.1.x")
    public fun cancel(): Unit = cancel(null)

    /**
     * @suppress This method has bad semantics when cause is not a [CancellationException]. Use [cancel].
     */
    @Deprecated(level = DeprecationLevel.HIDDEN, message = "Since 1.2.0, binary compatibility with versions <= 1.1.x")
    public fun cancel(cause: Throwable? = null): Boolean

    /**
     * **Deprecated** poll method.
     *
     * This method was deprecated in the favour of [tryReceive].
     * It has proven itself as error-prone method in Channel API:
     *
     * * Nullable return type creates the false sense of security, implying that `null`
     *    is returned instead of throwing an exception.
     * * It was used mostly from non-suspending APIs where CancellationException triggered
     *   internal failures in the application (the most common source of bugs).
     * * Its name was not aligned with the rest of the API and tried to mimic Java's queue instead.
     *
     * See https://github.com/Kotlin/kotlinx.coroutines/issues/974 for more context.
     *
     * ### Replacement note
     *
     * The replacement `tryReceive().getOrNull()` is a default that ignores all close exceptions and
     * proceeds with `null`, while `poll` throws an exception if the channel was closed with an exception.
     * Replacement with the very same 'poll' semantics is `tryReceive().onClosed { if (it != null) throw it }.getOrNull()`
     *
     * @suppress **Deprecated**.
     */
    @Deprecated(
        level = DeprecationLevel.ERROR,
        message = "Deprecated in the favour of 'tryReceive'. " +
            "Please note that the provided replacement does not rethrow channel's close cause as 'poll' did, " +
            "for the precise replacement please refer to the 'poll' documentation",
        replaceWith = ReplaceWith("tryReceive().getOrNull()")
    ) // Warning since 1.5.0, error since 1.6.0, not hidden until 1.8+ because API is quite widespread
    public fun poll(): E? {
        val result = tryReceive()
        if (result.isSuccess) return result.getOrThrow()
        throw recoverStackTrace(result.exceptionOrNull() ?: return null)
    }

    /**
     * This function was deprecated since 1.3.0 and is no longer recommended to use
     * or to implement in subclasses.
     *
     * It had the following pitfalls:
     * - Didn't allow to distinguish 'null' as "closed channel" from "null as a value"
     * - Was throwing if the channel has failed even though its signature may suggest it returns 'null'
     * - It didn't really belong to core channel API and can be exposed as an extension instead.
     *
     * ### Replacement note
     *
     * The replacement `receiveCatching().getOrNull()` is a safe default that ignores all close exceptions and
     * proceeds with `null`, while `receiveOrNull` throws an exception if the channel was closed with an exception.
     * Replacement with the very same `receiveOrNull` semantics is `receiveCatching().onClosed { if (it != null) throw it }.getOrNull()`.
     *
     * @suppress **Deprecated**
     */
    @Suppress("INVISIBLE_REFERENCE", "INVISIBLE_MEMBER")
    @LowPriorityInOverloadResolution
    @Deprecated(
        message = "Deprecated in favor of 'receiveCatching'. " +
            "Please note that the provided replacement does not rethrow channel's close cause as 'receiveOrNull' did, " +
            "for the detailed replacement please refer to the 'receiveOrNull' documentation",
        level = DeprecationLevel.ERROR,
        replaceWith = ReplaceWith("receiveCatching().getOrNull()")
    ) // Warning since 1.3.0, error in 1.5.0, cannot be hidden due to deprecated extensions
    public suspend fun receiveOrNull(): E? = receiveCatching().getOrNull()

    /**
     * This function was deprecated since 1.3.0 and is no longer recommended to use
     * or to implement in subclasses.
     * See [receiveOrNull] documentation.
     *
     * @suppress **Deprecated**: in favor of onReceiveCatching extension.
     */
    @Suppress("DEPRECATION_ERROR")
    @Deprecated(
        message = "Deprecated in favor of onReceiveCatching extension",
        level = DeprecationLevel.ERROR,
        replaceWith = ReplaceWith("onReceiveCatching")
    ) // Warning since 1.3.0, error in 1.5.0, will be hidden or removed in 1.7.0
    public val onReceiveOrNull: SelectClause1<E?> get() = (this as BufferedChannel<E>).onReceiveOrNull
}
```

```kotlin
public interface Channel<E> : SendChannel<E>, ReceiveChannel<E> {
    /**
     * Constants for the channel factory function `Channel()`.
     */
    public companion object Factory {
        /**
         * Requests a channel with an unlimited capacity buffer in the `Channel(...)` factory function.
         */
        public const val UNLIMITED: Int = Int.MAX_VALUE

        /**
         * Requests a rendezvous channel in the `Channel(...)` factory function &mdash; a channel that does not have a buffer.
         */
        public const val RENDEZVOUS: Int = 0

        /**
         * Requests a conflated channel in the `Channel(...)` factory function. This is a shortcut to creating
         * a channel with [`onBufferOverflow = DROP_OLDEST`][BufferOverflow.DROP_OLDEST].
         */
        public const val CONFLATED: Int = -1

        /**
         * Requests a buffered channel with the default buffer capacity in the `Channel(...)` factory function.
         * The default capacity for a channel that [suspends][BufferOverflow.SUSPEND] on overflow
         * is 64 and can be overridden by setting [DEFAULT_BUFFER_PROPERTY_NAME] on JVM.
         * For non-suspending channels, a buffer of capacity 1 is used.
         */
        public const val BUFFERED: Int = -2

        // only for internal use, cannot be used with Channel(...)
        internal const val OPTIONAL_CHANNEL = -3

        /**
         * Name of the property that defines the default channel capacity when
         * [BUFFERED] is used as parameter in `Channel(...)` factory function.
         */
        public const val DEFAULT_BUFFER_PROPERTY_NAME: String = "kotlinx.coroutines.channels.defaultBuffer"

        internal val CHANNEL_DEFAULT_CAPACITY = systemProp(DEFAULT_BUFFER_PROPERTY_NAME,
            64, 1, UNLIMITED - 1
        )
    }
}
```

- 두 인터페이스는 구분되어 있고, 채널의 진입점을 제한하기 위해 둘 중 하나만 노출시키는 것도 가능
- send, receive 모두 중단 함수라는 것을 확인할 수 있음
  - **원소를 보내고 받는 함수가 중단 함수인 것은 필수적인 특징**
- receive 를 호출했는데 채널에 원소가 없는 경우
  - 코루틴은 원소가 들어올 때까지 중단됨
- send 를 호출했는데 채널의 용량이 다 찼을 경우 중단됨
  - 대부분의 채널은 용량이 제한되어 있다는 걸 나중에 확인 가능
- 만약 중단 함수가 아닌 함수로 보내거나 받아야 한다면?
  - trySend, tryReceive 를 사용할 수 있음
  - 두 연산 모두 성공했는지 실패했는지에 대한 정보를 담고 있는 ChannelResult 를 즉시 반환
  - 용량이 제한적인 채널에만 사용 가능
    - (버퍼가 없는) 랑데뷰 채널에서는 작동하지 않기 때문
- 채널은 송신자와 수신자의 수에 제한이 없음
- 하지만 채널의 양쪽 끝에 각각 하나의 코루틴만 있는 경우가 가장 일반적
- 채널의 가장 간단한 예

  - 각기 다른 코루틴에 생성자(송신자)와 소비자(수신자)가 있어야 함
  - 생성자는 원소를 보내고, 소비자는 원소를 받음
  - 아래가 그 예

  ```kotlin
  suspend fun main(): Unit =
      coroutineScope {
          val channel = Channel<Int>()
          launch {
              repeat(5) { index ->
                  delay(1000)
                  println("Producing next one")
                  channel.send(index * 2)
              }
          }

          launch {
              repeat(5) {
                  val received = channel.receive()
                  println(received)
              }
          }
      }

  // (1 sec)
  // Producing next one
  // 0
  // (1 sec)
  // Producing next one
  // 2
  // (1 sec)
  // Producing next one
  // 4
  // (1 sec)
  // Producing next one
  // 6
  // (1 sec)
  // Producing next one
  // 8
  ```

- 위와 같은 구현 방식은 불완전함

  - 수신자는 얼마나 많은 원소를 보내는 지 알아야 함
  - **수신자가 이런 정보를 아는 경우는 별로 없기에, 송신자가 보내는 만큼 수신자가 기다리는 방식을 선호**
  - 채널이 닫힐 때까지 원소를 받기 위해 for 루프 또는 consumeEach 함수를 사용할 수 있음

  ```kotlin
  suspend fun main(): Unit =
      coroutineScope {
          val channel = Channel<Int>()
          launch {
              repeat(5) { index ->
                  println("Producing next one")
                  delay(1000)
                  channel.send(index * 2)
              }
              channel.close()
          }

          launch {
              channel.consumeEach { element ->
                  println(element)
              }
              // or
  //            for (element in channel) {
  //                println(element)
  //            }
          }
      }

  // Producing next one
  // (1 sec)
  // Producing next one
  // 0
  // (1 sec)
  // Producing next one
  // 2
  // (1 sec)
  // Producing next one
  // 4
  // (1 sec)
  // Producing next one
  // 6
  // (1 sec)
  // 8
  ```

- 위와 같이 원소를 보내는 방식의 문제점

  - 예외가 발생했을 때 채널을 닫는 걸 깜박하기 쉽다는 것
  - 예외로 인해 코루틴이 원소를 보내는 걸 중단하면, 다른 코루틴은 원소를 영원히 기다려야 함 😱
  - ReceiveChannel 을 반환하는 코루틴 빌더인 produce 함수를 사용하는 것이 좀 더 편리함
  - produce 함수는 빌더로 시작된 코루틴이 어떻게 종료되든 상관없이 채널을 닫음
    - 끝나거나, 중단되거나, 취소되거나
  - 따라서 반드시 close 를 호출함
  - produce 빌더는 채널을 만드는 가장 인기있고, 안전하고, 편리한 방법

  ```kotlin
  @OptIn(ExperimentalCoroutinesApi::class)
  suspend fun main(): Unit =
      coroutineScope {
          val channel =
              produce {
                  repeat(5) { index ->
                      println("Producing next one")
                      delay(1000)
                      send(index * 2)
                  }
              }

          for (element in channel) {
              println(element)
          }
      }

  // Producing next one
  // (1 sec)
  // 0
  // Producing next one
  // (1 sec)
  // 2
  // Producing next one
  // (1 sec)
  // 4
  // Producing next one
  // (1 sec)
  // 6
  // Producing next one
  // (1 sec)
  // 8
  ```

## 채널 타입

- 설정한 용량 크기에 따라 네 가지로 구분
- 무제한 (Unlimited)
  - 제한 없는 용량 버퍼를 가진 `Channel.UNLIMITED` 로 설정된 채널
  - send 가 중단되지 않음
- 버퍼 (Buffered)
  - 특정 용량 크기 또는 `Channel.BUFFERED` 로 설정된 채널
  - Channel.BUFFERED
    - 기본 값은 64
    - JVM 의 kotlinx.coroutines.channels.defaultBuffer 를 설정하면 오버라이드 가능
- 랑데뷰 (Rendezvous)
  - ‘약속’을 의미
  - 용량이 0 이거나 `Channel.RENDEZVOUS` 인 채널
  - `Channel.RENDEZVOUS`
    - 용량이 0
  - 송신자와 수신자가 만날 때만 원소를 교환함
- 융합 (Conflated)
  - 버퍼의 크기가 1인 `Channel.CONFLATED` 를 가진 채널
  - 새로운 원소가 이전 원소를 대체
- 채널이 가진 용량을 실제 예를 보면서 확인해보자

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main(): Unit =
    coroutineScope {
        val channel =
            produce(capacity = Channel.UNLIMITED) {
                repeat(5) { index ->
                    send(index * 2)
                    delay(100)
                    println("Sent")
                }
            }

        delay(1000)
        for (element in channel) {
            println(element)
            delay(1000)
        }
    }

// Sent
// (0.1 sec)
// Sent
// (0.1 sec)
// Sent
// (0.1 sec)
// Sent
// (0.1 sec)
// Sent
// (1 - 4 * 0.1 = 0.6 sec)
// 0
// (1 sec)
// 2
// (1 sec)
// 4
// (1 sec)
// 6
// (1 sec)
// 8
// (1 sec)
```

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main(): Unit =
    coroutineScope {
        val channel =
            produce(capacity = 3) {
                repeat(5) { index ->
                    send(index * 2)
                    delay(100)
                    println("Sent")
                }
            }

        delay(1000)
        for (element in channel) {
            println(element)
            delay(1000)
        }
    }

// Sent
// (0.1 sec)
// Sent
// (0.1 sec)
// Sent
// (1 - 2 * 0.1 = 0.8 sec)
// 0
// Sent
// (1 sec)
// 2
// Sent
// (1 sec)
// 4
// (1 sec)
// 6
// (1 sec)
// 8
// (1 sec)
```

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main(): Unit =
    coroutineScope {
        val channel =
            produce {
                // or produce(capacity = Channel.RENDEZVOUS) {
                // - because Channel.RENDEZVOUS = 0
                repeat(5) { index ->
                    send(index * 2)
                    delay(100)
                    println("Sent")
                }
            }

        delay(1000)
        for (element in channel) {
            println(element)
            delay(1000)
        }
    }

// (1 sec)
// 0
// Sent
// (1 sec)
// 2
// Sent
// (1 sec)
// 4
// Sent
// (1 sec)
// 6
// Sent
// (1 sec)
// 8
// Sent
// (1 sec)
```

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
suspend fun main(): Unit =
    coroutineScope {
        val channel =
            produce(capacity = Channel.CONFLATED) {
                repeat(5) { index ->
                    send(index * 2)
                    delay(100)
                    println("Sent")
                }
            }

        delay(1000)
        for (element in channel) {
            println(element)
            delay(1000)
        }
    }

// Sent
// (0.1 sec)
// Sent
// (0.1 sec)
// Sent
// (0.1 sec)
// Sent
// (0.1 sec)
// Sent
// (1 - 4 * 0.1 = 0.6 sec)
// 8
```

## 버퍼 오버플로일 때

- 채널을 커스텀화하기 위해 버퍼가 꽉 찼을 때의 행동을 정의할 수 있음
  - onBufferOverflow 파라미터
  ```kotlin
  internal fun <E> CoroutineScope.produce(
      context: CoroutineContext = EmptyCoroutineContext,
      capacity: Int = 0,
      onBufferOverflow: BufferOverflow = BufferOverflow.SUSPEND,
      start: CoroutineStart = CoroutineStart.DEFAULT,
      onCompletion: CompletionHandler? = null,
      @BuilderInference block: suspend ProducerScope<E>.() -> Unit
  ): ReceiveChannel<E> {
      val channel = Channel<E>(capacity, onBufferOverflow)
      val newContext = newCoroutineContext(context)
      val coroutine = ProducerCoroutine(newContext, channel)
      if (onCompletion != null) coroutine.invokeOnCompletion(handler = onCompletion)
      coroutine.start(start, coroutine, block)
      return coroutine
  }
  ```
- 옵션

  ```kotlin
  public enum class BufferOverflow {
      /**
       * Suspend on buffer overflow.
       */
      SUSPEND,

      /**
       * Drop **the oldest** value in the buffer on overflow, add the new value to the buffer, do not suspend.
       */
      DROP_OLDEST,

      /**
       * Drop **the latest** value that is being added to the buffer right now on buffer overflow
       * (so that buffer contents stay the same), do not suspend.
       */
      DROP_LATEST
  }
  ```

  - SUSPEND
    - 기본 옵션
    - 버퍼가 가득 찼을 때, **send 메서드가 중단됨**
  - DROP_OLDEST
    - 버퍼가 가득 찼을 때, **가장 오래된 원소가 제거됨**
  - DROP_LATEST
    - 버퍼가 가득 찼을 때, **가장 최근의 원소가 제거됨**

- 채널 용량 중 Channel.CONFLATED 는 용량을 1로 설정하고 onBufferOverflow 를 DROP_OLDEST 로 설정한 것을 알 수 있음

  ```kotlin
  public fun <E> Channel(
      capacity: Int = RENDEZVOUS,
      onBufferOverflow: BufferOverflow = BufferOverflow.SUSPEND,
      onUndeliveredElement: ((E) -> Unit)? = null
  ): Channel<E> =
      when (capacity) {
          RENDEZVOUS -> {
              if (onBufferOverflow == BufferOverflow.SUSPEND)
                  BufferedChannel(RENDEZVOUS, onUndeliveredElement) // an efficient implementation of rendezvous channel
              else
                  ConflatedBufferedChannel(1, onBufferOverflow, onUndeliveredElement) // support buffer overflow with buffered channel
          }
          CONFLATED -> {
              require(onBufferOverflow == BufferOverflow.SUSPEND) {
                  "CONFLATED capacity cannot be used with non-default onBufferOverflow"
              }
              ConflatedBufferedChannel(1, BufferOverflow.DROP_OLDEST, onUndeliveredElement)
          }
          UNLIMITED -> BufferedChannel(UNLIMITED, onUndeliveredElement) // ignores onBufferOverflow: it has buffer, but it never overflows
          BUFFERED -> { // uses default capacity with SUSPEND
              if (onBufferOverflow == BufferOverflow.SUSPEND) BufferedChannel(CHANNEL_DEFAULT_CAPACITY, onUndeliveredElement)
              else ConflatedBufferedChannel(1, onBufferOverflow, onUndeliveredElement)
          }
          else -> {
              if (onBufferOverflow === BufferOverflow.SUSPEND) BufferedChannel(capacity, onUndeliveredElement)
              else ConflatedBufferedChannel(capacity, onBufferOverflow, onUndeliveredElement)
          }
      }
  ```

  - `require(onBufferOverflow == BufferOverflow.SUSPEND)` 조건이 좀 특이한 것으로 보임
  - 현재 produce 함수에서 onBufferOverflow 를 설정할 수 없으므로, 오버플로 옵션을 변경하려면 Channel 함수를 사용해 채널을 정의해야 함

  ```kotlin
  suspend fun main(): Unit =
      coroutineScope {
          val channel =
              Channel<Int>(
                  capacity = 2,
                  onBufferOverflow = BufferOverflow.DROP_OLDEST,
              )

          launch {
              repeat(5) { index ->
                  channel.send(index * 2)
                  delay(100)
                  println("Sent")
              }
              channel.close()
          }

          delay(1000)
          for (element in channel) {
              println(element)
              delay(1000)
          }
      }

  // Sent
  // (0.1 sec)
  // Sent
  // (0.1 sec)
  // Sent
  // (0.1 sec)
  // Sent
  // (0.1 sec)
  // Sent
  // (1 - 4 * 0.1 = 0.6 sec)
  // 6
  // (1 sec)
  // 8
  ```

## 전달되지 않은 원소 핸들러

- Channel 함수에서 반드시 알아야 하는 또 다른 파라미터 onUndeliveredElement

```kotlin
public fun <E> Channel(
    capacity: Int = RENDEZVOUS,
    onBufferOverflow: BufferOverflow = BufferOverflow.SUSPEND,
    **onUndeliveredElement: ((E) -> Unit)? = null**
): Channel<E> =
    when (capacity) {
        RENDEZVOUS -> {
            if (onBufferOverflow == BufferOverflow.SUSPEND)
                BufferedChannel(RENDEZVOUS, onUndeliveredElement) // an efficient implementation of rendezvous channel
            else
                ConflatedBufferedChannel(1, onBufferOverflow, onUndeliveredElement) // support buffer overflow with buffered channel
        }
        CONFLATED -> {
            require(onBufferOverflow == BufferOverflow.SUSPEND) {
                "CONFLATED capacity cannot be used with non-default onBufferOverflow"
            }
            ConflatedBufferedChannel(1, BufferOverflow.DROP_OLDEST, onUndeliveredElement)
        }
        UNLIMITED -> BufferedChannel(UNLIMITED, onUndeliveredElement) // ignores onBufferOverflow: it has buffer, but it never overflows
        BUFFERED -> { // uses default capacity with SUSPEND
            if (onBufferOverflow == BufferOverflow.SUSPEND) BufferedChannel(CHANNEL_DEFAULT_CAPACITY, onUndeliveredElement)
            else ConflatedBufferedChannel(1, onBufferOverflow, onUndeliveredElement)
        }
        else -> {
            if (onBufferOverflow === BufferOverflow.SUSPEND) BufferedChannel(capacity, onUndeliveredElement)
            else ConflatedBufferedChannel(capacity, onBufferOverflow, onUndeliveredElement)
        }
    }
```

- 어떠한 이유로 처리되지 않았을 때 호출됨
- 주로 채널에서 보낸 자원을 닫을 때 사용됨

## 팬아웃(Fan-out)

- 여러 개의 코루틴이 하나의 채널로부터 원소를 받을 수도 있음
- 하지만 원소를 적절히 처리하려면 **반드시 for 루프를 사용해야 함**
  - consumeEach 는 여러 개의 코루틴이 사용하기에는 안전하지 않습니다. `why?`

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
private fun CoroutineScope.produceNumbers() =
    produce {
        repeat(10) {
            delay(100)
            send(it)
        }
    }

private fun CoroutineScope.launchProcessor(
    id: Int,
    channel: ReceiveChannel<Int>,
) = launch {
    for (msg in channel) {
        println("#$id received $msg")
    }
}

suspend fun main(): Unit =
    coroutineScope {
        val channel = produceNumbers()
        repeat(3) { id ->
            delay(10)
            launchProcessor(id, channel)
        }
    }

// #0 received 0
// #1 received 1
// #2 received 2
// #0 received 3
// #1 received 4
// #2 received 5
// #0 received 6
// #1 received 7
// #2 received 8
// #0 received 9
```

- 원소는 공평하게 배분됨
- 채널은 원소를 기다리는 코루틴들을 FIFO 큐로 가지고 있음
- 위 예제에서 코루틴이 순차적으로 원소를 받는 이유 (0, 1, 2, 0, 1, 2, …)

## 팬인(Fan-in)

- 여러 개의 코루틴이 하나의 채널로 원소를 전송할 수 있음

```kotlin
private suspend fun sendString(
    channel: SendChannel<String>,
    text: String,
    time: Long,
) {
    while (true) {
        delay(time)
        channel.send(text)
    }
}

fun main() =
    runBlocking {
        val channel = Channel<String>()
        launch { sendString(channel, "foo", 200L) }
        launch { sendString(channel, "BAR!", 500L) }
        repeat(50) {
            println(channel.receive())
        }
        coroutineContext.cancelChildren()
    }

// (200 ms)
// foo
// (200 ms)
// foo
// (100 ms)
// BAR!
// (100 ms)
// foo
// (200 ms)
// ...
```

- 다수의 채널을 하나의 채널로 합쳐야 할 경우가 있음
  - 이런 경우 produce 함수로 여러 개의 채널을 합치는 `fanIn` 함수를 사용할 수 있음
  ```kotlin
  @OptIn(ExperimentalCoroutinesApi::class)
  private fun <T> CoroutineScope.fanIn(channels: List<ReceiveChannel<T>>): ReceiveChannel<T> =
      produce {
          for (channel in channels) {
              launch {
                  for (elem in channel) {
                      send(elem)
                  }
              }
          }
      }
  ```

## 파이프라인

- 한 채널로부터 받은 원소를 다른 채널로 전송하는 경우를 파이프라인이라고 부름

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
private fun CoroutineScope.numbers(): ReceiveChannel<Int> =
    produce {
        repeat(3) { num ->
            send(num + 1)
        }
    }

@OptIn(ExperimentalCoroutinesApi::class)
private fun CoroutineScope.square(numbers: ReceiveChannel<Int>) =
    produce {
        for (num in numbers) {
            send(num * num)
        }
    }

suspend fun main() =
    coroutineScope {
        val numbers = numbers()
        val squared = square(numbers)
        for (num in squared) {
            println(num)
        }
    }

// 1
// 4
// 9
```

## 통신의 기본 형태로서의 채널

- 채널은 서로 다른 코루틴이 통신할 때 유용함
- 충돌이 발생하지 않으며 공평함을 보장
  - 공유 상태로 인한 문제가 일어나지 않음
- 예시
  - 여러 바리스타가 커피를 만드는 상황
  - 각각의 바리스타는 서로 독립적으로 작업을 수행하는 코루틴이라 할 수 있음
  - 커피의 종류가 다르면 준비하는 데 걸리는 시간도 다르지만, 주문은 받은 순서대로 처리하고 싶음
  - 이를 해결하는 가장 쉬운 방법
    - 주문을 채널로 받고 만들어진 커피를 다른 채널로 보내는 것
  - 바리스타는 produce 빌더를 사용해 정의할 수 있음
  ```kotlin
  fun CoroutineScope.serveOrders(
      orders: ReceiveChannel<Order>,
      baristaName: String
  ): ReceiveChannel<CoffeeResult> = produce {
      for (order in orders) {
          val coffee = prepareCoffee(order.type)
          send(CoffeeResult(coffee, order.customer, baristaName))
      }
  }
  ```
  - 파이프라인을 설정하고 이전에 정의한 fanIn 함수를 사용해 다른 바리스타들이 생성한 결과를 하나로 합칠 수 있음

## 실제 사용 예

- 온라인 쇼핑몰
  - 엄청난 수의 판매자들이 제공하는 상품 정보가 변경되는 것을 감지해야 함
  - 판매자가 정보를 변경할 때마다 갱신해야 할 상품 리스트를 찾고, 하나씩 업데이트하게 됨
- 음… 채널을 제공해서 잘 처리해보자.

## 요약

- 채널은 코루틴끼리 통신할 때 사용하는 강력한 기본 도구
- 송신자와 수신자의 수에 제한이 없음
- 채널을 통해 보내진 데이터는 단 한 번 받는 것이 보장됨
- 보통 produce 빌더를 통해 채널을 생성
- 채널은 특정 작업에 사용되는 코루틴의 수를 조절하는 파이프라인을 설정할 때 사용될 수 있음
- 최근에는 플로우를 채널과 연결해서 사용하는 경우가 많음
