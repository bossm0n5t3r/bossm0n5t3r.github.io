+++ 
date = 2024-04-24T02:45:00+09:00
title = "[Elixir] Task (async, await)"
authors = ["Ji-Hoon Kim"]
tags = ["Elixir"]
categories = ["Elixir"]
series = ["Elixir"]
+++

## Introduction

- `Elixir` 의 `Task` 를 통해 `async`, `await` 를 사용하는 다양한 방법에 대해 코드로 간단히 소개해보겠다.

## async_stream

```elixir
stream =
  ["long string", "longer string", "there are many of these"]
  |> Task.async_stream(fn text -> text |> String.codepoints() |> Enum.count() end)

assert Enum.reduce(stream, 0, fn {:ok, num}, acc -> num + acc end) == 47
```

## unbound async + take

```elixir
result =
  1..100
  |> Stream.take(10)
  |> Task.async_stream(fn i ->
    Process.sleep(100)
    i
  end)
  |> Enum.map(fn {:ok, val} -> val end)
  |> Enum.to_list()

assert result == [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

## async / await

```elixir
task = Task.async(fn -> Enum.sum(0..999_999) end)
assert Task.await(task) == 499_999_500_000
```

## await_many

```elixir
tasks = [
  Task.async(fn -> 1 + 1 end),
  Task.async(fn -> 2 + 3 end)
]

assert Task.await_many(tasks) == [2, 5]
```

## References

- https://hexdocs.pm/elixir/Task.html
- https://github.com/bossm0n5t3r/learning-elixir/blob/master/31-task.exs
