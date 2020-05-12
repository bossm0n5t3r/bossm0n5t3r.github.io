---
layout: post
title: "[React] 엘리먼트 렌더링"
description: "[React] 엘리먼트 렌더링"
categories: [React]
tags: [React]
redirect_from:
  - /2020/05/12/
use_math: false
published: false
---

# [React] 엘리먼트 렌더링

<img src="/assets/images/posts/logos/react-logo.svg" width="300">

- 엘리먼트는 React 앱의 가장 작은 단위
- 엘리먼트는 화면에 표시할 내용을 기술

```jsx
const element = <h1>Hello, world</h1>;
```

- 브라우저 DOM 엘리먼트와 달리 React 엘리먼트는 일반 객체(plain object)이며, 쉽게 생성
- React DOM은 React 엘리먼트와 일치하도록 DOM을 업데이트
