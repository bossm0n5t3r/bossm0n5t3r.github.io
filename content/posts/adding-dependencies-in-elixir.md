+++ 
date = 2024-04-24T03:00:00+09:00
title = "[Elixir] Elixir 프로젝트에 의존성 설치하기"
authors = ["Ji-Hoon Kim"]
tags = ["Elixir"]
categories = ["Elixir"]
series = ["Elixir"]
+++

## 개요

- 간단하게 Elixir 프로젝트에 의존성을 추가하는 방법을 알아보자.
- 우선 추가하고 싶은 라이브러리를 확인하고 `mix.exs` 파일의 `defp deps do` ~ `end` 사이에 추가해두자.

```elixir
  defp deps do
    [
      {:phoenix, "~> 1.7.10"},
      {:phoenix_ecto, "~> 4.4"},
      {:ecto_sql, "~> 3.10"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_live_dashboard, "~> 0.8.2"},
      {:swoosh, "~> 1.3"},
      {:finch, "~> 0.13"},
      {:telemetry_metrics, "~> 0.6"},
      {:telemetry_poller, "~> 1.0"},
      {:gettext, "~> 0.20"},
      {:jason, "~> 1.2"},
      {:dns_cluster, "~> 0.1.1"},
      {:plug_cowboy, "~> 2.5"},
      {:bcrypt_elixir, "~> 3.0"}, # 새로 추가한 라이브러리
      {:guardian, "~> 2.0"} # 새로 추가한 라이브러리
    ]
  end
```

- 그 다음 아래 명령어를 실행해서 라이브러리를 가져오고 컴파일 하면 된다.

```bash
$ mix deps.get
$ mix deps.compile
```

## 정보 확인하는 방법

- `mix hex.info #{dependency}` 를 통해 확인 가능하다.

```bash
❯ mix hex.info bcrypt_elixir
Bcrypt password hashing algorithm for Elixir

Config: {:bcrypt_elixir, "~> 3.1"}
Locked version: 3.1.0
Releases: 3.1.0, 3.0.1, 3.0.0, 2.3.1, 2.3.0, 2.2.0, 2.1.0, 2.0.3, ...

Licenses: BSD-3-Clause, ISC, BSD-4-Clause
Links:
  Changelog: https://github.com/riverrun/bcrypt_elixir/blob/master/CHANGELOG.md
  GitHub: https://github.com/riverrun/bcrypt_elixir

```

## References

- https://elixirbridge.org/04_Mix_Applications/02-adding-dependencies.html
- https://marketsplash.com/how-to-handle-dependencies-in-elixir/
