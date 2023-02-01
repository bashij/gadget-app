resource "aws_security_group" "alb" {
  description = "for alb"

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "0"
    protocol    = "-1"
    self        = "false"
    to_port     = "0"
  }

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "443"
    protocol    = "tcp"
    self        = "false"
    to_port     = "443"
  }

  name = "ga-prod-sg-alb"

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }

  vpc_id = aws_vpc.prod.id
}

resource "aws_security_group" "fargate" {
  description = "for application server (fargate)"

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "0"
    protocol    = "-1"
    self        = "false"
    to_port     = "0"
  }

  ingress {
    from_port       = "80"
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    self            = "false"
    to_port         = "80"
  }

  name = "ga-prod-sg-application-fargate"

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }

  vpc_id = aws_vpc.prod.id
}

resource "aws_security_group" "db" {
  description = "for db server"

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "0"
    protocol    = "-1"
    self        = "false"
    to_port     = "0"
  }

  ingress {
    from_port       = "3306"
    protocol        = "tcp"
    security_groups = [aws_security_group.fargate.id]
    self            = "false"
    to_port         = "3306"
  }

  name = "ga-prod-sg-db"

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }

  vpc_id = aws_vpc.prod.id
}
