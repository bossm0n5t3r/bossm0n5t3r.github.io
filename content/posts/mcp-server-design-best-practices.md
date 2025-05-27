+++
date = 2025-05-28T01:45:00+09:00
title = "[Microsoft Build 2025] MCP 서버 설계의 올바른 접근법"
authors = ["Ji-Hoon Kim"]
tags = ["mcp", "mcp-server", "design", "mcp-server-design", "best-practices"]
categories = ["mcp", "mcp-server", "design", "mcp-server-design", "best-practices"]
+++

## Your API is not an MCP

- Microsoft Build 2025에서 David Gomes가 발표한 세션 "Your API is not an MCP"는 현재 AI 개발 생태계에서 중요한 메시지를 전달한다.
- 많은 기업들이 MCP(Model Context Protocol) 열풍에 편승하여 기존 API를 자동으로 MCP 서버로 변환하고 있지만, 이는 근본적으로 잘못된 접근 방식이라는 것

## MCP란 무엇인가?

- MCP(Model Context Protocol)는 LLM(대규모 언어 모델)이 외부 도구 및 데이터 소스와 상호작용하는 방식을 표준화한 개방형 프로토콜
- USB-C 포트가 여러 기기를 하나의 표준으로 연결하듯이, MCP는 AI 시스템이 다양한 도구 및 데이터 소스와 연결하는 방식을 단일화

### MCP의 핵심 특징

MCP는 다음과 같은 주요 구성 요소로 이루어져 있다.

- **도구(Tools)**: AI 모델이 호출할 수 있는 함수들
- **전송 계층(Transport Layer)**: AI 모델과 서버 간의 통신 메커니즘
- **세션 관리(Session Management)**: 여러 상호작용에 걸친 대화 상태 추적
- **인증(Authentication)**: 도구에 대한 접근 확인 및 권한 부여

## 기존 API와 MCP의 차이점

### 설계 목적의 차이

- 기존의 REST API는 인간 개발자가 사용하도록 설계되었다.
- 반면 MCP는 처음부터 LLM이 소비하도록 특별히 설계되었다.
- 이러한 근본적인 차이로 인해 다음과 같은 구별되는 특성들이 나타난다.

**동적 발견(Dynamic Discovery)**

- MCP 클라이언트는 서버에게 "무엇을 할 수 있나요?"라고 질문할 수 있다.
- 서버는 사용 가능한 모든 기능과 데이터에 대한 설명을 반환한다.
- AI 에이전트는 사용 가능한 기능에 따라 자동으로 적응할 수 있다.

**표준화된 인터페이스**

- 모든 MCP 서버는 서비스나 데이터에 관계없이 동일한 프로토콜을 사용한다.
- 기존 API는 각각 고유한 엔드포인트, 매개변수 형식, 인증 방식을 가진다.
- 하나의 MCP 클라이언트로 여러 MCP 서버와 상호작용할 수 있다.

### 실시간 통신과 양방향 통신

MCP는 실시간 통신을 지원하며, AI 모델이 데이터를 가져오는 것뿐만 아니라 작업을 수행할 수도 있다.

예를 들어:

- **데이터 가져오기**: AI 모델이 서버에서 일정 정보를 검색
- **작업 수행**: AI 모델이 서버에 회의 일정 변경이나 이메일 전송 명령을 내림

## 왜 단순한 API 변환은 문제인가?

David Gomes의 발표에서 강조된 핵심 메시지는 많은 기업들이 기존 API를 단순히 MCP 서버로 자동 변환하는 것은 올바른 접근이 아니라는 것이다.

그 이유는 다음과 같다:

### 1. 설계 철학의 차이

- 기존 API는 인간 개발자의 이해와 사용을 전제로 설계됨
- MCP는 LLM의 추론 능력과 한계를 고려하여 설계되어야 함

### 2. 컨텍스트 제공 방식

- LLM은 인간과 다른 방식으로 정보를 처리하고 이해함
- MCP 서버는 LLM이 효율적으로 사용할 수 있는 형태로 정보를 제공해야 함

### 3. 에러 처리와 피드백

- LLM은 인간과 다른 방식으로 오류를 인식하고 처리함
- MCP 서버는 LLM이 이해할 수 있는 명확한 피드백을 제공해야 함

## 올바른 MCP 서버 설계

### 세션 관리의 중요성

- MCP 서버에서 세션 관리는 LLM 애플리케이션과 서버 간의 대화를 여러 요청에 걸쳐 추적하는 것을 의미
- 효과적인 세션 관리를 위해서는:

```jsx
const transports = {}; // 세션 ID별로 전송 인스턴스 저장

app.post('/mcp', async (req, res) => {
  const isInitRequest = req.body && req.body.method === 'initialize';

  if (isInitRequest) {
    const sessionId = uuidv4();
    const transport = new StreamableHTTPServerTransport();
    transport.sessionId = sessionId;
    transports[sessionId] = transport;
    res.setHeader('Mcp-Session-Id', sessionId);
  }
  // ... 나머지 처리
});
```

### 인증과 보안

프로덕션 환경에서는 OAuth 2.1 with PKCE를 사용한 적절한 인증이 필요하다.

이는 다음과 같은 단계로 구성된다:

1. **초기 도구 요청**: LLM 애플리케이션이 서버 접근 시도
2. **인증 챌린지**: 서버가 "401 Unauthorized" 응답
3. **OAuth 발견**: LLM 애플리케이션이 권한 서버 정보 획득
4. **사용자 로그인 리디렉션**: 사용자를 로그인 페이지로 안내
5. **토큰 교환**: 인증 코드를 액세스 토큰으로 교환
6. **인증된 도구 접근**: 토큰을 사용한 권한 있는 요청

## 실제 활용 사례

### 개발 환경에서의 활용

Neon의 MCP 서버는 자연어로 PostgreSQL 데이터베이스와 상호작용할 수 있게 해준다. 예를 들어:

```text
"my-database"라는 새로운 Postgres 데이터베이스를 만들고,
id, name, email, password 컬럼을 가진 users 테이블을 생성해주세요.
```

### AI 에이전트 통합

AI 에이전트는 MCP를 통해 다양한 시스템과 통합될 수 있다:

- **CRM 시스템**: 고객 데이터 접근으로 개인화된 상호작용
- **ERP 시스템**: 재고, 급여, 재무 등 내부 비즈니스 기능 관리
- **마케팅 플랫폼**: 실시간 광고 타겟팅 조정이나 개인화된 오퍼 전송
- **IoT 디바이스**: 센서 데이터를 실시간으로 처리하고 대응

## 결론: MCP의 미래

- MCP는 단순히 새로운 기술이 아니라, AI 생태계에 맞게 기존 아이디어를 잘 적용한 것
- 하지만 이것이 MCP의 가치를 떨어뜨리지는 않는다.
- 오히려 성숙한 단계에서 당연히 나와야 할 표준이 등장한 것으로 볼 수 있다.
- 중요한 것은 MCP를 도입할 때 단순히 기존 API를 변환하는 것이 아니라, LLM의 특성과 요구사항을 깊이 이해하고 이에 맞는 설계를 하는 것
- David Gomes의 메시지처럼, "당신의 API는 MCP가 아닙니다"라는 관점에서 접근해야 진정한 AI-first 아키텍처를 구축할 수 있을 것이다.
- MCP의 성공적인 도입을 위해서는 기술적 구현뿐만 아니라 보안, 확장성, 모니터링 등의 운영 측면도 함께 고려해야 한다.
- 이를 통해 AI 에이전트가 진정으로 유용한 업무 파트너가 될 수 있는 기반을 마련할 수 있을 것이다.

## References

- https://www.youtube.com/watch?v=eeOANluSqAE
- https://simplescraper.io/blog/how-to-mcp
- https://github.com/neondatabase-labs/mcp-server-neon
