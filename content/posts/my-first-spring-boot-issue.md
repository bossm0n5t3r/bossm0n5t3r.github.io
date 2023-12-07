+++
date = 2023-11-03T15:00:00+09:00
title = "첫 번째 Spring Boot 이슈 및 후기"
authors = ["Ji-Hoon Kim"]
tags = ["Spring Boot", "Issue"]
categories = ["Spring Boot", "Issue"]
+++

## 개요

사이드 프로젝트로 진행하던 `zammanvoca-server` 프로젝트를 로컬에서 테스트 진행하던 중 아래와 같은 에러를 발견했다.

![1.png](/images/posts/my-first-spring-boot-issue/1.png)

```
.   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.1.5)

2023-10-21T00:05:19.654+09:00  INFO 4906 --- [           main] m.z.ServerApplicationKt        : Starting ServerApplicationKt using Java 17.0.9 with PID 4906
2023-10-21T00:05:19.656+09:00  INFO 4906 --- [           main] m.z.ServerApplicationKt        : The following 1 profile is active: "local"
2023-10-21T00:05:19.694+09:00  INFO 4906 --- [           main] .s.b.d.c.l.DockerComposeLifecycleManager : Using Docker Compose file 'some/path/compose.yaml'
2023-10-21T00:11:45.208+09:00 ERROR 4906 --- [           main] o.s.boot.SpringApplication               : Application run failed

java.lang.NullPointerException: Cannot invoke "org.springframework.boot.docker.compose.core.DockerCliInspectResponse.hostConfig()" because "inspectResponse" is null
    at org.springframework.boot.docker.compose.core.DefaultConnectionPorts.isHostNetworkMode(DefaultConnectionPorts.java:56) ~[spring-boot-docker-compose-3.1.5.jar:3.1.5]
    at org.springframework.boot.docker.compose.core.DefaultConnectionPorts.<init>(DefaultConnectionPorts.java:47) ~[spring-boot-docker-compose-3.1.5.jar:3.1.5]
    at org.springframework.boot.docker.compose.core.DefaultRunningService.<init>(DefaultRunningService.java:55) ~[spring-boot-docker-compose-3.1.5.jar:3.1.5]
    at org.springframework.boot.docker.compose.core.DefaultDockerCompose.getRunningServices(DefaultDockerCompose.java:83) ~[spring-boot-docker-compose-3.1.5.jar:3.1.5]
    at org.springframework.boot.docker.compose.lifecycle.DockerComposeLifecycleManager.start(DockerComposeLifecycleManager.java:120) ~[spring-boot-docker-compose-3.1.5.jar:3.1.5]
    at org.springframework.boot.docker.compose.lifecycle.DockerComposeListener.onApplicationEvent(DockerComposeListener.java:53) ~[spring-boot-docker-compose-3.1.5.jar:3.1.5]
    at org.springframework.boot.docker.compose.lifecycle.DockerComposeListener.onApplicationEvent(DockerComposeListener.java:35) ~[spring-boot-docker-compose-3.1.5.jar:3.1.5]
    at org.springframework.context.event.SimpleApplicationEventMulticaster.doInvokeListener(SimpleApplicationEventMulticaster.java:174) ~[spring-context-6.0.13.jar:6.0.13]
    at org.springframework.context.event.SimpleApplicationEventMulticaster.invokeListener(SimpleApplicationEventMulticaster.java:167) ~[spring-context-6.0.13.jar:6.0.13]
    at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:145) ~[spring-context-6.0.13.jar:6.0.13]
    at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:133) ~[spring-context-6.0.13.jar:6.0.13]
    at org.springframework.boot.context.event.EventPublishingRunListener.multicastInitialEvent(EventPublishingRunListener.java:136) ~[spring-boot-3.1.5.jar:3.1.5]
    at org.springframework.boot.context.event.EventPublishingRunListener.contextLoaded(EventPublishingRunListener.java:98) ~[spring-boot-3.1.5.jar:3.1.5]
    at org.springframework.boot.SpringApplicationRunListeners.lambda$contextLoaded$4(SpringApplicationRunListeners.java:72) ~[spring-boot-3.1.5.jar:3.1.5]
    at java.base/java.lang.Iterable.forEach(Iterable.java:75) ~[na:na]
    at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:118) ~[spring-boot-3.1.5.jar:3.1.5]
    at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:112) ~[spring-boot-3.1.5.jar:3.1.5]
    at org.springframework.boot.SpringApplicationRunListeners.contextLoaded(SpringApplicationRunListeners.java:72) ~[spring-boot-3.1.5.jar:3.1.5]
    at org.springframework.boot.SpringApplication.prepareContext(SpringApplication.java:420) ~[spring-boot-3.1.5.jar:3.1.5]
    at org.springframework.boot.SpringApplication.run(SpringApplication.java:315) ~[spring-boot-3.1.5.jar:3.1.5]
    at org.springframework.boot.SpringApplication.run(SpringApplication.java:1306) ~[spring-boot-3.1.5.jar:3.1.5]
    at org.springframework.boot.SpringApplication.run(SpringApplication.java:1295) ~[spring-boot-3.1.5.jar:3.1.5]
```

분명 이전까지는 잘 동작했는데, 그 사이에 영향을 미칠 수 있는건… brew 로 설치한 프로그램 버전 업그레이드 밖에 없었다.

그래서 구체적으로 어떤 원인이 발생한건지 확인해보았다.

## 원인 분석

NPE가 발생한 원인은 `DefaultDockerCompose` Class 내의 `getRunningServices` 메서드에서 에러 발생한 것이었고,

디버깅 결과는 다음과 같았다.

![2.png](/images/posts/my-first-spring-boot-issue/2.png)

```java
    @Override
    public List<RunningService> getRunningServices() {
        List<DockerCliComposePsResponse> runningPsResponses = runComposePs().stream().filter(this::isRunning).toList();
        if (runningPsResponses.isEmpty()) {
            return Collections.emptyList();
        }
        DockerComposeFile dockerComposeFile = this.cli.getDockerComposeFile();
        List<RunningService> result = new ArrayList<>();
        Map<String, DockerCliInspectResponse> inspected = inspect(runningPsResponses);
        for (DockerCliComposePsResponse psResponse : runningPsResponses) {
            DockerCliInspectResponse inspectResponse = inspected.get(psResponse.id()); // <-- psResponse.id() 가 inspected 의 Key 의 앞 부분만 할당되었다.
            result.add(new DefaultRunningService(this.hostname, dockerComposeFile, psResponse, inspectResponse));
        }
        return Collections.unmodifiableList(result);
    }
```

`DockerCliInspectResponse inspectResponse = inspected.get(psResponse.id());` 라인에서

`psResponse.id()` 는 `4634e75ac669` 이런 값이지만,

`inspected` 는 `4634e75ac66930fbce37ec146669182dabfa2f7b254a5f6afaa34d1cf15dbb65` 값이다.

길이 차이라고 보면 된다.

## Docker 실행한 결과

실제 저 값은 코드에서 docker 를 실행해서 가져온 값인 것을 확인할 수 있다.

그래서 로컬에서 실행해보았다.

에러 발생 시점에서 docker compose 의 버전은 최신 버전인 `2.23.0` 이었다.

![3.png](/images/posts/my-first-spring-boot-issue/3.png)

```bash
$ docker compose ps --format=json
{...,"ID":"4634e75ac669","Image":"postgres:latest",...}

$ docker inspect --format='{{ json . }}' 4634e75ac669
{"Id":"4634e75ac66930fbce37ec146669182dabfa2f7b254a5f6afaa34d1cf15dbb65",...}
```

## 그럼 왜 이전에는 제대로 동작을 했던 것일까?

docker compose 를 업데이트해서 발생했을 것이라 이미 지레짐작을 하고 있어, release를 보러 갔고, 원인이 되는 부분을 찾게 되었다.

https://github.com/docker/compose/releases/tag/v2.23.0

- release note

https://github.com/docker/compose/pull/11038

https://github.com/docker/compose/pull/10918

안내되는 내용을 보니, `--no-trunc` flag 를 붙이면 된다는 내용을 확인했고, 로컬에서 원하는 값으로 가져오는 것을 확인했다.

![4.png](/images/posts/my-first-spring-boot-issue/4.png)

```bash
$ docker compose ps --format=json --no-trunc
{...,"ID":"4634e75ac66930fbce37ec146669182dabfa2f7b254a5f6afaa34d1cf15dbb65","Image":"postgres:latest",...}
```

해결책도 어느정도 확인한 것 같다.

1. ID 의 첫번째 부분으로 substring 체크를 하거나
2. flag 를 붙여주거나

이제 공유를 해야할 타이밍이다.

## 이제 이슈 올리러 가자.

사실 이슈를 올리기 전에 이미 존재하는 지 먼저 찾아보려고 했고, 관련되어 보이는 PR을 찾아서 코멘트를 남겼다.

[DockerCliComposePsResponse ids return null · Issue #37648 · spring-projects/spring-boot](https://github.com/spring-projects/spring-boot/issues/37648#issuecomment-1769450679)

하지만, 정확한 원인이 논의되는 이슈는 아니였고, 다른 이슈로 올려달라는 말과 함께 현재는 `off-topic` 되었다.

![5.png](/images/posts/my-first-spring-boot-issue/5.png)

그래서 아래 이슈로 새로 내용을 정리해서 올렸다.

https://github.com/spring-projects/spring-boot/issues/37982

## PR도 만들까?

사실 이슈 레이징했을 때 PR 도 만들어볼까 싶었지만, 해당 내용에 대해 어떻게 해결하고 접근할 지에 대해 제대로 감이 오지 않았다.

하지만 이내 곧 해결 커밋이 올라왔고, 이슈는 Closed 되었다.

해결한 커밋은 아래와 같다.

https://github.com/spring-projects/spring-boot/commit/09821feb7559ab15433bf01f6eda86db208dc198

결과적으로는 어떻게 해결하는지 옆에서 본게 더 많은 공부가 되었다.

커밋 메시지부터, 코드, 주석, 관련된 테스트까지 하나의 샘플을 공부할 수 있어서 좋았다.

## 단순한 버그였을까?

사실 단순한 버그였는지, 아닌지는 잘 모르겠었다.

그러나 이내 관련된 버그가 코멘트로 달렸고, 사이드 이펙트가 있는 이슈라고 생각이 되었다.

[Docker Compose integration does not work with 2.23.0 due to 'Cannot invoke "org.springframework.boot.docker.compose.core.DockerCliInspectResponse.hostConfig()" because "inspectResponse" is null' · Issue #37982 · spring-projects/spring-boot](https://github.com/spring-projects/spring-boot/issues/37982#issuecomment-1780960167)

- 깃허브가 action runner 업데이트하면서 docker compose 버전도 올리게 되었고, 나와 마찬가지로 같은 에러가 발생해서 깨졌다는 내용이었다.

보통 버그를 발견하면 타인의 공유를 보고 해결하거나 공식 문서를 보고 해결하곤 했었지만,

타인의 이슈를 해결해준 경험은 없었으나, 간접적으로나마 이슈 공유를 통해 원인을 찾는데 도움을 준 것 같아 기분이 좋았다.

## References

https://github.com/spring-projects/spring-boot/issues/37982