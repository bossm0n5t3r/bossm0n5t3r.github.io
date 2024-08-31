+++ 
date = 2023-11-10T23:00:00+09:00
lastmod = 2024-09-01
title = "AWESOME 하게 JSON 검증해보자"
authors = ["Ji-Hoon Kim"]
tags = ["JSON", "Kotlin"]
categories = ["JSON", "Kotlin"]
+++

![](/images/logos/kotlin-logo.png)

## 개요

여기에 복잡한 JSON format 이 있다.

```json
{
  "v1": {
    "data": [
      {
        "MainId": 1111,
        "firstName": "Sherlock",
        "lastName": "Homes",
        "categories": [
          {
            "CategoryID": 1,
            "CategoryName": "Example"
          }
        ]
      },
      {
        "MainId": 122,
        "firstName": "James",
        "lastName": "Watson",
        "categories": [
          {
            "CategoryID": 2,
            "CategoryName": "Example2"
          }
        ]
      }
    ],
    "messages": [],
    "success": true,
    "nestedValueFormatIsSame": {
      "differentKey1": {
        "boolean": true,
        "intList": [0, 1]
      },
      "differentKey2": {
        "boolean": true,
        "intList": [0, 1, 2]
      },
      "differentKey3": {
        "boolean": true,
        "intList": [0, 1, 2, 3]
      }
    },
    "mapList": [
      {
        "key1": "value1"
      },
      {
        "key2": "value2"
      },
      {
        "key3": "value3"
      },
      {
        "key4": "value4"
      },
      {
        "key5": "value5"
      },
      {
        "key6": "value6"
      },
      {
        "key7": "value7"
      },
      {
        "key8": "value8"
      },
      {
        "key9": "value9"
      }
    ]
  }
}
```

이걸 각 key 와 value 의 타입을 체크하고, 각 value 에 대해서 추가적인 체크를 하려면 어떻게 해야할까?

- 문자열인 경우 Blank 인지 확인하거나
- 리스트인 경우 개수를 확인하거나
- Map인 경우 특정 키가 포함되어있는지 확인하는 등

그리고 각 key 별로 상관관계 또한 체크하려면 어떻게 해야할까?

## 먼저 JSON 포맷인지 확인하자

간단하게 해당 문자열이 JSON 인지 아닌지 확인하려면, `ObjectMapper` 의 `readTree` 를 통해 파싱해보면 확인하기 쉽다.

간단하게 코드로 보면 다음과 같다.

```kotlin
fun parseJsonNodeWhenValidFormat(rawJsonString: String): JsonNode {
    return try {
        objectMapper.readTree(rawJsonString)
    } catch (e: Exception) {
        error("Invalid JSON format")
    }
}
```

## Key 별로 value 타입 및 추가적인 체크를 해보자

여기서는 여러 고민이 들어갔다.

- 우선 해당 키를 root 로부터 탐색할 수 있어야 하고,
- root 로부터 탐색한 키와 해당 값의 문자열을 원하는 타입인지 Class 로 파싱해서 확인해야 하며,
- 해당 Class 에 대해 validate 하는 method 도 같이 존재해야했다.
- 추가적으로 여러 JSON 들에 대해 해당 키가 반드시 존재해야 하는 값인지, 아닌지에 대해서도 확인이 필요했다.

이런 고민 끝에… 다음과 같은 메서드를 하나 만들었다.

```kotlin
fun <T> JsonNode.check(
    keyPath: String,
    classType: Class<T>,
    required: Boolean = true,
    validate: (classType: T) -> Unit = {},
): JsonNode {
    val pathList = keyPath.split(".")
    var jsonNode = this

    try {
        pathList.forEach { path ->
            jsonNode = jsonNode[path]
        }
    } catch (e: Exception) {
        if (required) {
            error("Not found $keyPath")
        }
        return this
    }

    val jsonString = jsonNode.toString()

    val parsed =
        objectMapper.readValue(
            "{\"${pathList.last()}\": $jsonString}",
            classType,
        )

    validate(parsed)

    return this
}
```

기본적으로 root 로부터 탐색해야 했기에, 위에 만들었던 `parseJsonNodeWhenValidFormat` 메서드의 리턴타입인 `JsonNode` 로부터 chain rule 을 적용해보려고 했다.

- root JsonNode 로 파싱
- root JsonNode 를 받고 해당 키를 root 로부터 탐색 및 확인 후 이상 없으면 root return
- root JsonNode 를 받고 다음 키를 root 로부터 탐색 및 확인 후 이상 없으면 root return
- …

이런 식으로 검증하면 보기에도 깔끔해서 좋을 것 같았다.

그리고 각 키 별로 `Class` 를 파싱해야 하니, 키 별 `Class` 는 무조건 생성해야했고, 이를 공통적으로 사용하기 위해 제네릭을 적용하기로 했다.

마지막으로 각 value 의 `Class` 에 대해 검증하는 메서드도 유연하게 들어와야 했으므로,

해당 메서드 자체를 인자로 받으려고 했다.

### 세부 로직

내부 로직은 간단했다.

먼저 keyPath 의 경우 root 로부터 `.` 으로 구분된 문자열이면 충분하다고 생각했다.

왜냐하면 JSON → yaml → properties 로 생각했고,

각 키별 keyPath 는 `.` 으로 구분된 문자열과 일대일 대응이 되므로 충분히 구분할 수 있다고 생각했다.

그 다음은 root JsonNode 로부터 자식 객체를 찾는 순서였고,

이 과정에서 못찾을 경우 try-catch 로 잡은 뒤, 필수 여부를 확인해서 필수가 아니면 검증할 필요가 없으므로 바로 리턴하게끔 처리했다.

물론 필수값이면 에러를 뱉도록 했다.

이제 해당 JsonNode 와 키를 조합해 Class 로 파싱을 한 뒤, 해당 Class 를 파라미터로 하는 함수 자체를 인자로 받았으므로, 해당 함수를 실행한 뒤 검증하도록 했다.

마지막으로 다음 키에 대해 체크할 수 있게끔 root JsonNode 자체를 리턴하도록 했다.

## 각 key 별로 상관관계 또한 체크하려면 어떻게 해야할까?

여기서 끝났으면 좋았겠지만, 추가적으로 확인할 사항이 하나 있었다.

예를 들어 처음 보여줬던 JSON 에서 `messages` 와 `success` 필드가 있을 수도 있고 없을 수도 있지만,

`적어도 하나가 존재해야 한다` 라는 사실을 어떻게 검증할 수 있을까?

이는 위의 check 메서드를 사용하지 못했다.

왜냐하면 value Class 가 들어가야 하는데, `messages` 와 `success` 필드의 공통 상위 필드는 root 뿐이고,

이를 value Class 로 만드는 순간 그냥 파싱하는 것과 크게 차이가 없기 때문이다.

그래서 나는 JsonNode 를 함수의 인자로 하는 validate 만 전달받는 메서드를 새로 추가했다.

```kotlin
fun JsonNode.check(validate: (jsonNode: JsonNode) -> Unit): JsonNode {
    validate(this)
    return this
}
```

그러면 세부 구현 로직은 어떻게 될까?

아래처럼 작성하는 방향으로 해결했다.

```kotlin
.check {
    // messages 와 success 가 모두 없으면 안된다.
    val existsMessages =
        try {
            it.check("v1.messages", Messages::class.java)
            true
        } catch (e: Exception) {
            false
        }

    val existsSuccess =
        try {
            it.check("v1.success", Success::class.java)
            true
        } catch (e: Exception) {
            false
        }

    if (existsMessages.not() && existsSuccess.not()) {
        error("Both messages and success are not exist")
    }
}
```

각각에 대해서 필수로 존재하는 keyPath 로 전달해 존재성을 확인한 뒤, 모두 없을 경우 예외를 던지도록 했다.

간단하고도 직관적인 방법이다.

이렇게 메서드를 작성하면, 해당 케이스뿐 아니라, 다른 케이스에 대해서도 root JsonNode 에 대해 검증하게 되므로, 포괄적인 메서드라고 생각했다.

## 결론

결과적으로 해당 전체 메서드는 하나의 object 로 끝나게 된다.

```kotlin
object JsonFormatChecker {
    private val objectMapper = jacksonObjectMapper().registerKotlinModule()

    fun parseJsonNodeWhenValidFormat(rawJsonString: String): JsonNode {
        return try {
            objectMapper.readTree(rawJsonString)
        } catch (e: Exception) {
            error("Invalid JSON format")
        }
    }

    fun <T> JsonNode.check(
        keyPath: String,
        classType: Class<T>,
        required: Boolean = true,
        validate: (classType: T) -> Unit = {},
    ): JsonNode {
        val pathList = keyPath.split(".")
        var jsonNode = this

        try {
            pathList.forEach { path ->
                jsonNode = jsonNode[path]
            }
        } catch (e: Exception) {
            if (required) {
                error("Not found $keyPath")
            }
            return this
        }

        val jsonString = jsonNode.toString()

        val parsed =
            objectMapper.readValue(
                "{\"${pathList.last()}\": $jsonString}",
                classType,
            )

        validate(parsed)

        return this
    }

    fun JsonNode.check(validate: (jsonNode: JsonNode) -> Unit): JsonNode {
        validate(this)
        return this
    }
}
```

```kotlin
class JsonFormatCheckerTest {
    private val complexFormatJson =
        this::class
            .java
            .classLoader
            .getResource("json/complex_format.json")
            ?.readText()
            ?: error("Not found complex_format.json")

    private val complexFormatWithoutMessagesAndSuccessJson =
        this::class
            .java
            .classLoader
            .getResource("json/complex_format_without_messages_and_success.json")
            ?.readText()
            ?: error("Not found complex_format_without_messages_and_success.json")

    data class Data(
        val data: List<DataFormat>,
    ) {
        data class DataFormat(
            @JsonProperty("MainId")
            val mainId: String,
            val firstName: String,
            val lastName: String,
            val categories: List<Category>,
        ) {
            data class Category(
                @JsonProperty("CategoryID")
                val categoryID: String,
                @JsonProperty("CategoryName")
                val categoryName: String,
            )
        }
    }

    data class Messages(
        val messages: List<String>,
    )

    data class Success(
        val success: Boolean,
    )

    data class NestedValueFormatIsSame(
        val nestedValueFormatIsSame: NestedValueFormatIsSameType,
    ) {
        data class NestedValueFormatIsSameType(
            val differentKey1: SameFormat,
            val differentKey2: SameFormat,
            val differentKey3: SameFormat,
        ) {
            data class SameFormat(
                val boolean: Boolean,
                val intList: List<Int>,
            )
        }
    }

    data class MapList(
        val mapList: List<Map<String, String>>,
    )

    @Test
    fun jsonFormatCheckTest() {
        assertDoesNotThrow {
            parseJsonNodeWhenValidFormat(complexFormatJson)
                .check("v1.data", Data::class.java)
                .check("v1.messages", Messages::class.java)
                .check("v1.success", Success::class.java)
                .check("v1.nestedValueFormatIsSame", NestedValueFormatIsSame::class.java)
                .check("v1.mapList", MapList::class.java)
        }
    }

    @Test
    fun throwExceptionWhenMessagesAndSuccessAreNotExist() {
        assertThrows<Exception> {
            parseJsonNodeWhenValidFormat(complexFormatWithoutMessagesAndSuccessJson)
                .check("v1.data", Data::class.java)
                .check("v1.messages", Messages::class.java, required = false)
                .check("v1.success", Success::class.java, required = false)
                .check("v1.nestedValueFormatIsSame", NestedValueFormatIsSame::class.java)
                .check("v1.mapList", MapList::class.java)
                .check {
                    // messages 와 success 가 모두 없으면 안된다.
                    val existsMessages =
                        try {
                            it.check("v1.messages", Messages::class.java)
                            true
                        } catch (e: Exception) {
                            false
                        }

                    val existsSuccess =
                        try {
                            it.check("v1.success", Success::class.java)
                            true
                        } catch (e: Exception) {
                            false
                        }

                    if (existsMessages.not() && existsSuccess.not()) {
                        error("Both messages and success are not exist")
                    }
                }
        }.also {
            it.message shouldBe "Both messages and success are not exist"
        }
    }
}
```

그리고 의존하는 라이브러리도 `jackson objectmapper` 하나 밖에 없다.

그리고 추가적인 수정이나 요구 사항도 충분히 해당 케이스에서 확장 가능하다고 생각한다.
