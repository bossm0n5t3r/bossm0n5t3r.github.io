+++ 
date = 2023-09-09T23:00:00+09:00
title = "[Docker 🐳] Container 로그 가져오기"
authors = ["Ji-Hoon Kim"]
tags = ["Docker"]
categories = ["Docker"]
series = ["Docker"]
+++

<img src="/images/posts/docker-logs/primary-blue-docker-logo.svg">

최근 AWS EC2 를 사이드 프로젝트에 사용하게 되면서, 로그를 확인할 일이 생겼다.

그런데 터미널에서 ssh 로 EC2 에 접속하다보니, 로그를 tui 로 봐야하는게 아닌가?

기존에 로그를 파악하는 `tail -f` 처럼 docker cli 에도 비슷한게 있는지 찾아봤고, 존재했다.

```shell
[ec2-user@server ~]$ docker logs -f --tail 10 {{container-name}}
This generated password is for development use only. Your security configuration must be updated before running your application in production.

2023-09-10T03:22:14.481+09:00  INFO 1 --- [           main] o.s.b.a.e.web.EndpointLinksResolver      : Exposing 1 endpoint(s) beneath base path '/actuator'
2023-09-10T03:22:14.601+09:00  INFO 1 --- [           main] o.s.s.web.DefaultSecurityFilterChain     : Will secure any request with [~~~]
2023-09-10T03:22:16.289+09:00  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2023-09-10T03:22:16.340+09:00  INFO 1 --- [           main] m.z.ServerApplicationKt                  : Started ServerApplicationKt in 14.852 seconds (process running for 16.395)
2023-09-10T03:22:25.913+09:00  INFO 1 --- [nio-8080-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2023-09-10T03:22:25.917+09:00  INFO 1 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2023-09-10T03:22:25.928+09:00  INFO 1 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 9 ms
2023-09-10T03:23:50.857+09:00  INFO 1 --- [nio-8080-exec-6] o.springdoc.api.AbstractOpenApiResource  : Init duration for springdoc-openapi is: 2049 ms
```

다른 옵션은 아래와 같다.

| Option        | Short | Default | Description                                                                                              |
| ------------- | ----- | ------- | -------------------------------------------------------------------------------------------------------- |
| \--details    |       | false   | Show extra details provided to logs                                                                      |
| \--follow     | \-f   | false   | Follow log output                                                                                        |
| \--since      |       |         | Show logs since timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes)              |
| \--tail       | \-n   | all     | Number of lines to show from the end of the logs                                                         |
| \--timestamps | \-t   | false   | Show timestamps                                                                                          |
| \--until      |       |         | API 1.35+ Show logs before a timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes) |

## References

- https://docs.docker.com/engine/reference/commandline/logs/
