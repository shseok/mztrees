# MZ

안녕하세요. 지역 축제, 지역 농산물 가격 추이 등 관련 이슈를 지역 사람과 외부 사람 모두가 확인하고 공유할 수 있는 서비스를 만들고 있습니다.

지역사회의 활성화를 위해 모두가 한 곳에서 트렌디한 지역 이슈를 확인할 수 있는 UI를 구축하고 있습니다.

현재 모바일 화면만 작업되어 있습니다. 추후 배포와 함께 웹 화면까지 확장하여 보여질 예정입니다. 감사합니다.

# Demo

<p align="center"> 
  <img src="example.gif" width="300">
</p>

# Plan

- 검색 엔진 구축
  - Elasticsearch
- 글 보관
  - 북마크 고려
- 글 리스팅
  - 트렌딩
  - 과거
  - 최신
  - 지역별
- 배포
  - 이후 다른 기능 업데이트(태그 등)

# Role

- 프론트엔드: 신현석
- 백엔드: 신현석

# Spec

- 프론트엔드
  - Typescript
  - React
  - Styled-Components
  - Zustand
  - React-Query
- 백엔드
  - Typescript
  - Fastify
  - Prisma
  - SQLite

# How to run

- [프론트엔드](packages/mz-client/README.md)
- [백엔드](packages/mz-server/README.md)

# File structure

- packages
  - mz-server 🏃‍♂️
  - mz-client(web 🏃‍♂️ / mobile)
