# NSmall Artillery & Playwright Load Testing

Artillery와 Playwright를 사용한 NSmall 서비스의 부하 테스트 자동화 프로젝트입니다.

## 📋 프로젝트 개요

사용자의 실제 서비스 이용 흐름을 시뮬레이션하는 E2E 시나리오 기반 부하 테스트 환경을 구축하고, CI/CD 파이프라인에 통합하여 자동화합니다.

### 🛠️ 기술 스택
- **부하 테스트 도구**: Artillery
- **브라우저 자동화 엔진**: Playwright  
- **실행 환경**: 로컬, AWS Lambda, AWS Fargate
- **CI/CD 플랫폼**: AWS CodeBuild

## 🚀 시작하기

### 1. 의존성 설치

```bash
# 프로젝트 의존성 설치
npm install

# Playwright 브라우저 바이너리 설치
npm run install:browsers
```

### 2. 테스트 실행

#### 로컬 실행
```bash
# 기본 테스트 실행
npm test

# 결과 리포트 포함 실행
npm run dev
```

#### 분산 실행
```bash
# AWS Lambda 분산 테스트
npm run test:lambda

# AWS Fargate 분산 테스트  
npm run test:fargate
```

## 📁 프로젝트 구조

```
ns-artillery-loadtest/
├── script.yml          # Artillery 메인 설정 파일
├── flow.js             # Playwright 사용자 시나리오 스크립트
├── users.csv           # 테스트용 로그인 계정 정보
├── buildspec.yml       # AWS CodeBuild 빌드 스펙
├── package.json        # 프로젝트 의존성 및 스크립트
└── README.md          # 프로젝트 문서
```

## 🎯 테스트 시나리오

4단계 사용자 여정을 시뮬레이션합니다:

1. **홈페이지** → 상품 상세 페이지 이동
2. **상품 상세** → 이벤트 페이지 이동  
3. **이벤트 페이지** → 로그인 페이지 이동
4. **로그인 처리** → 성공/실패 분기 처리

각 단계마다 5초 대기 시간이 포함되어 실제 사용자 행동을 시뮬레이션합니다.

## 📊 부하 테스트 프로필

```yaml
phases:
  - duration: 60
    arrivalRate: 1
    name: "Warm up the system"
  - duration: 120  
    arrivalRate: 1
    rampTo: 5
    name: "Ramp up to 5 users per second"
  - duration: 300
    arrivalRate: 5
    name: "Sustain 5 users per second"
```

## 🔧 설정

### 환경별 실행
- **개발/로컬**: `npm test`
- **스테이징**: AWS Lambda/Fargate 분산 실행
- **CI/CD**: AWS CodeBuild 자동 실행

### 계정 정보
테스트용 로그인 계정은 `users.csv` 파일에서 관리됩니다:


## 📈 결과 분석

### 메트릭
- **Web Vitals**: LCP, FCP, CLS 등 브라우저 성능 지표
- **사용자 여정**: 각 단계별 성공/실패 카운터
- **로그인 성공률**: 계정별 로그인 성공/실패 통계

### 리포트
- JSON 형식: `reports/report.json`
- HTML 형식: `reports/report.html`

## 🔄 CI/CD 통합

AWS CodeBuild를 통한 자동화:
- GitHub 푸시 이벤트 트리거
- Node.js 18 환경에서 실행
- 테스트 결과 S3 아티팩트 저장
- CloudWatch 로그 기록

## 🚨 주의사항

1. **브라우저 바이너리**: 최초 실행 전 `npm run install:browsers` 필수
2. **네트워크 타임아웃**: 느린 네트워크 환경에서는 타임아웃 설정 조정 필요
3. **계정 관리**: 테스트 계정의 유효성 정기 확인 필요
4. **분산 실행**: AWS 리소스 사용량 모니터링 권장

## 📞 문의

테스트 설정이나 결과 해석에 대한 문의사항은 개발팀으로 연락주세요.
