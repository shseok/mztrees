[
  {
    "name": "${prefix}-app",
    "image": "${aws_ecr_repository}:${tag}",
    "essential": true,
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "${prefix}-service",
        "awslogs-group": "${prefix}-log-group"
      }
    },
    "portMappings": [
      {
        "containerPort": ${port},
        "hostPort": ${port},
        "protocol": "tcp"
      }
    ],
    "cpu": 1,
    "environment": [
      %{ for env_key, env_value in envvars }
      {
        "name": "${env_key}",
        "value": "${env_value}"
      },
      %{ endfor ~}
      {
        "name": "NODE_ENV",
        "value": "production"
      },
      {
        "name": "PORT",
        "value": "${port}"
      },
      { 
        "name": "ALGOLIA_APP_ID",
        "value": "${algolia_app_id}"
      },
      {
        "name": "CF_ACCOUNT_ID",
        "value": "${cf_account_id}"
      },
      {
        "name": "CF_ACCESS_KEY_ID",
        "value": "${cf_access_key_id}"
      }
    ],
    "ulimits": [
      {
        "name": "nofile",
        "softLimit": 65536,
        "hardLimit": 65536
      }
    ],
    "mountPoints": [],
    "memory": 512,
    "secrets": [
      {
        "name": "DATABASE_URL",
        "valueFrom": "${database_url}"
      },
      {
        "name": "JWT_SECRET",
        "valueFrom": "${jwt_secret}"
      },
      {
        "name": "ALGOLIA_ADMIN_KEY",
        "valueFrom": "${algolia_admin_key}"
      },
      {
        "name": "CF_ACCESS_KEY_SECRET",
        "valueFrom": "${cf_access_key_secret}"
      },
      {
        "name": "PUBLIC_S3_BUCKET_NAME",
        "valueFrom": "${public_s3_bucket_name}"
      }
    ],
    "volumesFrom": []
  }
]