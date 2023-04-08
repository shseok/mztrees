# develop process

1. typescript install + tsc init
2. tsconfig.json > setting
   - [use esmodule](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
   - ESM & ts & ts-node & nodemon 삽질
   - nodemon은 rs enter로 작업시 refresh 해주기..
3. install fastify
4. prettier 설정
5. index.ts 가져올 때, 디렉토리로만 import하는데, index.js 수작업 필요
   - vscode 자동화
     - "javascript.preferences.importModuleSpecifierEnding": "js"
6. [pino-pretty](https://github.com/pinojs/pino-pretty)
   - 로그 포매팅
7. [fastify-swagger](https://github.com/fastify/fastify-swagger)
   - API 문서 시각화(API 가독성을 위함)
   - [version migration](https://github.com/fastify/fastify-swagger/blob/master/MIGRATION.md)
   - http://localhost:4000/documentation
8. 프리즈마 설치 & 디비 연동
   - 스키마에 등록된 프로퍼티들의 타입을 지원해줌. (index.d.ts)
   - 디비 (DBeaver - sqlite)
     - 추후 PostgreSQL
9. bcrypt 비밀번호 복호화

# directory structure

- prisma
- src
  - routes
  - config
  - lib
  - services
    - api에서 바로 데이터 접근x, 서비스를 통해 접근o
    - 비지니스로직을 별도의 라우터에서가 아닌 이곳에서 관리한다면, 추후 graphql으로 변경한다고 했을 때, 전환 용이
