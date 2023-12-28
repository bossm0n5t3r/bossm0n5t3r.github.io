+++ 
date = 2023-12-29T01:00:00+09:00
title = "[Elixir] 숫자 문자열을 숫자 배열로 변환하는 방법"
authors = ["Ji-Hoon Kim"]
tags = ["Elixir"]
categories = ["Elixir"]
series = ["Elixir"]
+++

## Goal

```
"1234567890" -> [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
```

## Code

### Using `codepoints`

```elixir
ExUnit.start()

defmodule StringToIntegerList do
  use ExUnit.Case, async: true

  # https://hexdocs.pm/elixir/1.16.0/String.html#codepoints/1
  def string_to_integer_list_using_codepoints(string) do
    string
    |> String.codepoints()
    |> Enum.map(&String.to_integer/1)
  end

  test "string_to_integer_list_using_codepoints" do
    assert string_to_integer_list_using_codepoints("12345678910") == [
             1,
             2,
             3,
             4,
             5,
             6,
             7,
             8,
             9,
             1,
             0
           ]
  end
end
```

### Using `to_charlist`

```elixir
ExUnit.start()

defmodule StringToIntegerList do
  use ExUnit.Case, async: true

  # https://hexdocs.pm/elixir/1.16.0/String.html#to_charlist/1
  def string_to_integer_list_using_charlist(string) do
    string
    |> to_charlist()
    |> Enum.map(&(&1 - ?0))
  end

  test "string_to_integer_list_using_charlist" do
    assert string_to_integer_list_using_charlist("12345678910") == [
             1,
             2,
             3,
             4,
             5,
             6,
             7,
             8,
             9,
             1,
             0
           ]
  end
end
```
