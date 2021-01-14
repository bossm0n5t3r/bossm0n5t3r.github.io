---
layout: post
title: "[React] Components and Props"
description: "[React] Components and Props"
categories: [React]
tags: [React]
redirect_from:
  - /2020/05/15/
math: false
published: false
---

# [React] Components and Props

<img src="/assets/img/posts/logos/react-logo.svg" width="300">

- 컴포넌트를 통해 UI를 재사용 가능한 개별적인 여러 조각으로 나누고,
- 각 조각을 개별적으로 살펴볼 수 있다.
- [자세한 컴포넌트 API 레퍼런스](https://ko.reactjs.org/docs/react-component.html)는 여기서 확인 가능

## 함수 컴포넌트와 클래스 컴포넌트

- 컴포넌트를 정의하는 가장 간단한 방법은 JavaScript 함수를 작성하는 것

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

- `props`
  - 속성을 나타내는 데이터
- 이 함수는 데이터를 가진 하나의 `props` 객체 인자를 받은 후 React 엘리먼트를 반환하므로 유효한 React 컴포넌트이다.
- 이러한 컴포넌트는 JavaScript 함수이기 때문에 말 그대로 `함수 컴포넌트`라고 호칭

## References

- [Components and Props](https://ko.reactjs.org/docs/components-and-props.html)
