+++
date = 2024-09-27T23:30:00+09:00
title = "[Spring AI] ChatClient 생성하기"
authors = ["Ji-Hoon Kim"]
tags = ["Spring AI"]
categories = ["Spring AI"]
series = ["Spring AI"]
+++

## Introduction

- ChatClient 을 생성하는 두 가지 방법을 설명하고자 한다.
- 우선 `application.yaml` 에서 `spring.ai.openai.api-key` 에 발급받은 API KEY 를 설정해두도록 하자.

## ChatClient 생성

- ChatClient 를 생성하는 방법은 크게 2가지 방법이 있다.
  - Autoconfigured 된 ChatClient.Builder 사용하는 방식
  - 프로그래밍 방식

### Autoconfigured 된 ChatClient.Builder 사용하는 방식

- ChatClient.Builder 를 통해 ChatClient Bean 을 아래와 같이 추가할 수 있다.

```kotlin
@Bean
fun chatClientAutoconfigured(chatClientBuilder: ChatClient.Builder): ChatClient = chatClientBuilder.build()
```

### 프로그래밍 방식

- 아래처럼 직접 작성하는 방식으로도 생성할 수 있다.

```kotlin
@Bean
fun chatClientProgrammatically(
    @Value("\${spring.ai.openai.api-key}") apiKey: String,
): ChatClient {
    val openAiChatModel = OpenAiChatModel(OpenAiApi(apiKey))
    return ChatClient.create(openAiChatModel)
}
```

## 간단하게 응답 받아보기

- 위에서 만들어둔 ChatClient 들로 간단하게 응답을 받아보도록 하자
- 간단한 서비스는 아래와 같다.

```kotlin
@Service
class BasicAiService(
    private val chatClientAutoconfigured: ChatClient,
    private val chatClientProgrammatically: ChatClient,
) {
    fun generationWithAutoconfigured(userInput: String): String =
        chatClientAutoconfigured
            .prompt()
            .user(userInput)
            .call()
            .content()

    fun generationWithProgrammatically(userInput: String): String =
        chatClientProgrammatically
            .prompt()
            .user(userInput)
            .call()
            .content()
}

```

- `call()` 메서드는 AI 모델에 요청을 보내고, `content()` 메서드는 AI 모델의 응답을 `String` 으로 반환한다.
- 이제 Controller, http 파일을 아래와 같이 추가하고 호출해보도록 하자.

```kotlin
@RestController
class AiController(
    private val basicAiService: BasicAiService,
) {
    @PostMapping("/generation/autoconfigured")
    fun generationWithAutoconfigured(
        @RequestBody question: Question,
    ): Answer = basicAiService.generationWithAutoconfigured(question.text).toAnswer()

    @PostMapping("/generation/programmatically")
    fun generationWithProgrammatically(
        @RequestBody question: Question,
    ): Answer = basicAiService.generationWithProgrammatically(question.text).toAnswer()
}

```

- request

```json
### Generation With Autoconfigured
POST localhost:8080/generation/autoconfigured
Content-Type: application/json

{
  "text": "Tell me a joke"
}

### generationWithProgrammatically
POST localhost:8080/generation/programmatically
Content-Type: application/json

{
  "text": "Tell me a joke"
}

```

- 순서대로 아래의 응답을 받았다.

```json
{
  "text": "Sure, here's a light-hearted joke for you:\n\nWhy don't skeletons fight each other?\n\nThey don't have the guts!"
}
```

```json
{
  "text": "Sure, here's one for you:\n\nWhy don't scientists trust atoms?\n\nBecause they make up everything!"
}
```

## References

- https://docs.spring.io/spring-ai/reference/api/chatclient.html
