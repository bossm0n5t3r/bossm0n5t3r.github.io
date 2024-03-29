+++ 
date = 2023-07-22T11:00:00+09:00
title = "Knuth's Optimization"
authors = ["Ji-Hoon Kim"]
tags = ["Algorithm", "Dynamic Programming", "Programming"]
categories = ["Algorithm", "Programming"]
+++

# Knuth's Optimization

## 1. Introduction

- **Knuth's Optimization**은 최적 이진트리 문제(optimal binary tree problems)에 적용하는 특별한 Optimization 이다.
- 시간복잡도(time complexity)을(를) \\(O(N^3)\\)에서 \\(O(N^2)\\)로 줄인다.
- 다음의 Conditions 들을 만족해야 활용가능하다.

## 2. Conditions

- 반복되는 구조가 다음의 케이스 일 때 활용 가능
- \\[dp[i][j] = \min\_{i < k < j}{dp[i][k] + dp[k][j]} + C[i][j]\\]
- 적용가능성의 충분 조건은
- \\[A[i][j - 1] \le A[i][j] \le A[i + 1][j]\\]
- Where,
    - \\(A[i][j]\\)은(는) 최적의 답을 주는 가장 작은 k
    - \\[dp[i][j] = dp[i - 1][k] + C[k][j]\\]
    - \\(C[i][j]\\)는 주어진 cost function
- 가장 중요한 것은 **Knuth's Optimization**은 \\(C[i][j]\\)이 다음의 두 조건을 만족해야 활용 가능
    - Quadrangle inequality (사각 부등식)
        - \\[C[a][c] + C[b][d] \le C[a][d] + C[b][c], a \le b \le c \le d\\]
    - Monotonicity (단조성)
        - \\[C[b][c] \le C[a][d], a \le b \le c \le d\\]

## 3. Example Code

- [https://www.acmicpc.net/problem/11066](https://www.acmicpc.net/problem/11066)
  <script src="https://gist.github.com/bossm0n5t3r/078882c5b916974a3829513f387a0a26.js"></script>

## 4. References

- [https://www.quora.com/What-is-Knuths-optimization-in-dynamic-programming](https://www.quora.com/What-is-Knuths-optimization-in-dynamic-programming)
- [https://jeffreyxiao.me/blog/knuths-optimization](https://jeffreyxiao.me/blog/knuths-optimization)
- [http://web.cs.unlv.edu/bein/pubs/knuthyaotalg.pdf](http://web.cs.unlv.edu/bein/pubs/knuthyaotalg.pdf)
- [https://wiki.algo.is/Knuth's%20optimization](https://wiki.algo.is/Knuth's%20optimization)
