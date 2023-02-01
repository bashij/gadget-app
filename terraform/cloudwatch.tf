resource "aws_cloudwatch_log_group" "containerinsights" {
  name              = "/aws/ecs/containerinsights/ga-prod-fargate/performance"
  retention_in_days = 1

  tags = {
    Environment = "prod"
  }
}

resource "aws_cloudwatch_log_group" "ga_prod_fargate" {
  name = "/ecs/ga-prod-fargate"

  tags = {
    Environment = "prod"
  }
}

resource "aws_cloudwatch_log_group" "rds" {
  name              = "RDSOSMetrics"
  retention_in_days = 30

  tags = {
    Environment = "prod"
  }
}
