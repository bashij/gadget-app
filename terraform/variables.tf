####################
# Provider
####################
variable "access_key" {
  description = "AWS Access Key"
}

variable "secret_key" {
  description = "AWS Secret Key"
}

variable "role_arn" {
  description = "AWS Role Arn"
}

variable "region" {
  default = "ap-northeast-1"
}

####################
# RDS
####################
variable "database_user" {
  description = "RDS User Name"
}

variable "db01_kms_key_id" {
  description = "RDS db01 kms_key_id"
}

####################
# Route 53
####################
variable "cname01_name" {
  description = "Route 53 cname01 name"
}

variable "cname01_record" {
  description = "Route 53 cname01 record"
}

variable "cname02_name" {
  description = "Route 53 cname02 name"
}

variable "cname02_record" {
  description = "Route 53 cname02 record"
}

variable "cname03_name" {
  description = "Route 53 cname03 name"
}

variable "cname03_record" {
  description = "Route 53 cname03 record"
}