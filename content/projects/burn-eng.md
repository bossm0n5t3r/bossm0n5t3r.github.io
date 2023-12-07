+++
date = 2023-11-22T21:00:00+09:00
title = "번잉 (burn-eng) 🔥"
+++

## 소개

이번에 만든 서비스는 "[번잉 (burn-eng) 🔥](https://burn-eng.vercel.app/)" 이라는 앱이다.

우리의 서비스는 쉽게 말해서,

- 주어진 문장을 영작해보고
- 영작한 문장에 대한 평가를 `ChatGPT` 를 통해 받아보는 서비스다.

현재는 웹버전만 제공하고 있으며, 모바일도 대응되게끔 처리되었고 앱은 따로 없다.

(반응 좋으면 만들겠지...)

간단하게 아래 페이지에 서비스가 설명되어있다.

![introduce.png](/images/projects/burn-eng/introduce.png)

## Backend

우선 이번 사이드 프로젝트를 진행하면서 내가 맡은 부분은 Backend 였고,

개발하면서 사용한 기술 스택을 전체적으로 한 번 정리해보았다.

| Programming Language  | Kotlin                                                                 |
|-----------------------|------------------------------------------------------------------------|
| Web Framework         | Spring Webflux, Spring Security                                        |
| Database Connectivity | Spring Data R2DBC, r2dbc-postgresql (production), r2dbc-h2 (for local) |
| DB Service            | Supabase                                                               |
| Cloud Service         | AWS - EC2, S3, ECR, CodeDeploy, Route 53                               |
| CI/CD                 | GitHub Actions - AWS CodeDeploy                                        |
| Others                | OpenAI ChatGPT                                                         |

CI/CD 의 경우 기존 `GitHub Actions` - `fly.io` 를 통해 구성했으나,

`fly.io` 의 경우 콜드 스타트가 30초 정도 걸리는 부분이 아쉬웠고, 결국 AWS 로 마이그레이션했다.

특히 이번 서버는 `reactive programming` 으로 개발했다.

그리고 이를 위해 `Reactor` 에 대한 개념을 공부했고,

공부한 내용은 https://github.com/bossm0n5t3r/reactor-kotlin-workshop 로 정리했다.

나중에 기회가 되면 따로 글로 정리해보겠다.

## References

[AI 영어 공부 서비스,🔥번잉🔥](https://burn-eng.vercel.app/)
