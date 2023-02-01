resource "aws_codedeploy_app" "prod" {
  compute_platform = "ECS"
  name             = "AppECS-ga-prod-fargate-ga-prod-fargate"
}

data "aws_iam_role" "AWSCodeDeployRole" {
  name = "AWSCodeDeployRole"
}

resource "aws_codedeploy_deployment_group" "prod" {
  app_name               = aws_codedeploy_app.prod.name
  deployment_config_name = "CodeDeployDefault.ECSAllAtOnce"
  deployment_group_name  = "DgpECS-ga-prod-fargate-ga-prod-fargate"
  service_role_arn       = data.aws_iam_role.AWSCodeDeployRole.arn

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

  blue_green_deployment_config {
    deployment_ready_option {
      action_on_timeout = "CONTINUE_DEPLOYMENT"
    }

    terminate_blue_instances_on_deployment_success {
      action                           = "TERMINATE"
      termination_wait_time_in_minutes = 0
    }
  }

  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }

  ecs_service {
    cluster_name = aws_ecs_cluster.prod.name
    service_name = aws_ecs_cluster.prod.name
  }

  load_balancer_info {
    target_group_pair_info {
      prod_traffic_route {
        listener_arns = [aws_lb_listener.prod.arn]
      }

      target_group {
        name = aws_lb_target_group.fargate01.name
      }

      target_group {
        name = aws_lb_target_group.fargate02.name
      }
    }
  }
}