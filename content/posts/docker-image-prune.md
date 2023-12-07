+++
date = 2023-09-09T23:30:00+09:00
title = "[Docker 🐳] 사용하지 않는 이미지 지우기"
authors = ["Ji-Hoon Kim"]
tags = ["Docker"]
categories = ["Docker"]
series = ["Docker"]
+++

<img src="/images/posts/docker-logs/primary-blue-docker-logo.svg">

AWS EC2 에 배포를 할 때 마다 ECR 의 docker image 를 가져다가 배포를 하는데,

배포할 때 이전 이미지를 지우지 않다보니, 계속 쌓이는게 아닌가?

그래서 지우는 방법을 찾아봤다.

```bash
[ec2-user@server ~]$ docker images --all
REPOSITORY                                                            TAG                                        IMAGE ID       CREATED             SIZE
ecr.ap-northeast-2.amazonaws.com/server   a69096336833132753fc8bd6f44330504cac311f   caba7228ff8d   44 minutes ago      357MB
ecr.ap-northeast-2.amazonaws.com/server   d325ae600042dadf912e27be9271a5ff0cbe9f1c   cfe93ad60c29   58 minutes ago      357MB
ecr.ap-northeast-2.amazonaws.com/server   47755d0976977ecc5c47308f7c831cb57f63cee8   67025ae0ab40   About an hour ago   357MB
ecr.ap-northeast-2.amazonaws.com/server   0c187f1a07b02a40c02650aaeeb1058647f924ab   b33c612afe10   About an hour ago   357MB
ecr.ap-northeast-2.amazonaws.com/server   dc3b794cec831ba8e3768056f10a147d601a5265   a69f170a3b99   2 hours ago         357MB
ecr.ap-northeast-2.amazonaws.com/server   10be8adeaa8878e0a6f0ec755375d00da8ca79f9   83ab36c1613d   35 hours ago        357MB
[ec2-user@server ~]$ docker image prune -a -f
Deleted Images:
untagged: ecr.ap-northeast-2.amazonaws.com/server:47755d0976977ecc5c47308f7c831cb57f63cee8
untagged: ecr.ap-northeast-2.amazonaws.com/server@sha256:d80189702e43ee4a120be66d04ef0110c66bf382fd2a137f23eecf5a4acd8807
deleted: sha256:67025ae0ab40533b487318b47fad3bd5ca2e09143e050bc16491e244c9490887
deleted: sha256:f88fde5e00c9be87b9d3d346ea3887709eb6f6fbd9a5750fe4867e2f766424bc
deleted: sha256:cbdf14fb9059aa344e011fa658b2920e3fc8a40e116afb42cdb2a2c2ce6fd3f4
untagged: ecr.ap-northeast-2.amazonaws.com/server:d325ae600042dadf912e27be9271a5ff0cbe9f1c
untagged: ecr.ap-northeast-2.amazonaws.com/server@sha256:4498099854983e88ac8812a6391baaf5416fb9bc217757eef684a45b3421786c
deleted: sha256:cfe93ad60c296f883da1ef6683075a5bec4236b27bf9ce43bfd71a79e6a06924
deleted: sha256:77b921112c22308891d14ae89630647d772ea9b4e3d060bf139c15f2ad730def
deleted: sha256:ac3757abc5d75ae921b8376f76435b1673967aab04a7e3a91b1230309f828c39
untagged: ecr.ap-northeast-2.amazonaws.com/server:10be8adeaa8878e0a6f0ec755375d00da8ca79f9
untagged: ecr.ap-northeast-2.amazonaws.com/server@sha256:cd480ba3ad67a7112fce6d5df83a22f85b31f67b1245c73e0ce4151bc4050944
deleted: sha256:83ab36c1613df59a6ca155aae4ffafd0ebed481bf6693944469360dfd2e62ab8
deleted: sha256:3987e79726a3b47267068f9c37e3436844aee854c5336d72fa4247aaa812bef7
deleted: sha256:6499a5526574b86d07404fd95d8e99584e55c72846a6176b696d30e67fd26769
untagged: ecr.ap-northeast-2.amazonaws.com/server:dc3b794cec831ba8e3768056f10a147d601a5265
untagged: ecr.ap-northeast-2.amazonaws.com/server@sha256:ff13962f35cc6d9bb75d3f7b4660490f5e294863dce1e896b85855a978b3b59c
deleted: sha256:a69f170a3b99cdd3cbfd128c42d7207f7037eb02ef3b2fb8d51a9b9abf479e70
deleted: sha256:f70ca3c53c6ff4f84c46e3a5a9c2a69c51ac424359a21b39143a0ee605bf384d
deleted: sha256:aa8cf0fee4562148f89cb90f0a1564b006587eedff2f3403dcc45f3ba813a0e2
untagged: ecr.ap-northeast-2.amazonaws.com/server:0c187f1a07b02a40c02650aaeeb1058647f924ab
untagged: ecr.ap-northeast-2.amazonaws.com/server@sha256:4193bda8215848ce793ea380114edbcb0ff0db1a5bd952a5b8910db244d3b062
deleted: sha256:b33c612afe1036b28f7026624d82fcb13158cad4658bb029653a5a5b5ed39097
deleted: sha256:c523e5ae9d0999c728b5e943683716380d629ee3338e89f92967fb9cacb80844
deleted: sha256:5e5b8f0b3f2c653472914fd0a2c0715ef0cb8ac3cdaec266478a62b108887148

Total reclaimed space: 265.5MB
[ec2-user@server ~]$ docker images --all
REPOSITORY                                                            TAG                                        IMAGE ID       CREATED          SIZE
ecr.ap-northeast-2.amazonaws.com/server   a69096336833132753fc8bd6f44330504cac311f   caba7228ff8d   46 minutes ago   357MB
```

다른 옵션은 아래와 같다.

| Option     | Short | Default | Description                                      |
| ---------- | ----- | ------- | ------------------------------------------------ |
| `--all`    | `-a`  | `false` | Remove all unused images, not just dangling ones |
| `--filter` |       |         | Provide filter values (e.g. `until=<timestamp>`) |
| `--force`  | `-f`  | `false` | Do not prompt for confirmation                   |

## References

- https://docs.docker.com/engine/reference/commandline/image_prune/
