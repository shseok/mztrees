# directory structure

- prisma
- src
  - routes
  - config
  - lib
  - services
    - api에서 바로 데이터 접근x, 서비스를 통해 접근o
    - 비지니스로직을 별도의 라우터에서가 아닌 이곳에서 관리한다면, 추후 graphql으로 변경한다고 했을 때, 전환 용이
