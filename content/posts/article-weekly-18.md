+++ 
date = 2024-05-06T20:30:00+09:00
title = "Article Weekly, Issue 18"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-04-28` ~ `2024-05-04`

## **4 Software Design Principles I Learned the Hard Way**

- 1. Maintain one source of truth.
  - 업무 규칙을 하나로 관리하자.
- 2. Yes, please repeat yourself.
  - 중복으로 보이는 두 코드 영역이 각자의 경로로 발전한다면, 이 두 코드는 진짜 중복이 아님
    - 우발적 중복을 제거했을 경우 나중에 다시 분리하느라 큰 수고를 감수해야 함
  - 중복이 진짜 중복인지 확인하자
- 3. Don’t overuse mocks.
  - 목을 과도하게 사용하지 말자
  - https://testing.googleblog.com/2013/05/testing-on-toilet-dont-overuse-mocks.html
- 4. Minimize mutable state.
  - 변경 가능한 상태를 최대한 최소화하면 상당한 효과를 얻을 수 있음
  - 동기화 버그, 데이터 충돌, 오래된 상태에 대해 걱정할 필요가 없으므로 개발 속도가 빨라짐
  - 또한 한 번에 너무 많은 기능을 도입하는 대신 기능을 하나씩 개발할 수 있음
  - 오늘날 기계는 몇 가지 중복 계산을 수행해도 괜찮을 만큼 충분히 빠름
  - 기계가 곧 "우리를 대체"할 것으로 예상된다면 몇 가지 추가 계산 작업 단위를 처리할 수 있음

## **What if null was an Object in Java?**

- Smalltalk 은 순수 객체 지향 프로그래밍 언어
  - 모든 것은 객체이다.
- Java 는 순수 객체 지향 프로그래밍 언어는 아님
- 여기서는 Java 와 Smalltalk 에서 부재 값에 대해 다루는 방법에 대해 설명
  - Java : null, Smalltalk : nil
- Java 에서 null 은 객체가 아님

```java
@Test
public void nullIsNotAnObject()
{
    // Assert things about null
    Assertions.assertFalse(null instanceof Object);
    final Set<?> set = null;
    Assertions.assertFalse(set instanceof Set);

    // Assert things about exceptions thrown when calling methods on null
    Assertions.assertThrows(
            NullPointerException.class,
            () -> set.getClass());
    Assertions.assertThrows(
            NullPointerException.class,
            () -> set.toString());

    // Assert things about a non-null variable named set2
    final Set<?> set2 = new HashSet<>(Set.of(1, 2, 3));
    set2.add(null);
    Assertions.assertNotNull(set2);
    Assertions.assertNotNull(set2.getClass());
    Assertions.assertTrue(set2 instanceof Set);

    // Filter all of the non-null values from set2 in the Set named set3
    // Uses a static method refererence from the Objects class
    final Set<?> set3 = set2.stream()
            .filter(Objects::nonNull)
            .collect(Collectors.toUnmodifiableSet());
    Assertions.assertEquals(Set.of(1, 2, 3), set3);
}
```

- Smalltalk 에서 nil 은 객체임
  - 모든 것은 객체이기 때문에!

```smalltalk
testNilIsAnObject
  |set setNoNils|

  # Assert things about nil
  self assert: nil isNil.
  self assert: 'nil' equals: nil printString.

  # Assert things about the set variable which is nil
  set := nil.
  self assert: set isNil.
  self assert: set equals: nil.
  self assert: set class equals: UndefinedObject.
  self assert: (set ifNil: [ true ]).
  self assert: set isEmptyOrNil.

  # Assert things about the set variable which is not nil
  set := Set with: 1 with: 2 with: 3 with: nil.
  self deny: set isNil.
  self assert: set isNotNil.
  self deny: set equals: nil.
  self deny: set isEmptyOrNil.
  self assert: set class equals: Set.

  # Select all the non-nil values into a new Set name setNoNils
  setNoNils := set select: #isNotNil.
  self assert: (Set with: 1 with: 2 with: 3) equals: setNoNils.
```

- 만약 자바의 null 이 객체라면? (Smalltalk 처럼)
  - NPE 의 다양한 기능을 제거할 수 있을 것
- 왜 nil 이 객체인가 유용한가?
  - 다른 모든 객체처럼 처리될 수 있음
  - 언어와 라이브러리에 좋은 대칭을 가져옴
  - 놀라운 수준의 일관성과 명확성을 가져옴
- 결론
  - Java 를 바꿀 필요는 없지만, 저런 생각을 가져보고 이해하는데 도움이 되었길 바람

## References

- https://read.engineerscodex.com/p/4-software-design-principles-i-learned
  - https://testing.googleblog.com/2013/05/testing-on-toilet-dont-overuse-mocks.html
- https://donraab.medium.com/what-if-null-was-an-object-in-java-3f1974954be2
