+++
date = 2025-05-27T23:50:00+09:00
title = "SDKMAN! 으로 다중 JDK 관리하기 (migrating from jEnv)"
authors = ["Ji-Hoon Kim"]
tags = ["sdkman", "jdk", "jenv"]
categories = ["sdkman", "jdk", "jenv"]
+++

## 개요

- 이번에는 기존 `jEnv` 로 다중 JDK 관리하는 환경을 `SDKMAN!` 으로 옮겨보려고 한다.

## 기존 다중 JDK 관리했던 방법 (`Homebrew` + `jEnv`)

- 우선 기존 다중 JDK 관리했던 방법은 아래와 같다.
  - 여러 JDK 설치는 `Homebrew` 를 통해 관리했다.
    - 업데이트를 쉽게 하려고…
  - 그리고 설치한 JDK 를 `/Library/Java/JavaVirtualMachines` 경로에 심볼릭 링크로 등록한다.
  - 그리고 `jEnv` 로 설치한 JDK 들을 추가한 다음, global 설정 및 각 프로젝트 별로 JDK 설정해서 사용한다.

## 기존 관리 방법의 문제점

- 일단 매우 번거로웠다.
  - 설치, 등록, 설정
- `jEnv` 로 프로젝트 버전 설정시 마이너 버전 설정까지 필요한데 업데이트가 됐다면, 다시 등록하는 과정도 필요했다.
- `Homebrew` 저장소에 없는 JDK는 설치가 불편했다.
  - JDK 외의 개발 도구는 별도 관리 필요

## SDKMAN! 으로 옮기기

- 우선 기존 설치된 모든 환경 설정을 제거해야 한다.
- 제거는 설치의 역순!

### `jEnv` 설정 제거하기

- https://github.com/jenv/jenv/issues/95 에서 마지막 코멘트를 참고하면 된다.
  - https://github.com/jenv/jenv/issues/95#issuecomment-659375679
- 아래 순서로 진행된다.
  - `jEnv` 관련된 설정 제거
  - `jEnv` uninstall
  - `.jenv` 폴더 제거
- `jEnv` 관련된 설정 제거
  - 설치할 때 프로필에 추가한 jenv 관련된 라인을 지워야 한다.
  - e.g. `~/.profile` or `~/.zshrc`

```bash
export PATH="$HOME/.jenv/bin:$PATH"
eval "$(jenv init -)"
```

- `jEnv` uninstall 하기

```bash
❯ brew uninstall jenv
Uninstalling /opt/homebrew/Cellar/jenv/0.5.7... (86 files, 78.1KB)
```

- `.jenv` 폴더 제거

```bash
❯ rm -rf ~/.jenv
```

### `/Library/Java/JavaVirtualMachines` 경로에 심볼릭 링크 모두 제거

```bash
~                                                                      13:04:45
❯ ls -altr /Library/Java/JavaVirtualMachines
total 0
lrwxr-xr-x  1 root  wheel   48 May  5  2022 openjdk-17.jdk -> /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk
lrwxr-xr-x  1 root  wheel   48 Jun 20  2022 openjdk-11.jdk -> /opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk
lrwxr-xr-x  1 root  wheel   48 Sep 21  2024 openjdk-23.jdk -> /opt/homebrew/opt/openjdk@23/libexec/openjdk.jdk
drwxr-xr-x  4 root  wheel  128 May  4 14:39 ..
lrwxr-xr-x  1 root  wheel   48 May 11 03:37 openjdk-21.jdk -> /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk
drwxr-xr-x  6 root  wheel  192 May 20 04:55 .

~                                                                      13:05:10
❯ sudo rm -rf /Library/Java/JavaVirtualMachines/openjdk-*
Password:

~                                                                      13:05:43
❯ ls -altr /Library/Java/JavaVirtualMachines
total 0
drwxr-xr-x  4 root  wheel  128 May  4 14:39 ..
drwxr-xr-x  2 root  wheel   64 May 25 13:05 .
```

### `Homebrew` 로 설치한 JDK 모두 지우기

- SDKMAN! 으로 JDK 를 설치할 예정이기 때문에 별도로 설치되긴 하지만 다 지워주는게 깔끔하다.
- 아래 명령어를 통해 우선 설치한 JDK 를 모두 확인한 다음 지워주면 된다.

```bash
❯ brew list | grep jdk
openjdk
openjdk@11
openjdk@17
openjdk@21
```

- 그런데… 다른 곳에서 참고하는 친구들이 있었다.

```bash
❯ brew uninstall openjdk openjdk@11 openjdk@17 openjdk@21
Error: Refusing to uninstall /opt/homebrew/Cellar/openjdk/23.0.2
because it is required by clojure, gradle, kotlin, leiningen and maven, which are currently installed.
You can override this and force removal with:
  brew uninstall --ignore-dependencies openjdk openjdk@11 openjdk@17 openjdk@21

```

- 우선 관련없는 아래 버전들 지워주고, 안내해준대로 명시된 모든 라이브러리 지워주면 된다.
  - 왜냐하면 모두 SDKMAN! 으로 설치하려고 하기 때문에!
- 모두 리스트업해서… 지워주자
  - `clojure`, `gradle`, `kotlin`, `leiningen` and `maven`

```bash
~                                                                      13:07:51
❯ brew uninstall clojure
Uninstalling /opt/homebrew/Cellar/clojure/1.12.0.1530... (14 files, 16.5MB)
==> Autoremoving 1 unneeded formula:
rlwrap
Uninstalling /opt/homebrew/Cellar/rlwrap/0.46.2... (46 files, 416.7KB)

~                                                                      13:09:02
❯ brew uninstall gradle
Uninstalling /opt/homebrew/Cellar/gradle/8.14.1... (22,433 files, 440.2MB)

~                                                                      13:09:13
❯ brew uninstall kotlin
Uninstalling /opt/homebrew/Cellar/kotlin/2.1.21... (126 files, 90.0MB)

~                                                                      13:09:21
❯ brew uninstall leiningen
Uninstalling /opt/homebrew/Cellar/leiningen/2.11.2... (10 files, 15.8MB)

~                                                                      13:09:32
❯ brew uninstall maven
Uninstalling /opt/homebrew/Cellar/maven/3.9.9... (94 files, 10.2MB)
==> Autoremoving 3 unneeded formulae:
icu4c@76
openjdk
python@3.12
Uninstalling /opt/homebrew/Cellar/python@3.12/3.12.10_1... (3,598 files, 67MB)
Uninstalling /opt/homebrew/Cellar/openjdk/23.0.2... (602 files, 337.4MB)
Uninstalling /opt/homebrew/Cellar/icu4c@76/76.1_2... (277 files, 81MB)
```

- 이제 jdk 를 모두 지워주자

```bash
~                                                                      13:09:41
❯ brew uninstall openjdk openjdk@11 openjdk@17 openjdk@21
Error: No such keg: /opt/homebrew/Cellar/openjdk

~                                                                      13:10:11
❯ brew uninstall openjdk@11 openjdk@17 openjdk@21
Uninstalling /opt/homebrew/Cellar/openjdk@11/11.0.27... (667 files, 296MB)
Uninstalling /opt/homebrew/Cellar/openjdk@17/17.0.15... (636 files, 305MB)
Uninstalling /opt/homebrew/Cellar/openjdk@21/21.0.7... (600 files, 331MB)
==> Autoremoving 14 unneeded formulae:
cairo
fontconfig
freetype
giflib
graphite2
harfbuzz
libx11
libxau
libxcb
libxdmcp
libxext
libxrender
little-cms2
xorgproto
Uninstalling /opt/homebrew/Cellar/little-cms2/2.17... (23 files, 1.4MB)
Uninstalling /opt/homebrew/Cellar/harfbuzz/11.2.1... (77 files, 10.2MB)
Uninstalling /opt/homebrew/Cellar/giflib/5.2.2... (19 files, 544.5KB)
Uninstalling /opt/homebrew/Cellar/graphite2/1.3.14... (18 files, 280.6KB)
Uninstalling /opt/homebrew/Cellar/cairo/1.18.4... (53 files, 2.2MB)
Uninstalling /opt/homebrew/Cellar/fontconfig/2.16.0... (92 files, 1.5MB)
Uninstalling /opt/homebrew/Cellar/libxrender/0.9.12... (13 files, 225.3KB)
Uninstalling /opt/homebrew/Cellar/libxext/1.3.6... (87 files, 450.9KB)
Uninstalling /opt/homebrew/Cellar/freetype/2.13.3... (68 files, 2.5MB)
Uninstalling /opt/homebrew/Cellar/libx11/1.8.12... (1,043 files, 7MB)
Uninstalling /opt/homebrew/Cellar/libxcb/1.17.0... (2,497 files, 7.5MB)
Uninstalling /opt/homebrew/Cellar/libxau/1.0.12... (21 files, 134.4KB)
Uninstalling /opt/homebrew/Cellar/libxdmcp/1.1.5... (11 files, 136.4KB)
Uninstalling /opt/homebrew/Cellar/xorgproto/2024.1... (267 files, 3.9MB)
```

## SDKMAN! 설치하기

- https://sdkman.io/install 를 참고하면 된다.

`````````bash
❯ curl -s "https://get.sdkman.io" | bash

                                -+syyyyyyys:
                            `/yho:`       -yd.
                         `/yh/`             +m.
                       .oho.                 hy                          .`
                     .sh/`                   :N`                `-/o`  `+dyyo:.
                   .yh:`                     `M-          `-/osysoym  :hs` `-+sys:      hhyssssssssy+
                 .sh:`                       `N:          ms/-``  yy.yh-      -hy.    `.N-````````+N.
               `od/`                         `N-       -/oM-      ddd+`     `sd:     hNNm        -N:
              :do`                           .M.       dMMM-     `ms.      /d+`     `NMMs       `do
            .yy-                             :N`    ```mMMM.      -      -hy.       /MMM:       yh
          `+d+`           `:/oo/`       `-/osyh/ossssssdNMM`           .sh:         yMMN`      /m.
         -dh-           :ymNMMMMy  `-/shmNm-`:N/-.``   `.sN            /N-         `NMMy      .m/
       `oNs`          -hysosmMMMMydmNmds+-.:ohm           :             sd`        :MMM/      yy
      .hN+           /d:    -MMMmhs/-.`   .MMMh   .ss+-                 `yy`       sMMN`     :N.
     :mN/           `N/     `o/-`         :MMMo   +MMMN-         .`      `ds       mMMh      do
    /NN/            `N+....--:/+oooosooo+:sMMM:   hMMMM:        `my       .m+     -MMM+     :N.
   /NMo              -+ooooo+/:-....`...:+hNMN.  `NMMMd`        .MM/       -m:    oMMN.     hs
  -NMd`                                    :mm   -MMMm- .s/     -MMm.       /m-   mMMd     -N.
 `mMM/                                      .-   /MMh. -dMo     -MMMy        od. .MMMs..---yh
 +MMM.                                           sNo`.sNMM+     :MMMM/        sh`+MMMNmNm+++-
 mMMM-                                           /--ohmMMM+     :MMMMm.       `hyymmmdddo
 MMMMh.                  ````                  `-+yy/`yMMM/     :MMMMMy       -sm:.``..-:-.`
 dMMMMmo-.``````..-:/osyhddddho.           `+shdh+.   hMMM:     :MmMMMM/   ./yy/` `:sys+/+sh/
 .dMMMMMMmdddddmmNMMMNNNNNMMMMMs           sNdo-      dMMM-  `-/yd/MMMMm-:sy+.   :hs-      /N`
  `/ymNNNNNNNmmdys+/::----/dMMm:          +m-         mMMM+ohmo/.` sMMMMdo-    .om:       `sh
     `.-----+/.`       `.-+hh/`         `od.          NMMNmds/     `mmy:`     +mMy      `:yy.
           /moyso+//+ossso:.           .yy`          `dy+:`         ..       :MMMN+---/oys:
         /+m:  `.-:::-`               /d+                                    +MMMMMMMNh:`
        +MN/                        -yh.                                     `+hddhy+.
       /MM+                       .sh:
      :NMo                      -sh/
     -NMs                    `/yy:
    .NMy                  `:sh+.
   `mMm`               ./yds-
  `dMMMmyo:-.````.-:oymNy:`
  +NMMMMMMMMMMMMMMMMms:`
    -+shmNMMMNmdy+:`

                                                                 Now attempting installation...

Looking for a previous installation of SDKMAN...
Looking for unzip...
Looking for zip...
Looking for tar...
Looking for curl...
Looking for sed...
Installing SDKMAN scripts...
Create distribution directories...
Getting available candidates...
Prime platform file...
Prime the config file...
Installing script cli archive...
* Downloading...
######################################################################## 100.0%
* Checking archive integrity...
* Extracting archive...
* Copying archive contents...
* Cleaning up...

Installing script cli archive...
* Downloading...
######################################################################## 100.0%
* Checking archive integrity...
* Extracting archive...
* Copying archive contents...
* Cleaning up...

Set version to 5.19.0 ...
Set native version to 0.7.4 ...
Attempt update of login bash profile on OSX...
Attempt update of zsh profile...
Updated existing /Users/bossm0n5t3r/.zshrc

All done!

You are subscribed to the STABLE channel.

Please open a new terminal, or run the following in the existing one:

    source "/Users/bossm0n5t3r/.sdkman/bin/sdkman-init.sh"

Then issue the following command:

    sdk help

Enjoy!!!
`````````

- 시키는 대로 다시 터미널을 열어주자
- 아래 명령어로 설치 확인하면 된다.

```bash
❯ sdk version

SDKMAN!
script: 5.19.0
native: 0.7.4 (macos aarch64)
```

### SDKMAN! 를 업데이트 하는 방법

- https://sdkman.io/usage#self-update 를 참고하면 된다.

```bash
sdk selfupdate
```

### SDKMAN! 으로 설치한 JDK, SDK 업데이트 하는 방법

- https://sdkman.io/usage#update 를 참고하면 된다.

```bash
WARNING: SDKMAN is out-of-date and requires an update.

sdk update

Adding new candidates(s): kotlin
```

### SDKMAN! 을 완전히 지우는 방법

- https://sdkman.io/install#uninstallation 를 참고하면 된다.

## 기존에 설치했던 JVM 및 여러 도구 모두 설치하기

- 이제 다 알아봤으니 설치할 때가 왔다.
- kotlin, gradle, openjdk 21 까지만 설치해보겠다.

```bash
~                                                                      13:11:40
❯ sdk install kotlin

Downloading: kotlin 2.1.21

In progress...

######################################################################### 100.0%

Installing: kotlin 2.1.21
Done installing!

Setting kotlin 2.1.21 as default.

~                                                                  14s 13:13:24
❯ sdk install gradle

Downloading: gradle 8.14.1

In progress...

######################################################################### 100.0%######################################################################### 100.0%

Installing: gradle 8.14.1
Done installing!

Setting gradle 8.14.1 as default.

~                                                                  19s 13:13:49
❯ sdk install java

Downloading: java 21.0.7-tem

In progress...

######################################################################### 100.0%

Repackaging Java 21.0.7-tem...

Done repackaging...
Cleaning up residual files...

Installing: java 21.0.7-tem
Done installing!

Setting java 21.0.7-tem as default.
```

- 설치 확인은 아래와 같다.

```bash
❯ kotlinc -version
info: kotlinc-jvm 2.1.21 (JRE 21.0.7+6-LTS)

~                                                                      13:19:31
❯ gradle --version

Welcome to Gradle 8.14.1!

Here are the highlights of this release:
 - Java 24 support
 - GraalVM Native Image toolchain selection
 - Enhancements to test reporting
 - Build Authoring improvements

For more details see https://docs.gradle.org/8.14.1/release-notes.html

------------------------------------------------------------
Gradle 8.14.1
------------------------------------------------------------

Build time:    2025-05-22 13:44:09 UTC
Revision:      c174b82566a79e3575bac8c7648c7b36cd815e94

Kotlin:        2.0.21
Groovy:        3.0.24
Ant:           Apache Ant(TM) version 1.10.15 compiled on August 25 2024
Launcher JVM:  21.0.7 (Azul Systems, Inc. 21.0.7+6-LTS)
Daemon JVM:    /Users/bossm0n5t3r/Library/Java/JavaVirtualMachines/azul-21.0.7/Contents/Home (no JDK specified, using current Java home)
OS:            Mac OS X 15.5 aarch64

~                                                                      13:19:40
❯ java --version
openjdk 21.0.7 2025-04-15 LTS
OpenJDK Runtime Environment Temurin-21.0.7+6 (build 21.0.7+6-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.7+6 (build 21.0.7+6-LTS, mixed mode, sharing)
```

## SDKMAN! 프로젝트 별 설정

- https://sdkman.io/usage#env-command 를 참고하면 된다.

## IntelliJ 에서 JDK 관리 업데이트

- 이제 기존 사용되는 곳에 등록된 JDK 도 수정해야 한다.
- IntelliJ 의 Platform Settings 에서 JDK 설정해주면 된다.

## 결론

- 하나로 brew 에서 분리 관리하고 정확한 버전 설치 가능하니 더 괜찮다고 생각한다.
