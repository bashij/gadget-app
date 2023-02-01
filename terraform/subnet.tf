resource "aws_subnet" "application_c" {
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.2.0/24"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Environment = "prod"
    Name        = "ga-prod-subnet-application-c"
  }

  tags_all = {
    Environment = "prod"
    Name        = "ga-prod-subnet-application-c"
  }

  vpc_id = aws_vpc.prod.id
}

resource "aws_subnet" "application_a" {
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.1.0/24"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Environment = "prod"
    Name        = "ga-prod-subnet-application-a"
  }

  tags_all = {
    Environment = "prod"
    Name        = "ga-prod-subnet-application-a"
  }

  vpc_id = aws_vpc.prod.id
}

resource "aws_subnet" "db_c" {
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.4.0/24"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Environment = "prod"
    Name        = "ga-prod-subnet-db-c"
  }

  tags_all = {
    Environment = "prod"
    Name        = "ga-prod-subnet-db-c"
  }

  vpc_id = aws_vpc.prod.id
}

resource "aws_subnet" "db_a" {
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.3.0/24"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Environment = "prod"
    Name        = "ga-prod-subnet-db-a"
  }

  tags_all = {
    Environment = "prod"
    Name        = "ga-prod-subnet-db-a"
  }

  vpc_id = aws_vpc.prod.id
}
