+++
date = 2024-06-20T02:22:20+09:00
title = "Linux 에서 jEnv 설정"
authors = ["Ji-Hoon Kim"]
tags = ["jenv", "jdk", "linux"]
categories = ["jenv", "jdk", "linux"]
series = ["linux"]
+++

## Introduction

- Linux 에서 jEnv 를 설정하는 방법에 대해 정리한다.

## How

```bash
❯ which java
/usr/bin/java

❯ readlink -f $(which java)
/usr/lib/jvm/java-22-openjdk/bin/java

❯ jenv add /usr/lib/jvm/java-22-openjdk/
openjdk64-22 added
22 added

❯ jenv add /usr/lib/jvm/java-21-openjdk
openjdk64-21.0.3 added
21.0.3 added
21.0 added
21 added

❯ jenv versions
* system (set by /home/bossm0n5t3r/.jenv/version)
  21
  21.0
  21.0.3
  22
  openjdk64-21.0.3
  openjdk64-22

❯ jenv global 22

❯ java --version
openjdk 22 2024-03-19
OpenJDK Runtime Environment (build 22)
OpenJDK 64-Bit Server VM (build 22, mixed mode, sharing)

❯ echo $JAVA_HOME
/home/bossm0n5t3r/.jenv/versions/22
```

## References

- https://www.jenv.be/
