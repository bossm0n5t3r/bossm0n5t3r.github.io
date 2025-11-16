+++
date = 2025-11-16T21:30:00+09:00
title = "[그림과 실습으로 배우는 쿠버네티스 입문] 1장. 도커 컨테이너 만들어 보기"
authors = ["Ji-Hoon Kim"]
tags = ["k8s", "kubernetes"]
categories = ["k8s", "kubernetes"]
series = ["k8s", "kubernetes"]
+++

![cover.jpg](/images/books/bbf-k8s/cover.jpg)

## 1.1 쿠버네티스는 왜 도커가 필요한가?

- 쿠버네티스는 컨테이너 관리용 도구
- 컨테이너는 도커만을 의미하지 않음

## 1.2 도커 알아보기

### 1.2.1 도커란?

- 도커(Docker)란 컨테이너라는 가상화 기술 중 하나
- 컨테이너 기술 자체는 오래 전부터 있었지만, 도커의 등장으로 세상에 널리 알려지게 됨
- Docker사가 2013년에 ‘Build, Share, Run’ 이라는 일련의 라이프사이클을 docker 라는 명령어로 제공하여 컨테이너 기술을 훨씬 더 사용하기 쉽게 만듦

### 1.2.2 컨테이너란?

- 컨테이너란 운영체제(OS) 위에 만들어지는 격리된 가상 환경
- 프로세스와 다른 점은 컨테이너 간에 실행 환경을 참조할 수 없다는 점
    - 예를 들어 컨테이너 A 안에서 생성된 파일을 컨테이너 B 가 마음대로 참조할 수 없음
    - 또한 컨테이너 A 안에 설치된 프로그램을 컨테이너 B 가 실행하는 것도 불가능함

### 1.2.3 왜 컨테이너인가?

크게 두 가지 이유

1. 가상 머신보다 더 빠르게 애플리케이션을 실행할 수 있다.
    1. 가상 머신은 컨테이너와 달리 운영체제를 포함하여 가상화함
    2. 컨테이너 기술의 등장으로 가상 머신보다 더 빠르게 애플리케이션을 실행할 수 있게 됨
2. 마이크로서비스 아키텍처를 사용하는 곳이 많아졌다.
    1. 마이크로서비스 아키텍처를 사용함으로써 보다 빠르고 유연하게 고객에게 가치를 제공할 수 있는 인프라가 필요하게 됨

### 1.2.4 그래서 도커란?

- 도커는 컨테이너 기술을 이용해 어디서도 동일한 환경(컨테이너)을 만들 수 있게 해줌
- 도커의 강점은 docker 명령어로 그 모든 사이클을 다룰 수 있다는 점
- 어떤 컴퓨터에서든 도커를 실행할 수 있다면 동일한 컨테이너를 실행할 수 있음을 보장함

### 1.2.5 준비: 도커 환경 만들기

### 1.2.6 컨테이너 실행하기

### 1.2.7 컨테이너의 틀이 되는 도커 이미지

- 도커 이미지는 애플리케이션을 실행하는 데 필요한 모든 것과 메타데이터 등 컨테이너의 각종 설정의 집합체
    - 모든 것이란? 모든 의존관계, 설정, 스크립트, 바이너리 등
- 도커 이미지는 여러 개의 이미지 레이어를 겹겹이 쌓아 올려 만듦
- 기존 레이어 위에 새로운 레이어를 겹쳐 쌓으면서 새로운 도커 이미지를 만듦
- 컨테이너를 실행하는 데 필요한 모든 것이 도커 이미지에 정리되어 있기 때문에, 동일한 도커 이미지를 사용하면 다른 컴퓨터에서 실행해도 항상 동일한 환경을 구축할 수 있음

### 1.2.8 컨테이너 이미지의 설계서인 Dockerfile

- Dockerfile 은 컨테이너 이미지의 설계서
- 이 파일에 대해 `docker build` 명령어를 실행하면 도커 이미지가 만들어짐
- 기존에 이미 존재하는 도커 이미지만 그대로 사용하는 것이라면 Dockerfile 을 사용할 필요가 없음
- 쿠버네티스를 사용할 때도 반드시 Dockerfile 을 작성해야 하는 것은 아님
- 하지만 애플리케이션을 개발한다면 새로운 도커 이미지를 생성하는 경우가 대부분
- Dockerfile 에는 도커 이미지를 어떻게 만들어야 하는지 애플리케이션의 실행에 필요한 모든 프로그램과 설정을 작성한다.
- Dockerfile 의 시작 부분은 반드시 FROM 으로 시작해 베이스가 되는 이미지를 지정해야 한다.

### 1.2.9 도커 이미지 빌드하기

- `index.html`

```html
<h1>Hello World!</h1>
```

- `Dockerfile`

```docker
FROM nginx:latest
COPY index.html /usr/share/nginx/html
```

- Run

```bash
~/gitFolders/build-breaking-fixing-kubernetes master* ⇡               18:31:14
❯ docker build ./chapter-01/custom-nginx --tag nginx-custom:1.0.0
[+] Building 7.8s (7/7) FINISHED                                docker:default
 => [internal] load build definition from Dockerfile                      0.0s
 => => transferring dockerfile: 93B                                       0.0s
 => [internal] load metadata for docker.io/library/nginx:latest           2.4s
 => [internal] load .dockerignore                                         0.0s
 => => transferring context: 2B                                           0.0s
 => [internal] load build context                                         0.0s
 => => transferring context: 59B                                          0.0s
 => [1/2] FROM docker.io/library/nginx:latest@sha256:1beed3ca46acebe9d3f  5.2s
 => => resolve docker.io/library/nginx:latest@sha256:1beed3ca46acebe9d3f  0.0s
 => => sha256:3db9f1af9e100b2c641e0164d20cf287cc543dc01c 1.21kB / 1.21kB  2.0s
 => => sha256:184706839d41a7d155b6253ac733e6eef75f4e8a61 1.40kB / 1.40kB  0.2s
 => => sha256:0469ebd60c79c6238255a6840462db9ae9d70215686d1a 404B / 404B  1.5s
 => => sha256:59679015de7391a6955f9bf5ee9531bfaf9664e1d21159 956B / 956B  1.7s
 => => sha256:d9b6d209211fb260cdff87a10b238a1579fce76ddcfbba 628B / 628B  1.7s
 => => sha256:7d3a535ffc2fc56da973314114adbd69373bdac6 28.10MB / 28.10MB  3.2s
 => => extracting sha256:7d3a535ffc2fc56da973314114adbd69373bdac6e65518c  0.4s
 => => extracting sha256:d9b6d209211fb260cdff87a10b238a1579fce76ddcfbbab  0.0s
 => => extracting sha256:59679015de7391a6955f9bf5ee9531bfaf9664e1d211592  0.0s
 => => extracting sha256:0469ebd60c79c6238255a6840462db9ae9d70215686d1a8  0.0s
 => => extracting sha256:3db9f1af9e100b2c641e0164d20cf287cc543dc01c10e39  0.0s
 => => extracting sha256:184706839d41a7d155b6253ac733e6eef75f4e8a61b5ebb  0.0s
 => [2/2] COPY index.html /usr/share/nginx/html                           0.1s
 => exporting to image                                                    0.1s
 => => exporting layers                                                   0.0s
 => => exporting manifest sha256:e4af76f985902cdb9a1b62df6094eb46302fc22  0.0s
 => => exporting config sha256:f681125ecf173910c70a30c0e0d55923f01acd122  0.0s
 => => exporting attestation manifest sha256:66305a2564a6323112c6960db7a  0.0s
 => => exporting manifest list sha256:dbd7ba2df40959579047c3de05c08a6fd5  0.0s
 => => naming to docker.io/library/nginx-custom:1.0.0                     0.0s
 => => unpacking to docker.io/library/nginx-custom:1.0.0                  0.0s

~/gitFolders/build-breaking-fixing-kubernetes master* ⇡            9s 18:31:40
❯ docker images                                                  
                                                           i Info →   U  In Use
IMAGE                          ID             DISK USAGE   CONTENT SIZE   EXTRA
gcr.io/k8s-minikube/kicbase…   18b0fda1fa3d       1.73GB          472MB        
gcr.io/k8s-minikube/kicbase…   7171c97a5162       1.73GB          472MB    U   
nginx-custom:1.0.0             dbd7ba2df409        244MB         58.3MB        
postgres:15-alpine             64583b3cb4f2        378MB          105MB    U   
postgres:latest                28bda6d50590        665MB          161MB    U   

```

### 1.2.10 직접 만든 도커 이미지로 컨테이너 실행하기

```bash
~/gitFolders/build-breaking-fixing-kubernetes master* ⇡                18:35:17
❯ docker run --rm --detach --publish 8080:80 --name web nginx-custom:1.0.0
783a28d62d72e16bf939bdc0e77fcc78d20e03e5ac8f0cf9d79d70d9c4c887c7

~/gitFolders/build-breaking-fixing-kubernetes master* ⇡                18:35:45
❯ docker ps -a                                                            
CONTAINER ID   IMAGE                                 COMMAND                  CREATED         STATUS                     PORTS                                                                                                                                  NAMES
783a28d62d72   nginx-custom:1.0.0                    "/docker-entrypoint.…"   4 seconds ago   Up 3 seconds               0.0.0.0:8080->80/tcp, [::]:8080->80/tcp                                                                                                web

```

- `--rm`: 컨테이너가 종료되면 자동으로 컨테이너를 삭제
- `--detach(-d)`: 컨테이너를 백그라운드에서 실행함
- `--publish(-p)` : 포트 포워딩, 컨테이너의 80번 포트를 호스트 컴퓨터의 8080 포트에 연결
- `—-name`: 컨테이너의 이름을 지정

![0.png](/images/books/bbf-k8s/chapter-01/0.png)

```bash
❯ docker stop web                 
web

~/gitFolders/build-breaking-fixing-kubernetes master* ⇡                18:37:30
❯ docker ps -a   
CONTAINER ID   IMAGE                                 COMMAND                  CREATED        STATUS                     PORTS                                                                                                                                  NAMES

```

### 1.2.11 도커 이미지 공개하기

- 컨테이너 이미지를 공유하기 위한 상자가 바로 레지스트리
- 컨테이너 이미지를 업로드하는 공간을 컨테이너 레지스트리라고 함
- 레지스트리를 만들 때는 프라이빗 혹은 퍼블릭 레지스트리로 만들 수 있음

### 1.2.12 Dockerfile 작성 팁

- 공식 문서에 적힌 권장 사항은 전체 내용을 꼼꼼히 읽어 보는 것이 좋음
    - https://docs.docker.com/reference/dockerfile
- 주의: 비밀 및 기밀 정보는 도커 이미지에 포함시키지 말 것
- 권장 사항: 멀티 스테이지 빌드 수행

## 1.3 [만들기] 나만의 http server 컨테이너 실행하기

- `main.exs`

```elixir
Mix.install([{:plug_cowboy, "~> 2.7"}])

defmodule Mini do
  use Plug.Router
  plug :match
  plug :dispatch
  get "/", do: send_resp(conn, 200, "Hello, world!")
  get "/favicon.ico", do: send_resp(conn, 204, "")
end

Plug.Cowboy.http(Mini, [], port: 8080)
Process.sleep(:infinity)

```

- `Dockerfile`

```bash
FROM elixir:1.19-alpine
ENV MIX_ENV=prod
RUN mix local.hex --force && mix local.rebar --force
WORKDIR /app
COPY main.exs .
RUN elixir -e "Mix.install([{:plug_cowboy, \"~> 2.7\"}])"
EXPOSE 8080
CMD ["elixir", "main.exs"]

```

- `terminal`

```bash
~/gitFolders/build-breaking-fixing-kubernetes master* ⇡               19:41:17
❯ docker build ./chapter-01/hello-server --tag hello-server:1.0.0
[+] Building 0.8s (10/10) FINISHED                              docker:default
 => [internal] load build definition from Dockerfile                      0.0s
 => => transferring dockerfile: 259B                                      0.0s
 => [internal] load metadata for docker.io/library/elixir:1.19-alpine     0.7s
 => [internal] load .dockerignore                                         0.0s
 => => transferring context: 2B                                           0.0s
 => [1/5] FROM docker.io/library/elixir:1.19-alpine@sha256:b7720b425b17a  0.0s
 => => resolve docker.io/library/elixir:1.19-alpine@sha256:b7720b425b17a  0.0s
 => [internal] load build context                                         0.0s
 => => transferring context: 30B                                          0.0s
 => CACHED [2/5] RUN mix local.hex --force && mix local.rebar --force     0.0s
 => CACHED [3/5] WORKDIR /app                                             0.0s
 => CACHED [4/5] COPY main.exs .                                          0.0s
 => CACHED [5/5] RUN elixir -e "Mix.install([{:plug_cowboy, "~> 2.7"}])"  0.0s
 => exporting to image                                                    0.0s
 => => exporting layers                                                   0.0s
 => => exporting manifest sha256:4b7ba93a6ff1ec3e80282606c0013208c17d4f2  0.0s
 => => exporting config sha256:09826592b0f07d8fef9da91e8d692a5215f870db4  0.0s
 => => exporting attestation manifest sha256:97f79eb49812f1e8cff6d65c3e5  0.0s
 => => exporting manifest list sha256:cab71a3badb9937732db538f866610832d  0.0s
 => => naming to docker.io/library/hello-server:1.0.0                     0.0s
 => => unpacking to docker.io/library/hello-server:1.0.0                  0.0s

~/gitFolders/build-breaking-fixing-kubernetes master* ⇡               19:41:40
❯ docker images hello-server                                     
                                                           i Info →   U  In Use
IMAGE                ID             DISK USAGE   CONTENT SIZE   EXTRA
hello-server:1.0.0   cab71a3badb9        189MB         68.6MB        

~/gitFolders/build-breaking-fixing-kubernetes master* ⇡               19:41:49
❯ docker run --rm --detach --publish 8080:8080 --name hello-server hello-server:1.0.0
0dabc026178d18aafb71f038862a5fe3502216f92345e76e4e8584399d8a5125

~/gitFolders/build-breaking-fixing-kubernetes master* ⇡               19:43:07
❯ curl localhost:8080
Hello, world!%                                                                 
~/gitFolders/build-breaking-fixing-kubernetes master* ⇡               19:43:11
❯ docker stop hello-server
hello-server

```
