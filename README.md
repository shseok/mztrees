# Mztrees

안녕하세요. 지역 축제, 지역 농산물 가격 추이 등 관련 이슈를 지역 사람과 외부 사람 모두가 확인하고 공유할 수 있는 웹사이트입니다.

[URL](https://www.mztrees.com)

![](https://img.mztrees.com/og-image.png)

지역사회의 활성화를 위해 트렌디한 지역 이슈를 한 곳에서 확인할 수 있는 서비스 경험을 제공하고자 합니다.

현재 반응형 레이아웃을 적용하였고 다음 스텝으로 모바일 앱 배포를 준비하고 있습니다.

버그 발견시 [제보](https://github.com/shseok/mztrees/issues)해주시면 검토 후 빠른 대응하겠습니다. 감사합니다.

## Spec

### Frontend

- React
- NextJS
- Typescript
- Scss
- Tanstack Query
- Zustand

### Backend

- NodeJS
- Fastify
- Typescript
- Prisma
- PostgreSQL
- Swagger
- Typebox
- Algolia

### Infrastructure

- Terraform
- AWS
  - ESR / ECS
  - EC2

## How to run (local)

- [Frontend](packages/mz-client/README.md)
- [Backend](packages/mz-server/README.md)

## File structure

- infrastructure
  - backend-app (ECS/ECR)
  - postgresql (EC2)
- packages
  - mz-server
  - mz-web(web / mobile)
  - mz-mobile 🏃‍♀️

# Plan

- 지역별 카테고리 추가 후 분류
- 모바일 버전 출시
