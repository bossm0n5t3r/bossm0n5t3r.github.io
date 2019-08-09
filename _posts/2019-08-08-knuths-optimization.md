---
layout: post
title: "Knuth's Optimization"
description: "Knuth's Optimization"
categories: [Dynamic Programming, Programming, Algorithm]
tags: [Dynamic Programming, Programming, Algorithm]
redirect_from:
  - /2019/08/08/
use_math: true
---

# Knuth's Optimization

---

## 1. Introduction
- **Knuth's Optimization**은 최적 이진트리 문제(optimal binary tree problems)에 적용하는 특별한 Optimization 이다.
- 시간복잡도(time complexity)을(를) $O(N^3)$에서 $O(N^2)$로 줄인다.
- 다음의 Conditions 들을 만족해야 활용가능하다.

## 2. Conditions
- 반복되는 구조가 다음의 케이스 일 때 활용 가능함
- $$ dp[i][j] = \min_{i < k < j}{dp[i][k] + dp[k][j]} + C[i][j] $$
- 적용가능성의 충분 조건은
- $$ A[i][j - 1] \le A[i][j] \le A[i + 1][j] $$
- Where,
  - $A[i][j]$은(는) 최적의 답을 주는 가장 작은 k
  - $$ dp[i][j] = dp[i - 1][k] + C[k][j] $$
  - $C[i][j]$는 주어진 cost function
- 가장 중요한 것은 **Knuth's Optimization**은 $C[i][j]$는 다음의 두 조건을 만족해야 활용 가능함
  - Quadrangle inequality(사각 부등식)
    - $$ C[a][c] + C[b][d] \le C[a][d] + C[b][c], a \le b \le c \le d $$
  - Monotonicity (단조성)
    - $$ C[b][c] \le C[a][d], a \le b \le c \le d $$

## 3. Analysis
## 4. Algorithm
## 5. Code
## 6. References