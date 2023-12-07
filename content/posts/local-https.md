+++
date = 2023-10-14T12:00:00+09:00
title = "로컬 개발에서 HTTPS를 사용하는 방법"
authors = ["Ji-Hoon Kim"]
tags = ["localhost", "https", "ngrok", "ssh-portforwarding", "spring-boot"]
categories = ["localhost", "https", "ngrok", "ssh-portforwarding", "spring-boot"]
+++

## 개요

찾아본 방법은 크게 세 가지 이다.

1. HTTPS using an internet proxy
2. mkcert + Nginx docker image
3. Configure Spring Boot to use HTTPS using mkcert

## HTTPS using an internet proxy

- ngrok, localhost.run 두 가지 방법이 있다.

### ngrok 란?

- [https://ngrok.com/](https://ngrok.com/)
- 설치가 필요
- 무료로 이용할 경우 조금 제한

~~그래서 안했다.~~

### localhost.run 란?

- [https://localhost.run/](https://localhost.run/)
- 설치가 불필요
- SSH 포트포워딩을 통해서 사용가능

### localhost.run 적용해보기

- 우선 터미널에서 아래와 같이 실행해준다.
    ```bash
    ssh -R 80:localhost:8080 localhost.run
    ```
  - cf.) 원한다면, 다른 포트도 선택가능하다.

- 실행하면 터미널에 아래와 같이 접속 가능한 링크가 뜨게 된다.

```bash
...
===============================================================================

** your connection id is c76ffccd-6b1b-4149-b9b9-7d8478e3e5bd, please mention it if you send me a message about an issue. **

cda0814b3d6062.lhrtunnel.link tunneled with tls termination, https://cda0814b3d6062.lhrtunnel.link
```

- 서버를 실행하고, 접속하면 아래와 같이 잘 보이게 된다.

![1.png](/images/posts/local-https/1.png)

![2.png](/images/posts/local-https/2.png)

- 터미널을 종료하고 다시 실행해도 같은 url로 뜬다.
- 자세한 내용은 doc를 참고하자.

### 유의사항

- 이러한 툴의 목적은 로컬 개발에 사용할 수 있는 공개 URL을 제공하는 것이다.
- 이 URL은 인터넷을 통해 무언가를 공유하고 싶은 경우에 매우 적합하다.
- 공유하지 않으려면 개발 머신을 잠재적인 온라인 공격자에게 노출시키지 않는 것이 좋다.
- 다음 두 가지 옵션을 사용하면 이 문제를 방지 가능하다.

## `mkcert` + Nginx docker image

- `mkcert`를 이용해서 인증서를 설치한 다음
- `docker`를 이용해서 띄울 때 인증서를 가져다가 사용하는 방법이다.
- 귀찮아서 안해봤다.

## Configure Spring Boot to use HTTPS using `mkcert`

- 사실 제일 간단하고 바로 적용해볼 수 있는 것 같아서 직접 해봤다.
- [https://github.com/FiloSottile/mkcert#installation](https://github.com/FiloSottile/mkcert#installation) 를 참고하면 된다.
- 우선 `mkcert` 부터 설치해주자.
    ```bash
     brew install mkcert
     brew install nss # if you use Firefox
     ```
- 로컬 루트 CA에 `mkcert`를 추가하자.
    ```bash
     $ mkcert -install
     Created a new local CA 💥
     Sudo password:
     The local CA is now installed in the system trust store! ⚡️
     The local CA is now installed in Java's trust store! ☕️
     ```
- `.config` 아래에 디렉터리를 하나만들어주자.
  ```bash
  # create the directory
  mkdir -p ~/.config/spring-boot
  ```
- pkcs12 format 인증서를 해당 디렉터리 밑에 생성해주자.
    ```bash
     $ mkcert -pkcs12 -p12-file ~/.config/spring-boot/local-tls.p12 localhost

     Created a new certificate valid for the following names 📜
      - "localhost"

     The PKCS#12 bundle is at "/Users/bossm0n5t3r/.config/spring-boot/local-tls.p12" ✅

     The legacy PKCS#12 encryption password is the often hardcoded default "changeit" ℹ️

     It will expire on 3 July 2024 🗓
     ``` 

- `~/.config/spring-boot/spring-boot-devtools.yaml` 파일을 아래와 같이 생성해주자.
  - `.yaml` 이 아니라 `.properties`로 해도 상관없다.
    - 물론 이럴 경우, 아래 포맷을 맞게 수정해줘야 한다.
    - [https://developer.okta.com/blog/2022/01/31/local-https-java#configure-spring-boot-to-use-https](https://developer.okta.com/blog/2022/01/31/local-https-java#configure-spring-boot-to-use-https)
      에서는 `.properties` 로 진행했으니 참고하면 된다.
    ```yaml
    server:
      port: 8443 # Set the port
      ssl:
        key-store: ${user.home}/.config/spring-boot/local-tls.p12 # configure the key store path
    ```

- `Intellij CE` 에서 설정해주자.
  - `Spring Boot DevTools` 를 사용한다면 별다른 설정을 해줄 필요가 없다고 한다.
    - 이 말인 즉슨, 필자는 다른 방법으로 했다.
  - `Run Configuration` 의 `Environment variables`에 다음과 같이 추가해주면 된다.
    - 이전의 설정 값이 있다면, `;` 로 구분해주면 된다.
    ```yaml
    SPRING_CONFIG_IMPORT=${user.home}/.config/spring-boot/spring-boot-devtools.yaml
    ```
  ![3.png](/images/posts/local-https/3.png)

- 잘 적용된 것 을 확인할 수 있다.

  ![4.png](/images/posts/local-https/4.png)

## References

- [https://developer.okta.com/blog/2022/01/31/local-https-java](https://developer.okta.com/blog/2022/01/31/local-https-java)
- [https://web.dev/i18n/ko/how-to-use-local-https/](https://web.dev/i18n/ko/how-to-use-local-https/)
- [https://sogoagain.github.io/2020/12/04/mkcert를-이용한-localhost-HTTPS-TLS-설정/](https://sogoagain.github.io/2020/12/04/mkcert%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-localhost-HTTPS-TLS-%EC%84%A4%EC%A0%95/)
- [https://shekhargulati.com/2019/01/19/enabling-https-for-local-spring-boot-development-with-mkcert/](https://shekhargulati.com/2019/01/19/enabling-https-for-local-spring-boot-development-with-mkcert/)
