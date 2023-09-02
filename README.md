# Mztrees ![License](https://img.shields.io/badge/license-MIT-blue)

[English](/README.md) | [한국어](/README-ko.md)

Mztrees is a website where anyone can share and check out unique or useful sites.

[URL](https://www.mztrees.com)

![](https://img.mztrees.com/og-image.png)

We want to share trendy or useful sites scattered across the vast Internet, exchange feedback, and provide diversity of information.

Since we have currently applied a responsive layout, you can access the site and experience the service on mobile devices.

- If you would like to contribute to the project, please use [Discussions](https://github.com/shseok/mztrees/discussions/categories/announcements).

- If you find a bug, please [Report](https://github.com/shseok/mztrees/issues) and we will review it and respond quickly.

## Tech Stack

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

- [Frontend](packages/mz-client/README.md)
- [Backend](packages/mz-server/README.md)

## File structure

- infrastructure
  - backend-app (ECS/ECR)
  - postgresql (EC2)
- packages
  - mz-server
  - mz-web(responsive)
  - mz-mobile 🏃‍♀️

# Plan

- Mobile version release(RN)
