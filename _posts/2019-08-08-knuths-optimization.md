---
layout: post
title: "Knuth's Optimization"
description: "Knuth's Optimization"
categories: [Dynamic Programming, Programming, Algorithm]
tags: [Dynamic Programming, Programming, Algorithm]
redirect_from:
  - /2019/08/08/
---

# Knuth's Optimization

---

## 1. Introduction
- **Knuth's Optimization**은 최적 이진트리 문제(optimal binary tree problems)에 적용하는 특별한 Optimization 이다.
- 시간복잡도(time complexity)를 _O(N^3)_에서 _O(N^2)_로 줄인다.
- 다음의 Conditions 들을 만족해야 활용가능하다.

## 2. Conditions
- $$ dp[i][j] = min_{i < k < j}{dp[i][k] + dp[k][j] + C[i][j]} $$


## 3. Analysis
## 4. Algorithm
## 5. Code
## 6. References


<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js">
</script>