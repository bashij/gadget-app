data "aws_iam_role" "rds" {
  name = "rds-monitoring-role"
}

resource "aws_db_instance" "db01" {
  allocated_storage                     = "20"
  auto_minor_version_upgrade            = "true"
  availability_zone                     = "ap-northeast-1a"
  backup_retention_period               = "7"
  backup_window                         = "13:24-13:54"
  ca_cert_identifier                    = "rds-ca-2019"
  copy_tags_to_snapshot                 = "true"
  customer_owned_ip_enabled             = "false"
  db_subnet_group_name                  = aws_db_subnet_group.rds.name
  deletion_protection                   = "true"
  engine                                = "mysql"
  engine_version                        = "8.0.28"
  iam_database_authentication_enabled   = "false"
  identifier                            = "ga-prod-db01"
  instance_class                        = "db.t3.micro"
  iops                                  = "0"
  kms_key_id                            = var.db01_kms_key_id
  license_model                         = "general-public-license"
  maintenance_window                    = "sun:19:01-sun:19:31"
  max_allocated_storage                 = "0"
  monitoring_interval                   = "60"
  monitoring_role_arn                   = data.aws_iam_role.rds.arn
  multi_az                              = "false"
  network_type                          = "IPV4"
  option_group_name                     = "default:mysql-8-0"
  parameter_group_name                  = "default.mysql8.0"
  performance_insights_enabled          = "false"
  performance_insights_retention_period = "0"
  port                                  = "3306"
  publicly_accessible                   = "false"
  storage_encrypted                     = "true"
  storage_throughput                    = "0"
  storage_type                          = "gp2"
  skip_final_snapshot                   = "true"

  timeouts {}

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }

  username               = var.database_user
  vpc_security_group_ids = [aws_security_group.db.id]
}

resource "aws_db_subnet_group" "rds" {
  description = "for RDS"
  name        = "ga-prod-subnet-group-db"
  subnet_ids  = [aws_subnet.db_a.id, aws_subnet.db_c.id]

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }
}
