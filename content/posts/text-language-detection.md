+++
date = 2023-10-22T04:00:00+09:00
title = "텍스트의 언어를 감지하는 방법"
authors = ["Ji-Hoon Kim"]
tags = ["Language", "Apache", "Tika"]
categories = ["Language", "Apache", "Tika"]
+++

## 개요

사이드 프로젝트를 진행하면서, 임의의 문장 또는 단락에 대해 어떤 언어로 작성된건지 확인해야할 필요가 생겨서 방법을 찾아보았고, 해당 내용을 정리해보았다.

`Apache Tika` 의 `LanguageDetector` 를 사용해보고자 한다.

## 시작하기

```kotlin
dependencies {
    implementation(platform("org.apache.tika:tika-bom:2.9.1"))
    implementation("org.apache.tika:tika-core")
    implementation("org.apache.tika:tika-parsers-standard-package")
    implementation("org.apache.tika:tika-langdetect-optimaize")
}
```

## 언어 감지하기

먼저 `languageDetector` 를 아래와 같이 설정하면 된다.

```kotlin
fun detectLanguage(text: String): String {
    val languageDetector = LanguageDetector.getDefaultLanguageDetector().loadModels()
    return languageDetector.detect(text).language
}
```

```kotlin
class LanguageServiceTest {
    private val sut = LanguageService()

    @Test
    fun detectLanguageTest() {
        assertEquals(sut.detectLanguage("나는 배고프다."), "ko")
        assertEquals(sut.detectLanguage("If it weren't for you, it would be really hard."), "en")
    }
}
```

실제 리턴해주는 값은 아래와 같다.

```kotlin
@Test
fun detectLanguageTest() {
    val languageDetector = LanguageDetector.getDefaultLanguageDetector().loadModels()

    println(
        languageDetector.detectAll(
            """
                나는 정말 힘들었을 거야 라는 문장은 다음과 같이 더 자연스럽게 'I would have really struggled'로 번역될 수 있습니다.
            """.trimIndent()
        )
    )
    /**
     * [ko: MEDIUM (0.571428), en: MEDIUM (0.428569)]
     */
}
```

## 특정 언어만 Detector 로 설정하기

```kotlin
val languageDetector = LanguageDetector.getDefaultLanguageDetector()
    .loadModels(setOf("en", "ko"))
```

`loadModels` 에 `ISO 639-1 code` 를 Set 으로 넣어주면 된다.

- [List of ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

## 그 밖의 설정들

### ShortText

```kotlin
val languageDetector = LanguageDetector.getDefaultLanguageDetector()
    .setShortText(true)
```

### MixedLanguages

```kotlin
val languageDetector = LanguageDetector.getDefaultLanguageDetector()
    .setMixedLanguages(true)
```

## 유의해야 할 점

생각보다 부정확할 수 있다.

예를 들어 `나는 정말 힘들었을 거야는 더 자연스럽게 'I would have really struggled'로 번역될 수 있습니다.` 라는 문장을 detect 할 경우, 아래와 같이 잘못된 언어가 우선되는 경우가
있다.

```kotlin
@Test
fun detectLanguageTest() {
    val languageDetector = LanguageDetector.getDefaultLanguageDetector().loadModels()

    println(
        languageDetector.detectAll(
            """
                나는 정말 힘들었을 거야는 더 자연스럽게 'I would have really struggled'로 번역될 수 있습니다.
            """.trimIndent()
        )
    )
    /**
     * [en: MEDIUM (0.857138), ko: MEDIUM (0.142857)]
     */
}
```

이 경우 문장이 짧아서 그렇지 않나라고 생각할 수 있어서 다음과 같이 시도해보면, 아래와 같이 바뀌기는 한다.

```kotlin
@Test
fun detectLanguageTest() {
    val languageDetector = LanguageDetector.getDefaultLanguageDetector().loadModels()

    println(
        languageDetector.detectAll(
            """
                나는 정말 힘들었을 거야는 더 자연스럽게 'I would have really struggled'로 번역될 수 있습니다.
                나는 정말 힘들었을 거야는 더 자연스럽게 'I would have really struggled'로 번역될 수 있습니다.
                나는 정말 힘들었을 거야는 더 자연스럽게 'I would have really struggled'로 번역될 수 있습니다.
                나는 정말 힘들었을 거야는 더 자연스럽게 'I would have really struggled'로 번역될 수 있습니다.
                나는 정말 힘들었을 거야는 더 자연스럽게 'I would have really struggled'로 번역될 수 있습니다.
            """.trimIndent()
        )
    )
    /**
     * [ko: MEDIUM (0.571427), en: MEDIUM (0.428570)]
     */
}
```

하지만, 저 기준을 어떻게 잡아야 할까? 상당히 문장에 의존적인 변수가 될 것으로 보인다.

따라서 해당 방법을 적용할 때 위의 내용을 유의하면 좋을 것 같다.

## 결론

이 라이브러리의 동작 방식은 **n-gram** 을 통해 언어 프로필을 뽑아낸 뒤에 상대 빈도 비교를 통해 추론해내는 방식이다.

하지만, 언어란 워낙 다양하게 쓰이기 때문에, 라이브러리만으로 정확하게 판단하기란 쉽지 않다는 것을 알게 되었다.

다만, 커다란 글 타래의 경우 보다 정확하게 판단 가능할 것으로 보인다.

## References

- https://github.com/apache/tika
- https://github.com/optimaize/language-detector
- [Content Analysis with Apache Tika | Baeldung](https://www.baeldung.com/apache-tika)
- [List of ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [n-gram](https://en.wikipedia.org/wiki/N-gram)
