####################
# VPC
####################
resource "aws_vpc" "prod" {
  assign_generated_ipv6_cidr_block     = "false"
  cidr_block                           = "10.0.0.0/16"
  enable_dns_hostnames                 = "true"
  enable_dns_support                   = "true"
  enable_network_address_usage_metrics = "false"
  instance_tenancy                     = "default"

  tags = {
    Environment = "prod"
    Name        = "ga-prod-vpc"
  }

  tags_all = {
    Environment = "prod"
    Name        = "ga-prod-vpc"
  }
}

####################
# Internet Gateway
####################
resource "aws_internet_gateway" "prod" {
  vpc_id = aws_vpc.prod.id

  tags = {
    Environment = "prod"
    Name        = "ga-prod-gw"
  }

  tags_all = {
    Environment = "prod"
    Name        = "ga-prod-gw"
  }
}

resource "aws_internet_gateway_attachment" "prod" {
  internet_gateway_id = aws_internet_gateway.prod.id
  vpc_id              = aws_vpc.prod.id
}

####################
# Route Table
####################
resource "aws_route_table" "prod" {
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.prod.id
  }

  tags = {
    Environment = "prod"
    Name        = "ga-prod-rtb"
  }

  tags_all = {
    Environment = "prod"
    Name        = "ga-prod-rtb"
  }

  vpc_id = aws_vpc.prod.id
}

resource "aws_route_table" "prod_main" {
  tags = {
    Environment = "prod"
    Name        = "ga-prod-rtb-main"
  }

  tags_all = {
    Environment = "prod"
    Name        = "ga-prod-rtb-main"
  }

  vpc_id = aws_vpc.prod.id
}

resource "aws_route_table_association" "application_a" {
  subnet_id      = aws_subnet.application_a.id
  route_table_id = aws_route_table.prod.id
}

resource "aws_route_table_association" "application_c" {
  subnet_id      = aws_subnet.application_c.id
  route_table_id = aws_route_table.prod.id
}

####################
# DHCP
####################
resource "aws_vpc_dhcp_options" "prod" {
  domain_name         = "ap-northeast-1.compute.internal"
  domain_name_servers = ["AmazonProvidedDNS"]
}

resource "aws_vpc_dhcp_options_association" "prod" {
  vpc_id          = aws_vpc.prod.id
  dhcp_options_id = aws_vpc_dhcp_options.prod.id
}

####################
# Endpoint
####################
resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.prod.id
  service_name = "com.amazonaws.ap-northeast-1.s3"

  tags = {
    Name = "ga-prod-vpce-s3"
  }
}
