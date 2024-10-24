+++
date = 2024-10-25T01:10:00+09:00
title = "[Docker 🐳] Colima 로 Docker Desktop 대체하기"
authors = ["Ji-Hoon Kim"]
tags = ["Docker", "colima"]
categories = ["Docker", "colima"]
series = ["Docker", "colima"]
+++

![colima](https://raw.githubusercontent.com/abiosoft/colima/refs/heads/main/colima.png)

## Notice

- 이 글은 `2023-01-19` 에 작성된 글이다.
- 다만 현재 기준으로도 사용하기에 문제가 없어 보여 별다른 수정 없이 게시하게 되었다.

## 개요

현재 도커는 docker engine 은 누구나 무료로 이용할 수 있다.

[하지만 docker desktop 은 개인 사용자에게는 무료로, 기업에게는 더이상 무료로 제공되지 않는다.](https://www.docker.com/blog/updating-product-subscriptions/)

그래서 오픈소스를 찾아 떠나는 여정이다.

물론 충분히 지금 사용하는 모든 기능들을 대체할 수 있어야 가능하기에 간 좀 보고 결정하였다.

## Colima 란?

[Colima](https://github.com/abiosoft/colima)는 MacOS/Linux에서 컨테이너 런타임을 제공하는 [Lima](https://github.com/lima-vm/lima) 기반의 VM 이다.

## Colima vs Docker Desktop

성능적인 부분에서 유의미한 차이가 있다고 한다.

- https://kumojin.com/en/colima-alternative-docker-desktop/
- https://www.arthurkoziel.com/replacing-docker-desktop-for-mac-with-colima/

## 기존 Docker Desktop 과 관련된 모든 데이터 지우기

아래 **순서대로** 실행해야 한다.

### Containers

```bash
docker rm -f $(docker ps -a -q)
```

### Volumes

```bash
docker volume rm $(docker volume ls -q)
```

### Images

```bash
docker rmi $(docker images -a -q)
```

### Volume 을 삭제 안하고 Migration 하려면?

잘 모르겠다… 😢

## docker, docker-compose 설치하기

```bash
brew install docker docker-compose
```

이후에, 아래를 실행해서 추가해주자.

```bash
# Compose is now a Docker plugin. For Docker to find this plugin, symlink it:
mkdir -p ~/.docker/cli-plugins
ln -sfn $(brew --prefix)/opt/docker-compose/bin/docker-compose ~/.docker/cli-plugins/docker-compose
```

## Colima 설치하기

### 설치하기

`brew` 가 짱인것이다.

```bash
brew install colima
```

외에도 [다양한 방법](https://github.com/abiosoft/colima#installation)이 있다.

### 설정하기

`$HOME/.docker/config` 파일에 `"credsStore": "desktop"` 라인이 있으면 지워주면 좋다.

- https://github.com/abiosoft/colima/issues/52#issuecomment-956037291

### 시작하기

```bash
colima start
```

### 종료하기 (삭제하기)

```bash
colima stop # 종료하기
colima delete # delete existing instance
```

### 확인하는 방법

간단하다. `docker ps -a` 로 정상 실행됐는지 확인하면 된다.

```bash
docker ps -a
```

## `Testcontainers` 사용시 설정들

개발시 `Testcontainers`를 사용하는 경우도 있다.

이럴 경우 아래 값을 설정해주면 된다.

```bash
$ vim ~/.zshrc

# insert below config
# https://www.testcontainers.org/supported_docker_environment/#using-colima
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export DOCKER_HOST="unix://${HOME}/.colima/docker.sock"

$ colima start

# after colima started, run IntelliJ
# https://www.rockyourcode.com/testcontainers-with-colima/
# Test successed
```

### `IntelliJ` config

(https://www.jetbrains.com/help/idea/docker.html)

1. docker 플러그인이 설치되어있어야 한다.
2. `Preferences` → `Build, Execution, Deployment` → Docker 로 가서 Colima 를 설정해주면 된다.

## References

### Colima

- https://github.com/abiosoft/colima

### Testcontainers

- https://github.com/testcontainers/testcontainers-java/issues/5034
