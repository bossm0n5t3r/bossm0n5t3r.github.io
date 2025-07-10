+++
date = 2025-07-11T03:00:00+09:00
title = "Koog 라이브러리로 MCP 서버 연결하기: Kotlin 기반 AI 에이전트 개발 가이드"
authors = ["Ji-Hoon Kim"]
tags = ["kotlin", "koog", "mcp"]
categories = ["kotlin", "koog", "mcp"]
series = ["kotlin", "koog", "mcp"]
+++

![](/images/logos/kotlin-logo.png)

## 개요

**Koog**는 JetBrains에서 개발한 Kotlin 기반의 AI 에이전트 프레임워크로, **Model Context Protocol(MCP)** 를 통해 AI 모델과 외부 도구 및 서비스를 연결할 수 있는
표준화된 방법을 제공한다.

MCP는 AI 모델이 외부 데이터 소스와 도구 간의 상호작용을 위한 표준 프로토콜로, USB-C가 다양한 주변기기를 연결하는 것처럼 AI 모델을 다양한 데이터 소스와 도구에 연결하는
표준화된 방법을 제공한다.

## MCP의 핵심 특징

MCP는 다음과 같은 주요 특징을 가지고 있다:

- **JSON-RPC 기반 통신**: 표준 JSON-RPC 2.0 메시지 포맷을 사용하여 상태 기반 연결을 관리
- **보안 중심 설계**: 사용자 동의와 제어를 최우선으로 하며, 도구 사용에 대한 명시적 승인 필요
- **유연한 확장성**: 다양한 리소스 타입을 지원하고 커스텀 도구 및 프롬프트 정의 가능

## Koog의 MCP 통합 아키텍처

Koog 프레임워크는 MCP SDK를 통해 다음과 같은 핵심 컴포넌트를 제공:

| 컴포넌트                      | 역할                                           |
|---------------------------|----------------------------------------------|
| `McpTool`                 | Koog 도구 인터페이스와 MCP SDK 간의 브릿지 역할             |
| `McpToolDescriptorParser` | MCP 도구 정의를 Koog 도구 디스크립터 형식으로 파싱             |
| `McpToolRegistryProvider` | 다양한 전송 메커니즘을 통해 MCP 서버와 연결하는 MCP 도구 레지스트리 생성 |

## MCP 서버 연결 방법

### 1. 전송 메커니즘 설정

MCP 서버와 연결하기 위해 두 가지 전송 프로토콜을 지원:

#### stdio 전송 (프로세스 기반)

```kotlin
// MCP 서버를 프로세스로 시작
val process = ProcessBuilder("path/to/mcp/server").start()

// stdio 전송 생성
val transport = McpToolRegistryProvider.defaultStdioTransport(process)
```

#### SSE 전송 (HTTP 기반)

```kotlin
// SSE 전송 생성
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```

### 2. 도구 레지스트리 생성

전송 메커니즘을 설정한 후 도구 레지스트리를 생성:

```kotlin
// 전송을 통한 도구 레지스트리 생성
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = transport,
    name = "my-client",
    version = "1.0.0"
)
```

### 3. AI 에이전트와 통합

생성된 도구 레지스트리를 AI 에이전트와 통합한다:

```kotlin
// 도구와 함께 에이전트 생성
val agent = AIAgent(
    promptExecutor = executor,
    strategy = strategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry
)

// MCP 도구를 사용하는 작업 실행
val result = agent.run("Use the MCP tool to perform a task")
```

## 실제 구현 예제

### Google Maps MCP 연동 예제

Google Maps API를 사용하여 지리적 정보를 조회하는 MCP 서버 연동 예제:

```kotlin
class GoogleMaps(
    private val openAIApiToken: String,
    private val googleMapsApiKey: String,
) {
    suspend fun run() {
        // Google Maps MCP 서버가 포함된 Docker 컨테이너 시작
        val process =
            ProcessBuilder(
                "docker",
                "run",
                "-i",
                "-e",
                "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
                "mcp/google-maps",
            ).start()

        // MCP 서버로부터 도구 레지스트리 생성
        val toolRegistry =
            McpToolRegistryProvider.fromTransport(
                transport = McpToolRegistryProvider.defaultStdioTransport(process),
            )

        // 에이전트 생성 및 실행
        val agent =
            AIAgent(
                executor = simpleOpenAIExecutor(openAIApiToken),
                llmModel = OpenAIModels.Chat.GPT4o,
                toolRegistry = toolRegistry,
            )
        LOGGER.info(agent.runAndGetResult("Get elevation of the Jetbrains Office in Munich, Germany?"))
    }
}
```

- [https://github.com/bossm0n5t3r/koog-playground/blob/master/src/main/kotlin/me/bossm0n5t3r/mcp/GoogleMaps.kt](https://github.com/bossm0n5t3r/koog-playground/blob/master/src/main/kotlin/me/bossm0n5t3r/mcp/GoogleMaps.kt)

### Playwright MCP 연동 예제

웹 브라우저 자동화를 위한 Playwright MCP 서버 연동 예제:

```kotlin
class Playwright(
    private val googleAIStudioApiKey: String,
) {
    companion object {
        private const val DEFAULT_MCP_PORT = 8931
        private const val DEFAULT_CONNECTION_RETRIES = 10
        private const val DEFAULT_RETRY_DELAY_MS = 2000L
    }

    /**
     * Playwright MCP 를 사용해서 브라우저 자동화를 실행
     * 이 메서드는 Playwright MCP 서버를 실행하고, 연결한 다음, 사전 정의된 작업을 실행합니다.
     */
    suspend fun run() {
        // Playwright MCP 서버 실행
        val process = startPlaywrightMcpServer()

        try {
            // MCP 서버로부터 도구 레지스트리를 생성 (실패시 재시도)
            val serverUrl = "http://localhost:$DEFAULT_MCP_PORT"
            val toolRegistry = createToolRegistryWithRetries(serverUrl)

            // 브라우저 자동화 작업 실행
            executeBrowserTask(toolRegistry)
        } catch (e: Exception) {
            // 예외가 발생하면 process 가 종료되도록 처리
            process.destroy()
            throw e
        }
    }

    /**
     * 정해진 포트로 Playwright MCP 서버를 실행
     */
    private fun startPlaywrightMcpServer(port: Int = DEFAULT_MCP_PORT): Process {
        LOGGER.info("Starting Playwright MCP server on port $port...")
        return ProcessBuilder(
            "npx",
            "@playwright/mcp@latest",
            "--port",
            port.toString(),
        ).start().also {
            LOGGER.info("Playwright MCP server process started")
        }
    }

    /**
     * 제공된 도구 레지스트리를 사용하여 브라우저 자동화 작업을 실행합니다.
     */
    private suspend fun executeBrowserTask(toolRegistry: ToolRegistry) {
        LOGGER.info("Creating AI agent for browser automation...")
        val agent =
            AIAgent(
                executor = simpleGoogleAIExecutor(googleAIStudioApiKey),
                llmModel = GoogleModels.Gemini2_0Flash,
                toolRegistry = toolRegistry,
            )

        LOGGER.info("Executing browser automation task...")
        agent.run("Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar")
        LOGGER.info("Browser automation task completed")
    }

    /**
     * 서버가 시작될 때 지연을 다루기 위해 재시도 로직을 포함하여 도구 레지스트리를 생성합니다.
     */
    private suspend fun createToolRegistryWithRetries(
        url: String,
        retries: Int = DEFAULT_CONNECTION_RETRIES,
        delayMillis: Long = DEFAULT_RETRY_DELAY_MS,
    ): ToolRegistry {
        LOGGER.info("Attempting to connect to Playwright MCP server at $url...")
        var lastException: Exception? = null

        for (attempt in 1..retries) {
            try {
                val transport = McpToolRegistryProvider.defaultSseTransport(url)
                val toolRegistry = McpToolRegistryProvider.fromTransport(transport)
                LOGGER.info("Successfully connected to Playwright MCP server")
                return toolRegistry
            } catch (e: Exception) {
                if (isConnectException(e)) {
                    lastException = e
                    LOGGER.warn("Connection to Playwright MCP server failed (attempt $attempt/$retries). Retrying in ${delayMillis}ms...")
                    delay(delayMillis)
                } else {
                    LOGGER.error("Unexpected error while connecting to Playwright MCP server: ${e.message}")
                    throw e // Re-throw exceptions that are not related to connection refusal
                }
            }
        }

        throw IllegalStateException(
            "Failed to connect to Playwright MCP server at $url after $retries attempts.",
            lastException
        )
    }

    /**
     * 주어진 예외(exception) 또는 그 원인(cause)에 ConnectException이 포함되어 있는지 확인합니다.
     */
    private fun isConnectException(exception: Exception): Boolean {
        var cause: Throwable? = exception
        while (cause != null) {
            if (cause is ConnectException) {
                return true
            }
            cause = cause.cause
        }
        return false
    }
}
```

- [https://github.com/bossm0n5t3r/koog-playground/blob/master/src/main/kotlin/me/bossm0n5t3r/mcp/Playwright.kt](https://github.com/bossm0n5t3r/koog-playground/blob/master/src/main/kotlin/me/bossm0n5t3r/mcp/Playwright.kt)

## 직접 MCP 도구 사용하기

에이전트를 통하지 않고 MCP 도구를 직접 실행할 수도 있다:

```kotlin
// 특정 도구 가져오기
val tool = toolRegistry.getTool("tool-name") as McpTool

// 도구 인수 생성
val args = McpTool.Args(buildJsonObject {
    put("parameter1", "value1")
    put("parameter2", "value2")
})

// 도구 실행
val toolResult = tool.execute(args)
println(toolResult)

// 모든 도구 가져오기
val allTools = toolRegistry.tools
```

## 장점과 활용 분야

### 주요 장점

- **표준화된 통합**: 다양한 데이터 소스와 도구를 표준화된 방식으로 연결
- **개발 효율성**: 각 도구별 맞춤형 구현 없이 표준 프로토콜로 통합
- **보안성**: 사용자 동의 기반의 안전한 데이터 접근
- **확장성**: 새로운 도구 추가가 용이한 모듈식 구조

### 활용 분야

- **개발 도구 통합**: AI 기반 코드 에디터 및 IDE 개발
- **데이터 분석**: 로컬 데이터베이스 및 API 연동
- **웹 자동화**: 브라우저 기반 작업 자동화
- **지리 정보 시스템**: 지도 및 위치 기반 서비스 통합

## 마무리

Koog 라이브러리를 통한 MCP 서버 연결은 AI 에이전트의 기능을 크게 확장시킨다.

표준화된 프로토콜을 통해 다양한 외부 도구와 서비스를 쉽게 통합할 수 있으며, 재사용 가능한 MCP 서버를 통해 개발 효율성을 높일 수 있다.

특히 Kotlin 기반의 타입 안전성과 코루틴 지원으로 안정적이고 효율적인 AI 에이전트 시스템을 구축할 수 있다.

## Links

- [https://docs.koog.ai/model-context-protocol/](https://docs.koog.ai/model-context-protocol/)
- [https://github.com/bossm0n5t3r/koog-playground](https://github.com/bossm0n5t3r/koog-playground)
  - [mcp](https://github.com/bossm0n5t3r/koog-playground/tree/master/src/main/kotlin/me/bossm0n5t3r/mcp)
