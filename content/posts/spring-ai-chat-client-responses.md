+++
date = 2024-10-05T21:00:00+09:00
title = "[Spring AI] ChatClient Responses"
authors = ["Ji-Hoon Kim"]
tags = ["Spring AI"]
categories = ["Spring AI"]
series = ["Spring AI"]
+++

## Introduction

- ChatClient API 에는 3가지 응답 방식이 있다.
- 그 방법들을 하나씩 예시를 통해 정리해보았다.

## ChatResponse 을 반환

- 첫 번째로는 ChatResponse 으로 정의된 타입을 반환하는 방식이다.
- ChatResponse 의 구조는 아래와 같다.

  - https://docs.spring.io/spring-ai/reference/api/chatmodel.html#ChatResponse

  ```java
  public class ChatResponse implements ModelResponse<Generation> {

      private final ChatResponseMetadata chatResponseMetadata;
      private final List<Generation> generations;

      @Override
      public ChatResponseMetadata getMetadata() {...}

      @Override
      public List<Generation> getResults() {...}

      // other methods omitted
  }
  ```

- ChatResponse 로 응답하는 방법은 간단하다.

```kotlin
fun returningAChatResponse(userInput: String): ChatResponse =
    chatClientAutoconfigured
        .prompt()
        .user(userInput)
        .call()
        .chatResponse()
```

- 실제 응답은 아래와 같다.

```json
{
  "result": {
    "output": {
      "messageType": "ASSISTANT",
      "metadata": {
        "refusal": "",
        "finishReason": "STOP",
        "index": 0,
        "id": "chatcmpl-AAi19k1lzSFPpCSnJJp0vuEoeKOHl",
        "role": "ASSISTANT",
        "messageType": "ASSISTANT"
      },
      "toolCalls": [],
      "content": "Sure! Here's a light-hearted joke for you:\n\nWhy don’t skeletons fight each other?\n\nThey don’t have the guts!"
    },
    "metadata": {
      "finishReason": "STOP",
      "contentFilterMetadata": null
    }
  },
  "metadata": {
    "id": "chatcmpl-AAi19k1lzSFPpCSnJJp0vuEoeKOHl",
    "model": "gpt-4o-2024-05-13",
    "rateLimit": {
      "requestsLimit": 500,
      "requestsRemaining": 499,
      "tokensLimit": 30000,
      "tokensRemaining": 29979,
      "requestsReset": "PT0.12S",
      "tokensReset": "PT0.042S"
    },
    "usage": {
      "promptTokens": 11,
      "generationTokens": 26,
      "totalTokens": 37
    },
    "promptMetadata": [],
    "empty": false
  },
  "results": [
    {
      "output": {
        "messageType": "ASSISTANT",
        "metadata": {
          "refusal": "",
          "finishReason": "STOP",
          "index": 0,
          "id": "chatcmpl-AAi19k1lzSFPpCSnJJp0vuEoeKOHl",
          "role": "ASSISTANT",
          "messageType": "ASSISTANT"
        },
        "toolCalls": [],
        "content": "Sure! Here's a light-hearted joke for you:\n\nWhy don’t skeletons fight each other?\n\nThey don’t have the guts!"
      },
      "metadata": {
        "finishReason": "STOP",
        "contentFilterMetadata": null
      }
    }
  ]
}
```

- 결과와 메타데이터 등을 확인할 수 있음을 알 수 있다.

## Entity 를 반환

- 종종 반환된 문자열에서 매핑된 엔티티 클래스를 반환하고 싶을 때가 있다.
- 이럴 때 `entity()` 메서드가 이러한 기능을 제공한다.
- 먼저 아래와 같은 엔티티를 생성해보자.

```kotlin
data class MathematicianPublications(
    val mathematician: String = "",
    val papers: List<String> = emptyList(),
)
```

- 아래와 같이 `entity()` 메서드를 사용하여 AI 모델의 출력을 이 엔티티에 쉽게 매핑할 수 있다.

```kotlin
fun returningAnEntity(): MathematicianPublications =
    chatClientAutoconfigured
        .prompt()
        .user("Generate the publications for a random mathematician.")
        .call()
        .entity(MathematicianPublications::class.java)
```

- 결과는 아래와 같다.

```json
{
  "mathematician": "Dr. John Doe",
  "papers": [
    "On the Convergence of Series in Hilbert Spaces",
    "A New Approach to Nonlinear Differential Equations",
    "Topological Methods in Algebraic Geometry",
    "The Role of Symmetry in Partial Differential Equations",
    "An Introduction to Modular Forms and Their Applications",
    "Advanced Techniques in Combinatorial Optimization",
    "Conformal Invariance and Critical Phenomena in Statistical Mechanics",
    "Stochastic Processes and Their Applications in Finance",
    "An Algebraic Perspective on Knot Theory",
    "Geometric Group Theory and Low-Dimensional Topology"
  ]
}
```

- 랜덤으로 생성 요청하여 이름 없는 수학자에, 그럴 듯한 paper 들이 리턴되었지만, 엔티티에 잘 매핑되어 리턴된 것을 볼 수 있다.

### 제네릭 타입의 엔티티를 반환

- `ParameterizedTypeReference` 를 통해 제네릭 타입의 엔티티도 반환할 수 있다.
- 위의 엔티티를 사용해 `List<MathematicianPublications>` 을 반환하게 하려면 아래와 같이 작성할 수 있다.
- service code
  ```kotlin
  fun returningAnEntityWithParameterizedTypeReference(): List<MathematicianPublications> =
      chatClientAutoconfigured
          .prompt()
          .user("Generate 5 publications for René Descartes and Carl Friedrich Gauss.")
          .call()
          .entity(object : ParameterizedTypeReference<List<MathematicianPublications>>() {})
  ```
- response
  ```json
  [
    {
      "mathematician": "René Descartes",
      "papers": [
        "Discourse on the Method",
        "Meditations on First Philosophy",
        "Principles of Philosophy",
        "Geometry",
        "Passions of the Soul"
      ]
    },
    {
      "mathematician": "Carl Friedrich Gauss",
      "papers": [
        "Disquisitiones Arithmeticae",
        "Theoria motus corporum coelestium in sectionibus conicis solem ambientium",
        "Methodus nova integralium valores per approximationem inveniendi",
        "Beiträge zur Theorie der algebraischen Gleichungen",
        "Untersuchungen über Gegenstände der Höheren Geodäsie"
      ]
    }
  ]
  ```
- `List<MathematicianPublications>` 형태로 잘 반환된 것을 확인할 수 있다.

## 스트리밍 응답을 반환

### 기본적인 비동기 응답

- `stream` 메서드를 사용하면 비동기 응답을 받을 수 있다.
- service code
  ```kotlin
  fun streamingResponses(userInput: String): Flux<String> =
      this.chatClientAutoconfigured
          .prompt()
          .user(userInput)
          .stream()
          .content()
  ```
- controller code
  ```kotlin
  @PostMapping("/chat-client-responses/streaming-responses", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
  fun streamingResponses(
      @RequestBody question: Question,
  ): Flux<String> = chatClientResponsesService.streamingResponses(question.text)
  ```
- request

  ```bash
  ### Streaming Responses
  POST localhost:8080/chat-client-responses/streaming-responses
  Accept: text/event-stream
  Content-Type: application/json

  {
    "text": "Tell me a joke"
  }
  ```

- response

  ```bash
  POST http://localhost:8080/chat-client-responses/streaming-responses

  HTTP/1.1 200
  Content-Type: text/event-stream
  Transfer-Encoding: chunked
  Date: Wed, 25 Sep 2024 18:35:49 GMT

  Response code: 200; Time: 1101ms (1 s 101 ms)

  data:Sure

  data:,

  data: here's

  data: a

  data: light

  data:-hearted

  data: joke

  data: for

  data: you

  data::
  data:
  data:

  data:Why

  data: don't

  data: scientists

  data: trust

  data: atoms

  data:?
  data:
  data:

  data:Because

  data: they

  data: make

  data: up

  data: everything

  data:!

  Connection closed
  ```

### 스트리밍된 ChatResponse 응답

- `chatResponse()` 메서드를 사용하여 `ChatResponse`를 스트리밍할 수도 있다.
- service code
  ```kotlin
  fun streamingChatResponses(userInput: String): Flux<ChatResponse> =
      this.chatClientAutoconfigured
          .prompt()
          .user(userInput)
          .stream()
          .chatResponse()
  ```
- response

  ```bash
  POST http://localhost:8080/chat-client-responses/streaming-chat-responses

  HTTP/1.1 200
  Content-Type: text/event-stream
  Transfer-Encoding: chunked
  Date: Wed, 25 Sep 2024 18:52:24 GMT

  Response code: 200; Time: 929ms (929 ms)

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":""},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":""},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"Sure"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"Sure"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":","},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":","},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" here's"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" here's"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" one"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" one"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" for"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" for"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" you"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" you"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":":\n\n"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":":\n\n"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"Why"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"Why"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" don"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" don"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"ât"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"ât"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" skeleton"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" skeleton"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"s"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"s"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" fight"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" fight"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" each"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" each"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" other"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" other"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"?\n\n"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"?\n\n"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"They"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"They"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" don"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" don"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"ât"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"ât"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" have"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" have"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" the"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" the"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" guts"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":" guts"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"!"},"metadata":{"finishReason":"","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":"!"},"metadata":{"finishReason":"","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  data:{"result":{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"STOP","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":null},"metadata":{"finishReason":"STOP","contentFilterMetadata":null}},"results":[{"output":{"messageType":"ASSISTANT","metadata":{"refusal":"","finishReason":"STOP","index":0,"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","role":"ASSISTANT","messageType":"ASSISTANT"},"toolCalls":[],"content":null},"metadata":{"finishReason":"STOP","contentFilterMetadata":null}}],"metadata":{"id":"chatcmpl-ABRPcksJjW2WpvcSe7FHfohsdB9Fs","model":"gpt-4o-2024-05-13","rateLimit":{"tokensLimit":0,"tokensReset":"PT0S","requestsLimit":0,"requestsRemaining":0,"requestsReset":"PT0S","tokensRemaining":0},"usage":{"promptTokens":0,"generationTokens":0,"totalTokens":0},"promptMetadata":[],"empty":false}}

  Connection closed
  ```

### 엔티티 응답

- 나중에는 위에서의 entity 메서드가 추가될 예정이지만, 그 전에는 Structured Output Converter 를 사용하여 집계된 응답을 명시적으로 변환해야 한다.
  - https://docs.spring.io/spring-ai/reference/api/structured-output-converter.html#StructuredOutputConverter
- 예시는 아래와 같다.
- service code

  ```kotlin
  fun streamingResponsesWithConverter(): List<MathematicianPublications> {
      val converter = BeanOutputConverter(object : ParameterizedTypeReference<List<MathematicianPublications>>() {})
      val prompt =
          """
          Generate the publications for a random mathematician.
          {format}
          """.trimIndent()

      val flux =
          this.chatClientAutoconfigured
              .prompt()
              .user { it.text(prompt).param("format", converter.getFormat()) }
              .stream()
              .content()

      val content = flux.collectList().block()?.joinToString("") ?: ""
      return converter.convert(content) ?: emptyList()
  }
  ```

- response
  ```kotlin
  [
    {
      "mathematician": "Dr. Alice Johnson",
      "papers": [
        "On the Convergence of Series in Banach Spaces",
        "A Study of Nonlinear Differential Equations",
        "Applications of Topology in Modern Analysis",
        "An Introduction to Functional Analysis",
        "The Role of Fixed Point Theorems in Computational Mathematics"
      ]
    },
    {
      "mathematician": "Prof. Michael Smith",
      "papers": [
        "Graph Theory and Its Applications",
        "Explorations in Combinatorial Geometry",
        "Advanced Topics in Number Theory",
        "The Algebraic Structure of Symmetric Groups",
        "Discrete Mathematics: An Interactive Approach"
      ]
    }
  ]
  ```
