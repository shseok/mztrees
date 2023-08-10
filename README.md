# Mztrees

[English](/README.md) | [한국어](/README-ko.md)

![example workflow](https://github.com/shseok/mztrees/actions/workflows/deploy.yml/badge.svg)

Mztrees is a website where both locals and outsiders can check and share related issues such as local festivals and price trends of local agricultural products.

[URL](https://www.mztrees.com)

![](https://img.mztrees.com/og-image.png)

To revitalize the local community, we want to provide a service experience where you can check trendy local issues in one place.

We have applied a responsive layout and are preparing for mobile app distribution as the next step.

If you find a bug, please [report](https://github.com/shseok/mztrees/issues) it and we will respond quickly after review. thank you!

## Tech Stack

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

- After adding categories by region, sort them
- Mobile version release
