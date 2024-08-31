+++
date = 2024-09-01T01:30:00+09:00
lastmod = 2024-09-01
title = "Kotlin으로 유저 Input 테스트 코드 작성하기"
authors = ["Ji-Hoon Kim"]
tags = ["Kotlin", "Testing"]
categories = ["Kotlin", "Testing"]
series = ["Kotlin", "Testing"]
+++

![](/images/logos/kotlin-logo.png)

## Introduction

- 이번에 “코틀린 아카데미: 핵심편” 을 읽으면서, 연습문제를 모두 풀어보았고 (책에 없는 연습문제까지), 해당 연습문제를 풀던 도중 유저 input 에 대한 테스트 코드 작성을 해야 했고, 이를 해결하면서 얻은 경험을 공유하고자 글을 작성하게 되었다.

## 문제

- 다음은 테스트 코드를 작성해야 하는 서비스 코드다.

```kotlin
package essentials.exceptions.handleexceptions

fun main() {
    while (true) {
        // Wrap below function call with try-catching block,
        // and handle possible exceptions.
        handleInput()
    }
}

fun handleInput() {
    print("Enter the first number: ")
    val num1 = readln().toInt()
    print("Enter an operator (+, -, *, /): ")
    val operator = readln()
    print("Enter the second number: ")
    val num2 = readln().toInt()

    val result = when (operator) {
        "+" -> num1 + num2
        "-" -> num1 - num2
        "*" -> num1 * num2
        "/" -> num1 / num2
        else -> throw IllegalOperatorException(operator)
    }

    println("Result: $result")
}

class IllegalOperatorException(val operator: String) :
    Exception("Unknown operator: $operator")

```

- https://github.com/MarcinMoskala/kotlin-exercises/blob/master/src/main/kotlin/essentials/exceptions/HandleExceptions.kt
- 위 코드에서 `readln()` 이 부분이 유저의 input 을 받는 부분이다.
- 실제로 main 메서드를 실행하면 터미널에서 사용자의 입력을 기다리고 있다.
- 그러면 어떻게 모킹해야할까? 우선 해당 코드가 어떻게 호출되는건지 확인해보자.

## 분석

- `readln()` 의 내부를 보면 아래와 같다.
  - 내부 호출 메서드를 계속해서 적어보겠다.

```kotlin
@SinceKotlin("1.6")
public actual fun readln(): String = readlnOrNull() ?: throw ReadAfterEOFException("EOF has already been reached")

@SinceKotlin("1.6")
public actual fun readlnOrNull(): String? = readLine()

public fun readLine(): String? = LineReader.readLine(System.`in`, Charset.defaultCharset())

internal object LineReader {
    private const val BUFFER_SIZE: Int = 32
    private lateinit var decoder: CharsetDecoder
    private var directEOL = false
    private val bytes = ByteArray(BUFFER_SIZE)
    private val chars = CharArray(BUFFER_SIZE)
    private val byteBuf: ByteBuffer = ByteBuffer.wrap(bytes)
    private val charBuf: CharBuffer = CharBuffer.wrap(chars)
    private val sb = StringBuilder()

    /**
     * Reads line from the specified [inputStream] with the given [charset].
     * The general design:
     * * This function contains only fast path code and all it state is kept in local variables as much as possible.
     * * All the slow-path code is moved to separate functions and the call-sequence bytecode is minimized for it.
     */
    @Synchronized
    fun readLine(inputStream: InputStream, charset: Charset): String? { // charset == null -> use default
        if (!::decoder.isInitialized || decoder.charset() != charset) updateCharset(charset)
        var nBytes = 0
        var nChars = 0
        while (true) {
            val readByte = inputStream.read()
            if (readByte == -1) {
                // The result is null only if there was absolutely nothing read
                if (sb.isEmpty() && nBytes == 0 && nChars == 0) {
                    return null
                } else {
                    nChars = decodeEndOfInput(nBytes, nChars) // throws exception if partial char
                    break
                }
            } else {
                bytes[nBytes++] = readByte.toByte()
            }
            // With "directEOL" encoding bytes are batched before being decoded all at once
            if (readByte == '\n'.code || nBytes == BUFFER_SIZE || !directEOL) {
                // Decode the bytes that were read
                byteBuf.limit(nBytes) // byteBuf position is always zero
                charBuf.position(nChars) // charBuf limit is always BUFFER_SIZE
                nChars = decode(false)
                // Break when we have decoded end of line
                if (nChars > 0 && chars[nChars - 1] == '\n') {
                    byteBuf.position(0) // reset position for next use
                    break
                }
                // otherwise we're going to read more bytes, so compact byteBuf
                nBytes = compactBytes()
            }
        }
        // Trim the end of line
        if (nChars > 0 && chars[nChars - 1] == '\n') {
            nChars--
            if (nChars > 0 && chars[nChars - 1] == '\r') nChars--
        }
        // Fast path for short lines (don't use StringBuilder)
        if (sb.isEmpty()) return String(chars, 0, nChars)
        // Copy the rest of chars to StringBuilder
        sb.append(chars, 0, nChars)
        // Build the result
        val result = sb.toString()
        if (sb.length > BUFFER_SIZE) trimStringBuilder()
        sb.setLength(0)
        return result
    }

    // The result is the number of chars in charBuf
    private fun decode(endOfInput: Boolean): Int {
        while (true) {
            val coderResult: CoderResult = decoder.decode(byteBuf, charBuf, endOfInput)
            if (coderResult.isError) {
                resetAll() // so that next call to readLine starts from clean state
                coderResult.throwException()
            }
            val nChars = charBuf.position()
            if (!coderResult.isOverflow) return nChars // has room in buffer -- everything possible was decoded
            // overflow (charBuf is full) -- offload everything from charBuf but last char into sb
            sb.append(chars, 0, nChars - 1)
            charBuf.position(0)
            charBuf.limit(BUFFER_SIZE)
            charBuf.put(chars[nChars - 1]) // retain last char
        }
    }

    // Slow path -- only on long lines (extra call to decode will be performed)
    private fun compactBytes(): Int = with(byteBuf) {
        compact()
        return position().also { position(0) }
    }

    // Slow path -- only on end of input
    private fun decodeEndOfInput(nBytes: Int, nChars: Int): Int {
        byteBuf.limit(nBytes) // byteBuf position is always zero
        charBuf.position(nChars) // charBuf limit is always BUFFER_SIZE
        return decode(true).also { // throws exception if partial char
            // reset decoder and byteBuf for next use
            decoder.reset()
            byteBuf.position(0)
        }
    }

    // Slow path -- only on charset change
    private fun updateCharset(charset: Charset) {
        decoder = charset.newDecoder()
        // try decoding ASCII line separator to see if this charset (like UTF-8) encodes it directly
        byteBuf.clear()
        charBuf.clear()
        byteBuf.put('\n'.code.toByte())
        byteBuf.flip()
        decoder.decode(byteBuf, charBuf, false)
        directEOL = charBuf.position() == 1 && charBuf.get(0) == '\n'
        resetAll()
    }

    // Slow path -- only on exception in decoder and on charset change
    private fun resetAll() {
        decoder.reset()
        byteBuf.position(0)
        sb.setLength(0)
    }

    // Slow path -- only on long lines
    private fun trimStringBuilder() {
        sb.setLength(BUFFER_SIZE)
        sb.trimToSize()
    }
}
```

- LineReader 이라는 internal object 의 메서드를 사용하고 있어서 접근은 불가했고, System.`in` 를 통해 처리한다고 보면 된다.
- 음… System.`in` 를 잘 핸들링하면 왠지 모킹이 될 것 같아서 찾아보았다.

## 해결

- System.`in` 를 어떻게 모킹하면 될지 검색하던 도중 https://www.baeldung.com/java-junit-testing-system-in 글을 보게 되었다.
- 여기서 Core Java 의 `System.setIn(testIn);` 사용하는 부분이 쓰기 편해보였다.
  - 굳이 다른 라이브러리 사용없이 바로 적용할 수 있으니까
- 그리고 사용하기 편하게 메서드를 아래와 같이 작성해보았다.

```kotlin
private fun <T> mockUserInput(
    vararg input: String,
    block: () -> T,
): T {
    val testIn = ByteArrayInputStream(input.joinToString("\n").toByteArray())
    System.setIn(testIn)

    return block.invoke()
}
```

- 위와 같이 작성한 이유는 다음과 같다.
  - 먼저 테스트에서는 유저의 input 을 여러 개 받아야 한다.
    - 이 부분을 어떻게 처리하면 좋을까 고민하던 도중 `\n` 을 통해 입력을 설정해두면 알아서 잘라 들어온다는 것을 알게 되었다.
    - 그리고 메서드 파라미터로 `vararg` 를 통해 편하게 사용할 수 있도록 처리했다.
  - 그리고 사용하기 편하게 `block` 메서드를 파라미터로 받아, 설정한 후 바로 사용할 수 있도록 하였다.
- 실제로 적용한 테스트 코드는 아래와 같다.

```kotlin
class HandleExceptionsTest {
    private val sut = HandleExceptions()

    private fun <T> mockUserInput(
        vararg input: String,
        block: () -> T,
    ): T {
        val testIn = ByteArrayInputStream(input.joinToString("\n").toByteArray())
        System.setIn(testIn)

        return block.invoke()
    }

    private fun String.withPrintResult(): String {
        println("\nresult: `$this`")
        return this
    }

    @Test
    fun wrongNumberTest() {
        val result =
            mockUserInput("NaN", "/", "NaN") {
                assertDoesNotThrow {
                    sut.handleInputWithoutExceptions()
                }
            }.withPrintResult()

        assertThat(result).startsWith("Invalid input: ")
    }

    @Test
    fun divisionByZeroTest() {
        val result =
            mockUserInput("0", "/", "0") {
                assertDoesNotThrow {
                    sut.handleInputWithoutExceptions()
                }
            }.withPrintResult()

        assertEquals("Division by zero", result)
    }

    @Test
    fun illegalOperatorExceptionTest() {
        val result =
            mockUserInput("0", "//", "0") {
                assertDoesNotThrow {
                    sut.handleInputWithoutExceptions()
                }
            }.withPrintResult()

        assertThat(result).startsWith("Illegal operator: ")
    }

    @ParameterizedTest
    @CsvSource(
        "1,+,1,2",
        "1,-,2,-1",
        "2,*,3,6",
        "4,/,2,2",
        "4,/,3,1",
    )
    fun withoutAnyExceptionsTest(
        num1: String,
        operator: String,
        num2: String,
        expected: String,
    ) {
        val result =
            mockUserInput(num1, operator, num2) {
                assertDoesNotThrow {
                    sut.handleInputWithoutExceptions()
                }
            }.withPrintResult()

        assertEquals("Result: $expected", result)
    }
}

```

- https://github.com/bossm0n5t3r/kotlin-essentials/blob/master/src/test/kotlin/essentials/chapter13/HandleExceptionsTest.kt

## References

- https://www.baeldung.com/java-junit-testing-system-in
- https://github.com/bossm0n5t3r/kotlin-essentials/blob/master/src/test/kotlin/essentials/chapter13/HandleExceptionsTest.kt
