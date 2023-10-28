####################
# ALB
####################
resource "aws_lb" "alb" {
  desync_mitigation_mode           = "defensive"
  drop_invalid_header_fields       = "false"
  enable_cross_zone_load_balancing = "true"
  enable_deletion_protection       = "false"
  enable_http2                     = "true"
  enable_waf_fail_open             = "false"
  idle_timeout                     = "60"
  internal                         = "false"
  ip_address_type                  = "ipv4"
  load_balancer_type               = "application"
  name                             = "ga-prod-alb"
  preserve_host_header             = "false"
  security_groups                  = [aws_security_group.alb.id]

  subnet_mapping {
    subnet_id = aws_subnet.application_c.id
  }

  subnet_mapping {
    subnet_id = aws_subnet.application_a.id
  }

  subnets = [aws_subnet.application_c.id, aws_subnet.application_a.id]

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }
}

####################
# ALB target group
####################
resource "aws_lb_target_group" "fargate_front1" {
  deregistration_delay = "300"

  health_check {
    enabled             = "true"
    healthy_threshold   = "5"
    interval            = "30"
    matcher             = "200"
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = "5"
    unhealthy_threshold = "2"
  }

  ip_address_type               = "ipv4"
  load_balancing_algorithm_type = "round_robin"
  name                          = "ga-prod-alb-group-fargate-front1"
  port                          = "80"
  protocol                      = "HTTP"
  protocol_version              = "HTTP1"
  slow_start                    = "0"

  stickiness {
    cookie_duration = "86400"
    enabled         = "false"
    type            = "lb_cookie"
  }

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }

  target_type = "ip"
  vpc_id      = aws_vpc.prod.id
}

resource "aws_lb_target_group" "fargate_front2" {
  deregistration_delay = "300"

  health_check {
    enabled             = "true"
    healthy_threshold   = "5"
    interval            = "30"
    matcher             = "200"
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = "5"
    unhealthy_threshold = "2"
  }

  ip_address_type               = "ipv4"
  load_balancing_algorithm_type = "round_robin"
  name                          = "ga-prod-alb-group-fargate-front2"
  port                          = "80"
  protocol                      = "HTTP"
  protocol_version              = "HTTP1"
  slow_start                    = "0"

  stickiness {
    cookie_duration = "86400"
    enabled         = "false"
    type            = "lb_cookie"
  }

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }

  target_type = "ip"
  vpc_id      = aws_vpc.prod.id
}

resource "aws_lb_target_group" "fargate_back1" {
  deregistration_delay = "300"

  health_check {
    enabled             = "true"
    healthy_threshold   = "5"
    interval            = "30"
    matcher             = "200"
    path                = "/api/v1/check"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = "5"
    unhealthy_threshold = "2"
  }

  ip_address_type               = "ipv4"
  load_balancing_algorithm_type = "round_robin"
  name                          = "ga-prod-alb-group-fargate-back1"
  port                          = "80"
  protocol                      = "HTTP"
  protocol_version              = "HTTP1"
  slow_start                    = "0"

  stickiness {
    cookie_duration = "86400"
    enabled         = "false"
    type            = "lb_cookie"
  }

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }

  target_type = "ip"
  vpc_id      = aws_vpc.prod.id
}

resource "aws_lb_target_group" "fargate_back2" {
  deregistration_delay = "300"

  health_check {
    enabled             = "true"
    healthy_threshold   = "5"
    interval            = "30"
    matcher             = "200"
    path                = "/api/v1/check"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = "5"
    unhealthy_threshold = "2"
  }

  ip_address_type               = "ipv4"
  load_balancing_algorithm_type = "round_robin"
  name                          = "ga-prod-alb-group-fargate-back2"
  port                          = "80"
  protocol                      = "HTTP"
  protocol_version              = "HTTP1"
  slow_start                    = "0"

  stickiness {
    cookie_duration = "86400"
    enabled         = "false"
    type            = "lb_cookie"
  }

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }

  target_type = "ip"
  vpc_id      = aws_vpc.prod.id
}

####################
# ALB listener
####################
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.alb.id
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.www.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fargate_front1.arn
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.id
  port              = "80"
  protocol          = "HTTP"
  ssl_policy        = ""
  certificate_arn   = ""

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

####################
# ALB listener rule
####################
resource "aws_lb_listener_rule" "https_front" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fargate_front1.arn
  }

  condition {
    host_header {
      values = ["www.gadgetlink-app.com"]
    }
  }

  tags = {
    Name = "front"
  }

}

resource "aws_lb_listener_rule" "https_back" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 2

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fargate_back1.arn
  }

  condition {
    host_header {
      values = ["back.gadgetlink-app.com"]
    }
  }

  tags = {
    Name = "back"
  }
}

resource "aws_lb_listener_rule" "https_default" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 99999

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fargate_front1.arn
  }

  condition {
  }
}

resource "aws_lb_listener_rule" "redirect_http_to_https" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 99999

  action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  condition {
  }
}
