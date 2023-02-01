####################
# ECS cluster
####################
resource "aws_ecs_cluster" "prod" {
  name = "ga-prod-fargate"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = "prod"
    Name        = "ga-prod-fargate"
  }

  tags_all = {
    Environment = "prod"
    Name        = "ga-prod-fargate"
  }
}

resource "aws_ecs_cluster_capacity_providers" "prod" {
  cluster_name       = aws_ecs_cluster.prod.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]
}

####################
# ECR
####################
resource "aws_ecr_repository" "prod" {
  encryption_configuration {
    encryption_type = "AES256"
  }

  image_scanning_configuration {
    scan_on_push = "true"
  }

  image_tag_mutability = "MUTABLE"
  name                 = "ga-prod-fargate"

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }
}
