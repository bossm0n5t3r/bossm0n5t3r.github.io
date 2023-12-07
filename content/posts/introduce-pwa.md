+++
date = 2023-10-18T01:30:00+09:00
title = "PWA 소개하기"
authors = ["Ji-Hoon Kim"]
tags = ["PWA"]
categories = ["PWA"]
+++

## 개요

|      | 오늘 배울 내용                           |
|------|------------------------------------|
| 정의   | Progressive Web App (PWA) 이란 무엇인가? |
| 차별점  | 기존 웹과 플랫폼에 특화된 앱들과 비교했을 때 어떤가?     |
| 적용점  | 실제 개발시 PWA 의 장점은 무엇인가?             |
| 경험   | 좋은 PWA 의 특징은 무엇인가?                 |
| 연습문제 | Sample PWA 를 설치하고 탐색해보기            |

## Progressive Web App (PWA) 이란 무엇인가?

PWA(Progressive Web App)는 사용 가능한 기능을 기반으로 모든 장치에서 가능한 최상의 경험을 제공하도록 하기 위해 개방형 웹 기술을 사용하여 점진적으로 향상되는 전통적인 웹 앱

즉, 최신 브라우저 및 최신 기기의 사용자는 해당 플랫폼의 플랫폼별(설치된) 앱에 필적하는 향상된 경험을 얻을 수 있지만, 이전 브라우저 또는 기기의 사용자는 익숙한 웹 사이트 형태로 사용 가능한 경험을 계속 얻을
수 있다.

이를 통해 PWA는 웹 사이트 경험의 도달 범위(광범위한 가용성 및 액세스)와 플랫폼별 경험의 기능(하드웨어 기능 및 풍부한 리소스)을 결합할 수 있다.

먼저 점진적인 향상에 대해 알아보자.

### ****Progressive Enhancement (점진적 강화) 이란 무엇인가?****

[Understanding Progressive Enhancement](https://alistapart.com/article/understandingprogressiveenhancement/)

점진적 향상(progressive enhancement)은 개발자가 콘텐츠 우선의 경험을 강조하는 디자인 철학

- 사용자가 기존 브라우저를 사용하는 사용자라도 어떤 장치에서든 핵심 콘텐츠를 소비할 수 있도록 기본 경험이 있는지 확인
- 더 새로운 기능(예: 최신 브라우저, 더 새로운 장치)의 존재를 감지하고 이 기능을 사용하기 위해 해당 장치에 대한 경험을 향상

![progressive.png](/images/posts/introduce-pwa/progressive.png)

오늘날 사용자들은 앱을 떠올릴 때 플랫폼이 설치된 앱(파란색) 또는 브라우저 기반의 "웹" 앱(노란색)을 떠올립니다. 여기서 브라우저는 기기 플랫폼에 플랫폼별 앱으로 설치된다.

- 플랫폼별 앱은 해당 기기 플랫폼에서만 작동
  - 플랫폼 당 하나의 코드베이스가 필요하고, (도구, 언어에 익숙한) 전문 개발자 팀이 필요하지만, 모든 플랫폼 기능에 액세스 가능
- 웹 앱은 하나의 코드베이스로 모든 곳에서 작동
  - 하나의 코드베이스를 사용하여 브라우저 및 브라우저가 실행하는 모든 장치에서 실행 가능
  - 그러나 이는 모든 곳에서 지원되지 않을 수 있는 플랫폼 고유 기능을 사용하는 것을 제한

Progressive Web Apps는 Service Workers, HTTPS, Web App Manifest, Push Notifications 및 기타 웹 API 및 기능과 같은 개방형 웹 기술을 활용하여
플랫폼에서 사용 가능한 기능에 맞게 경험을 감지하고 조정

- 새로운 것이 감지되지 않는 오래된 장치와 브라우저
  - 기본적인 웹 사이트 환경을 제공
- • 최신 장치에서는
  - 장치 폼 팩터를 감지하고 플랫폼별 동작에 맞는 반응형 환경을 제공
- 최신 브라우저에서는
  - 서비스 워커 및 웹 앱 매니페스트에 대한 지원을 감지
  - 플랫폼별 앱과 마찬가지로 설치 가능성 및 오프라인 운영과 같은 기능을 잠금 해제하고 지원할 수 있다.

플랫폼이 발전하고 더 많은 플랫폼이 오른쪽(기능 지원 측면에서)으로 이동함에 따라 PWA 개발은 가장 광범위한 장치에서 확장 가능한 경험을 제공하는 데 핵심이 될 것

## 기존 웹과 플랫폼에 특화된 앱들과 비교했을 때 어떤가?

PWA는 이러한 개방형 웹 기술에 대한 각 브라우저 및 OS의 증가하는 지원을 기반으로 개선되는 견고한 기본 환경을 제공함으로써 두 세계의 장점을 모두 얻을 수 있는 능력을 갖추고 있다.

다음은 몇 가지 이점이다.

- 웹사이트의 도달 범위를 가지고 있다.
  - = 웹사이트가 할 수 있는 것을 모두 할 수 있다.
  - 검색 엔진으로 색인을 생성하고, URL로 검색하거나 공유할 수 있으며, 브라우저가 있는 모든 장치에서 사용할 수 있다.
- 플랫폼별 앱처럼 작동할 수 있다.
  - 오프라인으로 작업하고, 장치에 설치하고, 푸시 알림을 처리하고, 풍부한 장치 하드웨어에 액세스할 수 있다.
- 풍부한 플랫폼 기능을 사용할 수 있다.
  - Windows에서는 PWA를 시작 메뉴에 추가하고, 작업 표시줄에 고정하고, 다른 앱에 대한 공유 대상을 제공하고, 다른 Windows 앱과 함께 Microsoft Store에 게시할 수 있다.
- 비용을 절감할 수 있다.
  - PWA는 하나의 코드베이스에서 모든 플랫폼용으로 개발된다. 이는 유지 관리 비용을 절감할 뿐만 아니라 동일한 경험을 제공하기 위해 단일 개발 팀과 여러 플랫폼별 팀이 필요하다.

## 좋은 PWA 의 특징은 무엇인가?

먼저 예시를 보자.

- demo: https://devtoolstips.org/
- source: https://github.com/captainbrosset/devtools-tips

![devtools.png](/images/posts/introduce-pwa/devtools.png)

이것이 좋은 PWA 경험이 되는 이유는 무엇일까?

PWA는 디자인 철학을 기반으로 하기 때문에 규정적인 규칙은 없으며 기존 플랫폼별 및 웹 앱과 비교 가능한 경험을 유리하게
만드는[바람직한 특성만 있다.](https://aka.ms/learn-PWA/30Days-1.1/docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/#characteristics-of-a-progressive-web-app-pwa)

| 특성       | 이것이 바람직한 이유는 무엇입니까?                                        |
|----------|------------------------------------------------------------|
| 발견 가능성   | 앱 스토어나 웹 검색을 통해 PWA를 찾을 수 있다.                              |
| 설치성      | 플랫폼별 앱처럼 내 장치 홈 화면에 PWA를 추가하고 실행할 수 있다.                    |
| 재참여 가능성  | 플랫폼별 앱과 마찬가지로 푸시 알림 알림을 받을 수 있다. (PWA를 적극적으로 사용하지 않는 경우에도) |
| 네트워크 독립성 | 플랫폼별 앱처럼 사용 가능한 PWA 경험을 얻을 수 있다.                           |
| 점진적인 향상  | 내 PWA 경험은 장치 기능에 따라 확장(플랫폼별 앱 등) 또는 축소(웹 사이트 등)된다.         |
| 안전한      | 내 PWA는 개인정보 보호 장치가 갖춰진 보안 네트워크 통신을 사용한다.                   |
| 반응형      | 내 PWA는 장치 화면 크기, 방향 및 입력 형식에 맞게 조정된다.                      |
| 연결성      | 다른 웹사이트와 마찬가지로 PWA URL에 연결하고, 공유하고, 북마크하고, 방문할 수 있다.       |

샘플 PWA를 사용하여 특성을 살펴보자

- 웹 검색결과에서 찾을 수 있는가?
- 앱 스토어에서 찾을 수 있는가? (예시:**[웹보드](https://aka.ms/learn-PWA/30Days-1.1/www.microsoft.com/en-us/p/webboard/9p53q9bf3mv6)**)
- 오프라인일 때 액세스할 수 있는가(예시: 비행 모드)?
- HTTPS를 통해 제공되는가?
- 화면 크기(모바일과 데스크톱)에 맞춰 조정되는가?

## References

- [30 Days of PWA - Learning Series about Progressive Web Apps](https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/core-concepts/01)
- [Understanding Progressive Enhancement](https://alistapart.com/article/understandingprogressiveenhancement/)
- [PWA Stats](https://www.pwastats.com/)

### demos

- [Progressive Web App demos - Microsoft Edge Development](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/demo-pwas)
