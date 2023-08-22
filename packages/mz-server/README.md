# Web Backend

### Running on local environment

1. Rename .env.sample to .env in packages/mz-server directory.
2. Modify `datasource db` part in packages/mz-server/prisma/schema.client to use SQLite as below

```
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

> If you want to use PostgreSQL instead of SQLite, run PostgreSQL server with [this link](../mz-server/dockers/postgresql/README.md), set `DATABASE_URL` in .env file, and modify `datasource db` part in schema.prisma as below.
>
> ```
> datasource db {
>   provider = "postgresql"
>   url      = env("DATABASE_URL")
> }
> ```

3. Delete packages/mz-server/prisma/migrations directory.
4. Use `yarn install` command to install node_modules.
5. Use `yarn prisma migrate dev` command to initialize database.
6. Use `npx prisma db seed` command to seed data(ex. region, area)
7. Use `yarn prisma generate` command to generate Prisma Client.
8. Use `yarn dev` command to run server. Server will run on port 8080. Go to http://localhost:8080/ to check if server is running .

API Documentation is available at http://localhost:8080/documentation.
