provider "aws" {
  access_key = var.access_key
  secret_key = var.secret_key
  region     = var.region

  assume_role {
    role_arn = var.role_arn
  }
}

provider "aws" {
  alias  = "acm_provider"
  region = "us-east-1"
}
