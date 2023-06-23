# Infrastructure

데이터베이스: EC2 배포
백엔드 앱: ECR > ECS 배포

무중단 배포 환경 구축 완료

# setting (AWS)

- db
  - ec2
    -instance
  - security_group
  - vpc
- backend-app

  - ecs
    - service
      - cluster(backend-app)
      - cluster(ranking-worker)
        - cloudewatch
      - task_definition
  - ecr
    - repo
    - ranking-worker-repo
  - secrets_manager
    destroy할 때마다 version올려야 한다. 그럴일은 없겠지만..
  - subnets
  - vpc
  - iam_role
  - lb
  - cloudwatch
  - appautoscaling

- .auto.tfvars(환경변수의 default)
