+++
date = 2023-08-23T03:00:00+09:00
title = "Fast Node Manager (fnm) 를 사용해보자"
authors = ["Ji-Hoon Kim"]
tags = ["node", "fnm"]
categories = ["node", "fnm"]
+++

> 🚀 Fast and simple Node.js version manager, built in Rust

또 새로운 version manager 다.

노드의,

그것도 빠른.

설치와 환경설정이 간단하다.

macOS 기준으로 설명하겠다.

```bash
$ brew install fnm

$ vim ~/.zshrc # eval "$(fnm env --use-on-cd)" 추가

$ fnm --version
fnm 1.35.1

$ fnm list
* system

$ fnm install --lts
Installing Node v18.17.1 (arm64)

$ fnm list         
* v18.17.1 default, lts-latest
* system

$ node -v
v18.17.1
```

기존의 `nvm`의 경우 `shell` 실행시 느린 부분이 있어서 `lazy loading` 을 했었는데, 이 친구는 그럴 필요가 없다.

```bash
$ /usr/bin/time /bin/zsh -i -c exit

Saving session...completed.
        0.41 real         0.17 user         0.16 sys
```

끝!

## References

https://github.com/Schniz/fnm
