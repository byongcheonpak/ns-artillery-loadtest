Artillery & Playwright 기반 E2E 부하 테스트 자동화 요구사항
1. 프로젝트 개요
목표: 사용자의 실제 서비스 이용 흐름을 시뮬레이션하는 End-to-End (E2E) 시나리오 기반의 부하 테스트 환경을 구축하고, CI/CD 파이프라인에 통합하여 자동화합니다.

핵심 기술:

부하 테스트 도구: Artillery

브라우저 자동화 엔진: Playwright

테스트 실행 환경:

로컬/단일 인스턴스 (artillery run)

서버리스 분산 환경 (AWS Lambda)

컨테이너 분산 환경 (AWS Fargate)

CI/CD 플랫폼: AWS CodeBuild

2. 사용자 시나리오 정의 (flow.js)
Playwright 엔진을 사용하여 다음의 사용자 흐름을 자동화하는 flow.js 스크립트를 작성합니다. 각 페이지에서는 DOM이 완전히 렌더링되고 상호작용이 가능한 상태가 될 때까지 대기해야 합니다.

단계	페이지 명	URL	수행 액션
1	홈	https://nsm-stg-mfo.nsmall.com/store/atypical/home	1. 페이지 접속<br>2. 5초 대기 (page.waitForTimeout(5000))<br>3. 상품 상세 페이지로 이동 
2	상품 상세	https://nsm-stg-mfo.nsmall.com/goods/32914563	1. 페이지 접속<br>2. 5초 대기<br>3. 이벤트 페이지로 이동 
3	이벤트	https://nsm-stg-mfo.nsmall.com/store/atypical/benefit-coupon	1. 페이지 접속<br>2. 5초 대기<br>3. 로그인 페이지로 이동 
4	로그인	https://nsm-stg-mfo.nsmall.com/customer/login	1. 페이지 접속<br>2. users.csv 파일에서 ID, PW를 하나씩 할당받아 입력<br>3. 로그인 버튼 클릭<br>4. (분기 처리) 로그인 성공 시 이벤트 페이지 URL로 이동하는지 확인, 실패 시 현재 URL이 로그인 페이지인지 확인

Sheets로 내보내기
로그인 계정 정보 (users.csv)
테스트 시나리오에 사용할 계정 정보는 아래와 같이 CSV 파일로 관리합니다.

파일명: users.csv

파일 내용:

코드 스니펫

email,password
num11@naver.com,1q2w3e4r
stg-test2@nsmall.com,nsmall!@
3. Artillery 테스트 구성 (script.yml)
Artillery 테스트의 전반적인 설정을 정의하는 script.yml 파일을 작성합니다.

config 섹션:

target: 시나리오의 시작 URL인 홈 페이지로 설정합니다.

processor: ./flow.js 파일을 지정하여 Playwright 스크립트를 참조하도록 설정합니다.

payload:

path: ./users.csv 파일을 지정합니다.

fields: email, password 필드를 정의합니다.

engines: playwright 엔진을 사용하도록 명시하고, launchOptions에서 headless: true로 설정하여 UI 없이 실행되도록 합니다.

scenarios 섹션:

engine: playwright로 지정합니다.

flow: flow.js에서 module.exports로 내보낸 시나리오 함수(예: userJourney)를 호출합니다.

phases (부하 프로필):

초기 테스트 및 디버깅을 위해 낮은 부하로 시작합니다.

점진적으로 부하를 높이는 Ramp-up 구조로 설계합니다.

예시:

YAML

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
4. 테스트 실행 환경 요구사항
4.1. 공통 의존성 패키지
package.json에 다음 패키지들을 포함하여 npm install로 설치합니다.

artillery

artillery-engine-playwright

playwright

4.2. 실행 방식별 명령어
로컬 실행: Playwright 브라우저 바이너리를 설치(npx playwright install)한 후, 다음 명령어로 실행합니다.

Bash

artillery run script.yml
AWS Lambda 분산 테스트:

serverless.yml 또는 관련 AWS Lambda 설정을 구성해야 합니다.

실행 명령어:

Bash

artillery run-lambda script.yml
AWS Fargate 분산 테스트:

Fargate 클러스터 및 작업 정의가 필요합니다.

실행 명령어:

Bash

artillery run-fargate script.yml
5. CI/CD 자동화 (AWS CodeBuild)
5.1. buildspec.yml 파일 구성
GitHub 리포지토리의 루트에 buildspec.yml 파일을 생성합니다.

YAML

version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      # Artillery 및 Playwright 엔진 설치
      - npm install -g artillery artillery-engine-playwright
      # Playwright 브라우저 바이너리 설치
      - npx playwright install --with-deps
  build:
    commands:
      # 테스트 실행 (필요에 따라 run, run-lambda, run-fargate 선택)
      - echo "Starting Artillery load test..."
      - artillery run script.yml --output report.json
  post_build:
    commands:
      - echo "Build completed on `date`"

artifacts:
  files:
    # 테스트 결과 리포트 아티팩트 저장
    - "report.json"
    - "report.html" # artillery report 명령으로 생성 시
5.2. CodeBuild 프로젝트 설정
소스: GitHub 리포지토리의 특정 브랜치(예: develop, main)에 PUSH 이벤트가 발생할 때 빌드를 시작하도록 웹훅을 설정합니다.

환경: Node.js 18 이상을 지원하는 AWS 관리형 이미지를 사용합니다.

IAM 서비스 역할 권한:

CloudWatch: logs:CreateLogGroup, logs:CreateLogStream, logs:PutLogEvents 권한을 포함하여 테스트 실행 로그를 기록할 수 있어야 합니다.

S3: s3:PutObject 권한을 포함하여 지정된 버킷에 테스트 결과 리포트(아티팩트)를 업로드할 수 있어야 합니다.

(분산 테스트 시): Lambda 호출 또는 Fargate 작업 실행에 필요한 추가적인 IAM 권한이 필요합니다.

5.3. 결과물
CloudWatch Logs: 모든 테스트 실행 과정의 로그가 기록되어야 합니다.

S3 Artifacts: buildspec.yml에 정의된 테스트 결과 리포트 파일(report.json 등)이 빌드 완료 후 지정된 S3 버킷에 저장되어야 합니다.