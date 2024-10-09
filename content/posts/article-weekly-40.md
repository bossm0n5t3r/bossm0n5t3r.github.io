+++
date = 2024-10-10T02:00:00+09:00
title = "Article Weekly, Issue 40"
authors = ["Ji-Hoon Kim"]
tags = ["Article", "Weekly"]
categories = ["Article", "Weekly"]
series = ["Article Weekly"]
+++

## Period

`2024-09-29` ~ `2024-10-05`

## Hacking Kia: Remotely Controlling Cars With Just a License Plate

- 2024년 6월 11일, Kia 차량에서 번호판만으로 차의 주요 기능을 원격 제어할 수 있는 취약점을 발견함
- 공격자는 피해자의 이름, 전화번호, 이메일 주소, 물리적 주소 등의 개인 정보를 조용히 획득할 수 있음
- 이 취약점을 이용하여 공격자는 차주 모르게 자신을 차량의 보이지 않는 두번째 사용자로 추가할 수 있음
- 취약점 영향을 보여주기 위해 데모 도구를 제작했지만, 실제로 공개하거나 악용되지는 않음
  - 이 취약점은 이후 수정되었으며, 이 도구는 출시되지 않았고, 기아 팀은 이 취약점이 악의적으로 악용된 적이 없음을 확인했음
- Meta가 개발 과정에서 실수로 누군가 여러분의 페이스북 계정을 탈취할 수 있는 코드 변경을 할 수 있는 것처럼, 자동차 제조사들도 여러분 차량에 그런 취약점을 만들어낼 수 있음
- 앞으로도 자동차에선 취약점이 계속 발견될 것

## I am tired of AI

- AI 도구의 한계
  - 많은 AI 기반 테스트 자동화 도구가 더 나은 결과를 제공하지 않음
- AI 사용의 장단점
  - AI는 결과를 빠르게 생성할 수 있지만, 품질과 가치를 판단하는 것은 여전히 인간의 몫임
- AI에 지친 인간으로서의 경험
  - 인간의 창의성
    - 음악, 책, 영화 등 인간이 만든 작품이 주는 감동
  - AI 생성 콘텐츠의 한계
    - AI가 생성한 콘텐츠는 감동을 주지 못함
  - AI의 부정적 영향
    - 사람들은 AI가 일자리를 빼앗을까 두려워함
    - 기업들은 ROI를 보지 못하면서도 AI에 큰 돈을 투자함
    - AI의 탄소 발자국이 점점 더 심각해짐
  - 긍정적 사용 사례
    - 질병의 조기 발견 등 AI가 긍정적으로 사용되는 사례는 있음

## Too much efficiency makes everything worse: overfitting and the strong version of Goodhart's law

- 너무 높은 효율성은 모든 것을 악화시킴
  - 과적합과 강한 버전의 굿하트 법칙
- 효율성이 증가하면 역설적으로 결과가 나빠질 수 있음
  - 이는 거의 모든 곳에서 사실임
- 이 현상을 강한 버전의 굿하트 법칙이라고 부를 것임
- 과적합과 굿하트 법칙
- 과적합
  - 머신러닝에서 목표를 직접 맞출 수 없기 때문에 유사한 프록시를 사용하여 모델을 훈련함
  - 처음에는 프록시가 개선되면서 목표도 개선되지만, 최적화를 계속하면 프록시가 더 좋아져도 목표는 더 이상 개선되지 않음
  - 이를 과적합이라고 부름
- 굿하트 법칙
  - 측정이 목표가 되면 좋은 측정이 되지 않음
  - 이는 경제학뿐만 아니라 다양한 분야에 적용됨
- 강한 버전의 굿하트 법칙
  - 너무 효율적이 되면 우리가 신경 쓰는 것이 악화됨
- 과적합과 강한 버전의 굿하트 법칙을 완화하는 방법
  - 프록시 목표와 원하는 결과를 더 잘 맞추기
  - 정규화 페널티 추가
  - 시스템에 노이즈 주입
  - 조기 중단
  - 능력/용량 제한
  - 능력/용량 증가

## AI: Dystopia or Utopia?

- AI는 이전 기술 플랫폼들과 달리 인간 지능을 근본적으로 증폭하고 확장시킬 수 있는 잠재력을 가짐
- AI는 전례 없는 풍요의 미래를 약속하지만, 단기적으로는 일자리 상실 등 고통스러운 과도기가 있을 수 있음
- AI에 대한 비관론자들의 우려
  - 광범위한 실업과 경제적 불평등 심화
  - 사회 조작과 인간 주체성 상실
  - 창의성 감소와 AI에 의한 인류 멸종 위협
- 저자는 이러한 우려들이 대부분 근거가 없고 근시안적이며 오히려 해롭다고 주장
- AI의 진정한 위험은 "감정을 가진 AI"가 아니라 중국 같은 적대적 국가들이 AI 경쟁에서 승리하는 것
- AI의 잠재적 혜택
  - 거의 무료에 가까운 의료 서비스와 교육 제공
  - 환경 모니터링과 기후 변화 대응에 도움
  - 인간의 창의성과 능력 확장
  - 더 공정하고 투명한 거버넌스 구현
- AI 시대의 경제
  - 임금 압박과 디플레이션 가능성
  - GDP 같은 전통적 경제 지표의 한계
  - 보편적 기본소득(UBI) 등 새로운 정책 필요성
- 25년 후 소비자 유토피아 가능성
  - 주거, 에너지, 의료, 식품, 교통 등이 거의 무료로 제공되는 세상
  - 삶의 질 향상과 소비 평등화
- AI는 기회이자 도전이며, 우리가 어떻게 활용하고 규제하느냐에 따라 미래가 결정될 것
- 저자는 기술 낙관주의자로서, 신중하게 사용된다면 AI가 인류에게 이로울 것이라고 믿음

## Is Spring AI Strong Enough for AI?

- Spring AI의 개요와 강점
  - Spring 프레임워크는 AI/ML 전용 라이브러리는 없지만, AI 시스템 개발에 효과적인 플랫폼으로 활용 가능
  - Spring의 AI 개발 강점
    - 확장성: 마이크로서비스 지원으로 수평적 확장 용이
    - 프로덕션 준비성: 고성능 분산 애플리케이션 관리에 적합
    - 통합성: Python 기반 AI 프레임워크와 원활한 통합
    - 보안: Spring Security를 통한 포괄적인 보안 조치 제공
- Spring을 활용한 AI/ML 파이프라인
  - Spring Boot를 사용해 TensorFlow/PyTorch 모델을 RESTful API로 통합 가능
  - Spring Cloud Data Flow로 분산 ML 파이프라인 구축 가능:
    - 실시간 및 배치 처리 지원
    - 데이터 수집, 모델 적용, 결과 전달 등의 파이프라인 구성
- Spring Boot를 이용한 AI 마이크로서비스 구축
  - Spring Boot로 PyTorch 모델을 REST API로 배포하는 방법 제시
- Spring을 활용한 AI 모델 버전 관리 및 모니터링
  - Spring Boot로 여러 모델 버전 관리 가능
  - Spring Actuator를 사용해 AI 모델 성능 실시간 모니터링 가능
- AI 애플리케이션의 보안
  - Spring Security를 활용한 AI API 보안 방법 제시
- Spring vs 다른 AI 특화 프레임워크 비교
  - TensorFlow Serving, Kubernetes, MLflow 등과 비교하여 각각의 장단점 분석
  - 사용 사례에 따른 적합한 프레임워크 선택 가이드 제공
- 결론
  - Spring은 엔터프라이즈급 AI 배포에 강점
  - AI 특화 작업에는 전문 프레임워크가 유리할 수 있음
  - 하이브리드 접근 방식(Spring + AI 특화 도구)이 효과적일 수 있음

## Why TCP needs 3 handshakes

- TCP의 기본 지식
  - TCP 패킷 헤더의 주요 제어 비트:
    - SYN: 연결 설정 요청
    - ACK: 데이터 수신 확인
    - FIN: 연결 종료 요청
    - RST: 비정상적 연결 종료
    - PSH: 즉시 데이터 처리 요청
    - URG: 긴급 데이터 표시
  - 시퀀스 번호(Seq)와 확인 응답 번호(ACK):
    - Seq: 각 데이터 세그먼트의 순서 번호
    - ACK: 수신 확인 번호, 다음 예상 Seq 번호
- TCP 3-way 핸드셰이크 과정
  - 과정:
    1. 클라이언트: SYN 전송 (Seq = x)
    2. 서버: SYN-ACK 응답 (Seq = y, ACK = x+1)
    3. 클라이언트: ACK 전송 (ACK = y+1)
  - 연결 상태 변화:
    - 클라이언트: CLOSED → SYN-SENT → ESTABLISHED
    - 서버: LISTEN → SYN-RECEIVED → ESTABLISHED
- 3-way 핸드셰이크의 필요성
  - 1-way 핸드셰이크의 문제점:
    - 상대방의 존재 확인 불가
    - 송수신 기능 정상 작동 확인 불가
  - 2-way 핸드셰이크의 문제점:
    - 수신자의 송신 기능 확인 불가
    - 송신자의 수신 기능 확인 불가
    - 지연된 패킷으로 인한 잘못된 연결 설정 가능성
  - 3-way 핸드셰이크의 장점:
    - 양방향 통신 기능 확인
    - 초기 시퀀스 번호(ISN) 교환 및 확인
    - 오래된 연결 요청 구분 가능
- 결론
  - TCP 3-way 핸드셰이크는 "기본적으로 사용 가능한" 연결 보장
  - 양방향 송수신 기능 정상 작동 확인
  - 소프트웨어 공학에서의 "트레이드오프" 예시

## OpenAI and Anthropic Revenue Breakdown

- 해당 아티클은 OpenAI와 Anthropic의 재무 상황을 비교 분석
- OpenAI 재무 현황
  - 2024년 8월 기준 연간 매출 약 36억 달러, 2024년 말 예상 매출 50-52억 달러
  - 2024년 말 예상 매출 구성:
    - ChatGPT 구독: 27억 달러 (73%)
    - API: 10억 달러 (27%)
  - 2024년 예상 손실: 약 50억 달러
- Anthropic 재무 현황
  - 2024년 말 예상 연간 매출 10억 달러
  - 매출 구성:
    - 제3자 API (Amazon 등): 60-75%
    - 직접 API: 10-25%
    - Claude 챗봇 구독: 15%
    - 전문 서비스: 2%
  - 2024년 예상 손실: 약 20억 달러
- 주요 관찰 사항
  - OpenAI의 매출 규모가 Anthropic의 약 5배
  - ChatGPT가 소비자 시장에서 압도적 우위 (Claude 대비 18배 매출)
  - API 시장에서는 두 회사 간 경쟁이 더 치열 (OpenAI가 50-100% 정도 앞섬)
  - 제3자 플랫폼을 통한 유통의 중요성 (Anthropic의 AWS 파트너십)
  - 두 회사 모두 막대한 자본 요구 지속
  - 수익성 개선을 위한 전략:
    - 추론 비용 감소
    - 구독료 인상
    - 훈련 시간 대비 추론 시간 컴퓨팅 비중 증가
  - 이 분석은 두 AI 기업의 재무 상황과 시장 전략을 비교하며, 향후 AI 산업의 발전 방향을 시사

## It's all just text

- 텍스트의 중요성
  - 텍스트는 모든 것의 기초: 모든 정보와 데이터는 궁극적으로 텍스트로 표현됨
  - 기계 학습과 자연어 처리(NLP):
    - 텍스트는 AI 모델 훈련의 핵심 요소
    - 기계가 이해할 수 있는 형식으로 변환 필요
- 텍스트 처리 기술
  - 토큰화: 텍스트를 작은 단위로 분할하여 분석 가능하게 함
  - 임베딩: 단어를 벡터로 변환하여 기계가 의미를 이해하도록 도움
  - 문맥 이해: 문맥 기반의 의미 파악을 위한 기술 발전
- 텍스트 기반 애플리케이션
  - 챗봇 및 가상 비서: 사용자와의 상호작용을 위한 텍스트 기반 시스템
  - 콘텐츠 생성: AI를 통한 자동화된 글쓰기 및 콘텐츠 제작
- 결론
  - 텍스트는 디지털 세계의 중심: 모든 기술과 애플리케이션은 텍스트에 의존하며, 이는 앞으로도 계속될 것

## References

- https://samcurry.net/hacking-kia
- https://www.ontestautomation.com/i-am-tired-of-ai/
- https://sohl-dickstein.github.io/2022/11/06/strong-Goodhart.html
- https://www.khoslaventures.com/ai-dystopia-or-utopia/
- https://dzone.com/articles/is-spring-ai-strong-enough-for-ai
- https://www.pixelstech.net/article/1727412048-Why-TCP-needs-3-handshakes
- https://www.tanayj.com/p/openai-and-anthropic-revenue-breakdown
- https://stitcher.io/blog/its-all-just-text
  - https://www.youtube.com/watch?v=gd5uJ7Nlvvo
