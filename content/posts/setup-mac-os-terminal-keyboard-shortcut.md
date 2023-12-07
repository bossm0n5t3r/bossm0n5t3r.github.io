+++
date = 2023-07-30T03:00:00+09:00
title = "macOS 어디에서든 단축키로 터미널 실행하기"
authors = ["Ji-Hoon Kim"]
tags = ["macOS", "terminal"]
categories = ["macOS", "terminal"]
+++

![main.jpeg](/images/posts/setup-mac-os-terminal-keyboard-shortcut/main.jpeg)

- 예전에 우분투를 사용했을 때 가장 편하게 사용했던 단축키 중 하나는 어디서든 터미널을 단축키로 부르는 것이었다.
  - `Ctrl + Alt + T`
- 그런데 맥을 사용하다보니, 이런 단축키가 없어서 항상
  - `Spotlight 검색` 을 눌러서 실행한 뒤에,
  - (Option) 영어가 아니면 영어로 바꾸고 (`Ctrl + Space`)
  - 그 다음에 터미널을 검색 (`Ter...`) 까지 하면 터미널을 실행할 수 있다.
- 너무나 번잡시럽다.
- 그래서 우연치 않게 찾은 꿀팁을 공유하고자 한다.
- 여기서는 맥에서 기본적으로 `Automator` 라는 앱이 있어서 그걸 활용할 것이다.

## 현재 환경

- macOS Ventura 13.4.1

## Automator 실행

- Automator를 실행해주자.
- 그럼 아래와 같이 보일 것이다.

![1.png](/images/posts/setup-mac-os-terminal-keyboard-shortcut/1.png)

- 여기서 `새로운 문서` 를 누르면 아래와 같이 나온다.

![2.png](/images/posts/setup-mac-os-terminal-keyboard-shortcut/2.png)

- 그 다음 아래와 같이 `빠른 동작` 을 눌러주자.

![3.png](/images/posts/setup-mac-os-terminal-keyboard-shortcut/3.png)
![4.png](/images/posts/setup-mac-os-terminal-keyboard-shortcut/4.png)

- 이제 여기서 `AppleScript 실행` 을 더블 클릭해주면 아래와 같은 화면이 나올 것이다.

![5.png](/images/posts/setup-mac-os-terminal-keyboard-shortcut/5.png)

- 이제 거의 끝났다.
- `AppleScript` 넣는 부분에 아래와 같이 넣어주자.
  ```text
  on run {input, parameters}
      tell application "Terminal"
          if it is running then
              do script ""
          end if
          activate
      end tell
  end run
  ```
- 그리고 `실행` (▶️)을 눌러서 터미널이 실행되면 아래와 같이 스크립트에 색이 입혀진다.

![6.png](/images/posts/setup-mac-os-terminal-keyboard-shortcut/6.png)

- 끝났다.
- 저장 (`Cmd + S`)를 누르고 대충 제목을 입력해주면, `/Library/Services` 에 잘 저장된다.

![7.png](/images/posts/setup-mac-os-terminal-keyboard-shortcut/7.png)

## 단축키 설정

- `설정` - `키보드` - `단축키` 에 들어가서 아래와 같이 설정해주면 된다.
  - 단축키는 편하게 설정해두자.

![8.png](/images/posts/setup-mac-os-terminal-keyboard-shortcut/8.png)

## 실행하기

- 끝났다.
- 이제 어느 위치에서든 본인이 설정한 단축키를 누르면 실행이 된다.

## Note

`macOS Monterey 12.1` 버전일 때는 아래 상황이 발생했었다.
하지만 현재 (`macOS Ventura 13.4.1`) 는 아래 상황이 재현되지 않는 것으로 확인했다.

- 단, 허용해줬을 때...

![9.png](/images/posts/setup-mac-os-terminal-keyboard-shortcut/9.png)

- 모든 곳에서 허용하고 싶었는데, 그건 그거일때로 문제일꺼라...
- 당분간 사용하면서 틈틈히 허용해주면 어느 순간 허용도 끝나겠지?
- 사실 정말 편하다.
- 한글, 영어 상관없이 모두 실행 가능하다. 개꿀! 😎

### 그래도 알아서 허용해주고 싶은데 안돼?

- 아마 안되나 보다.
- 정책상 막힌 듯하다.
- 아래 글을 참고해보자.
- [https://stackoverflow.com/questions/32907909/allow-applescript-script-to-run-without-asking-for-permission](https://stackoverflow.com/questions/32907909/allow-applescript-script-to-run-without-asking-for-permission)

## References

- [https://hookrace.net/blog/macos-setup/](https://hookrace.net/blog/macos-setup/)
- [https://stackoverflow.com/questions/35954184/is-there-a-keyboard-shortcut-hotkey-to-open-terminal-in-macos/35954589#35954589](https://stackoverflow.com/questions/35954184/is-there-a-keyboard-shortcut-hotkey-to-open-terminal-in-macos/35954589#35954589)
- [https://stackoverflow.com/questions/32907909/allow-applescript-script-to-run-without-asking-for-permission](https://stackoverflow.com/questions/32907909/allow-applescript-script-to-run-without-asking-for-permission)
