# Mztrees ![License](https://img.shields.io/badge/license-MIT-blue)

[ENGLISH](/README.md) | [한국어](/README-ko.md)

안녕하세요. Mztrees는 개성있거나 유용한 사이트를 누구나 공유하고 확인할 수 있는 웹 사이트입니다.

[URL](https://www.mztrees.com)

![](https://img.mztrees.com/og-image.png)

광활한 인터넷에 흩어져있는 트렌디하거나 유용한 사이트를 공유하고 피드백을 주고 받으며 정보의 다양성을 제공하고자 합니다.

현재 반응형 레이아웃을 적용했기때문에, 모바일에서도 사이트에 접속하여 서비스를 경험할 수 있습니다.

다음 스텝으로 모바일 앱 배포를 준비하고 있습니다.

- 프로젝트에 기여를 원하신다면 [Discussions](https://github.com/shseok/mztrees/discussions/categories/announcements)를 이용해주세요.

- 버그 발견시 [제보](https://github.com/shseok/mztrees/issues)해주시면 검토 후 빠른 대응하겠습니다.

감사합니다.

## 기술 스택

### Frontend ![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=mz-tau)

- React
- NextJS
- Typescript
- Scss
- Tanstack Query
- Zustand

### Backend ![example workflow](https://github.com/shseok/mztrees/actions/workflows/deploy.yml/badge.svg) ![example workflow](https://github.com/shseok/mztrees/actions/workflows/deploy-worker.yml/badge.svg)

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

## How to run

- [Frontend](packages/mz-client/README-ko.md)
- [Backend](packages/mz-server/README-ko.md)

## File structure

- infrastructure
  - backend-app (ECS/ECR)
  - postgresql (EC2)
- packages
  - mz-server
  - mz-web(responsive)
  - mz-mobile 🏃‍♀️

# Plan

- 모바일 버전 출시 (RN)
