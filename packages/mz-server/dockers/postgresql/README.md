# Run postgresql server with docker compose

```bash
docker compose up -d
```

# open postgres bash(db shell) using docker

```bash
docker ps
# docker exec <container_id/name> <command>
docker exec -it postgresql-db-1 bash
docker exec -it postgresql-db-1 bin/bash
```

# login as postgres in bash

```bash
su - postgres
psql

```

# Run following statements

```sql
CREATE DATABASE mz ENCODING 'UTF8';
CREATE USER mz WITH ENCRYPTED PASSWORD 'mz';
GRANT ALL PRIVILEGES ON DATABASE mz to mz;
```

# 프리즈마에서 postgresql을 사용하고자 할 때, permission

## Allow user to create database in postgres

```sql
ALTER USER mz CREATEDB;
```

# schema.prisma > change data source to postgresql > .env (add schama)
