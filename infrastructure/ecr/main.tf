terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  profile = "default"
  region  = "ap-northeast-2"
}

resource "aws_ecr_repository" "backend_app" {
  name = "mz-backend-app"
}

output "repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.backend_app.repository_url
}