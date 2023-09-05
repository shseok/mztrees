# Web Backend

### 로컬 환경에서 실행하기

1. packages/mz-server 디렉터리에서 .env.sample을 .env 로 이름을 변경하세요.
2. packages/mz-server/prisma/schema.client 에서 테스트를 위해 `datasource db` 부분에서 다음과 같이 SQLite를 사용하도록 수정하세요.

```
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

> SQLite 대신 PostgreSQL을 쓰려면 이 [링크](../mz-server/dockers/postgresql/README.md)를 참고하여 PostgreSQL 서버를 실행하고 .env파일의 `DATABASE_URL`을 설정하고 schema.prisma에서 다음과 같이 `datasource db` 부분을 수정하세요. (원본 값)
>
> ```
> datasource db {
>   provider = "postgresql"
>   url      = env("DATABASE_URL")
> }
> ```

3. packages/mz-server/prisma/migrations 디렉터리를 지우세요.
4. `yarn install` 명령어를 사용하여 node_modules 를 설치하세요.
5. `npx prisma migrate dev` 명령어를 사용하여 데이터베이스 초기설정을 하세요.

- 데이터베이스 초기화를 원한다면, prisma 내 migrations파일을 지우고 `npx prisma migrate dev`를 실행하세요.

6. `npx prisma db seed` 명령어를 사용하여 데이터베이스에 지역 분료용 데이터를 추가하세요.
7. `npx prisma generate` 명령어를 사용하여 Prisma Client를 생성하세요.
8. `yarn dev` 명령어를 사용하여 서버를 실행하세요. 서버는 8080 포트로 실행됩니다. http://localhost:8080/ 에 들어가서 서버가 잘 실행되고 있는지 확인하세요.

API 문서는 http://localhost:8080/documentation 에서 확인할 수 있습니다.

### Service 로직 분리 이유

- api에서 바로 데이터 접근x, 서비스를 통해 접근o
- 비지니스로직을 별도의 라우터에서가 아닌 이곳에서 관리한다면, 추후 graphql으로 변경한다고 했을 때, 전환 용이
