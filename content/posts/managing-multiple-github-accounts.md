+++ 
date = 2023-10-19T03:39:30+09:00
title = "여러 개의 Github 계정을 한 곳에서 동시에 사용하기"
authors = ["Ji-Hoon Kim"]
tags = ["GitHub", "SSH"]
categories = ["GitHub", "SSH"]
+++

![](/images/logos/GitHub_Logo.png)

## SSH 키들을 생성

- 개인 계정(`youremail@forpersonal.com`)과 업무 계정(`youremail@forwork.com`)이 있다고 가정

```bash
# OSX에서 사용자의 ssh 키를 저장하는 디렉토리이다. 일단 여기로 이동해서 작업해야 편하다.
$ cd ~/.ssh

# 깃허브 개인 계정에서 사용중인 이메일주소로 ssh 키를 생성하는 명령어. 굳이 깃허브 계정과 동일할 필요는 없다.
$ ssh-keygen -t rsa -b 4096 -C "youremail@forpersonal.com"
Generating public/private rsa key pair.
Enter a file in which to save the key (/Users/yourusername/.ssh/id_rsa) : id_rsa_personal

# 깃허브 업무 계정에서 사용중인 이메일주소로 ssh 키를 생성하는 명령어. 굳이 깃허브 계정과 동일할 필요는 없다.
$ ssh-keygen -t rsa -b 4096 -C "youremail@forwork.com"
Generating public/private rsa key pair.
Enter a file in which to save the key (/Users/yourusername/.ssh/id_rsa) : id_rsa_work
```

- `passphrase`는 임의로 지정
- 위의 과정이 끝나면 다음과 같은 파일들이 생성
  - `id_rsa_personal`
  - `id_rsa_personal.pub`
  - `id_rsa_work`
  - `id_rsa_work.pub`

## 깃허브 계정에 키를 추가

```bash
# 클립보드에 id_rsa_personal.pub 의 내용을 복사함
$ pbcopy < ~/.ssh/id_rsa_personal.pub
```

- 깃허브 본인 계정에 접속한 다음 `Settings > SSH and GPG keys > New SSH Key` 에 등록
- 개인 계정과 업무 계정 모두 등록

## ~/.ssh/config 설정

- 다음과 같이 `~/.ssh/config` 파일 생성 및 설정
- `Host` 옆에 써있는 경로가 clone 시에 설정하게 되는 분기점이다.
  - 예를 들어, `Host`가 `example.github.com`이고 clone시에 `git@example.github.com:{username}/{repo}.git` 으로 받는다면 해당 `IdentityFile`을 경로에 맞게 설정할 수 있다.

```bash
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_personal   // id_rsa_work 로 써도 상관없다. 본인이 맞게 설정

Host example.github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_work       // id_rsa_personal 로 써도 마찬가지로 상관없다.
```

## 새로운 키들을 로컬에 저장

```bash
# 현재 저장되어있는 identities를 삭제
# 주의!!
$ ssh-add -D

# 새로운 키들 등록
$ ssh-add id_rsa_personal
$ ssh-add id_rsa_work

# 제대로 저장되었는지 확인
$ ssh-add -l

# 깃허브가 키들을 인식하는지 확인
# ~/.ssh/config 에서 Host를 입력하면 된다.
# successfully authenticated 가 뜨면 정상적
$ ssh -T personal.github.com
$ ssh -T work.github.com
```

## ~/.gitconfig 설정

- 이 부분은 [Git 계정 여러 개 동시 사용하기](https://blog.outsider.ne.kr/1448)를 참고하면서 설정하도록 하자
- `~/.gitconfig` 에 대한 설정을 나눠서 할 예정이다.
- 먼저 `~/.gitconfig` 부분 설정이다.

```bash
[user]
    email = {personal_email}
    name = {personal_name}
[includeIf "gitdir:~/work_directory/"]
    path = .gitconfig-work
```

- 물론 이 부분도 개인과 업무계정을 뒤바꿔 설정해도 상관없다.
- 필자의 경우 먼저 업무계정을 설정한 뒤 개인계정을 설정했으므로 전혀 차이가 없다.
- 다만 유의해야할 점은 `includeIf` 에서 directory 부분이다.
- 개인이든 업무든 하나의 폴더 안에서 관리한다면 위의 설정은 매우 편리하다.
- 필자의 경우 `~/gitFolders` 안에 개인 repo 들을 모두 모아뒀기 때문에 위와 같은 설정을 했다.
- 다음은 `~/.gitconfig-work`부분 설정이다.

```bash
[user]
    email = {work_email}
    name = {work_name}
[github]
    user = {work_name}
```

- 물론 필자는 개인계정을 여기에 설정했다.
- 조삼모사이니 본인의 선택에 따라 결정하기를 바란다.

## 테스트

- 깃허브에 `test` repository를 만들고 아무거나 커밋을 해보자.
- 정상적으로 repo 에 맞는 각 계정으로 커밋이 된다면 잘 설정된 것이다.

## References

- [Git 계정 여러 개 동시 사용하기](https://blog.outsider.ne.kr/1448)
- [맥(OSX)에서 깃허브 계정 여러개 쓰기](https://bonoogi.postype.com/post/583668)
- [Managing Multiple Github Accounts](https://mherman.org/blog/managing-multiple-github-accounts/)
- [한 대의 맥에서 여러 개의 깃허브(github) 계정 사용하는 방법](https://devlog.jwgo.kr/2018/08/17/how-to-use-multi-github-accounts-with-a-machine/)
- [Organizing multiple Git identities](https://garrit.xyz/posts/2023-10-13-organizing-multiple-git-identities)
  - SSH 설정 없이 관리하는 방법을 소개한다.
