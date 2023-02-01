####################
# S3
####################
data "aws_canonical_user_id" "current" {}

resource "aws_s3_bucket" "static" {
  bucket        = "static.gadgetlink-app.com"
  force_destroy = "false"
  grant {
    id          = data.aws_canonical_user_id.current.id
    permissions = ["FULL_CONTROL"]
    type        = "CanonicalUser"
  }
  object_lock_enabled = "false"
  policy              = <<POLICY
{
  "Id": "PolicyForCloudFrontPrivateContent",
  "Statement": [
    {
      "Action": "s3:GetObject",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E3S89LOS21YRZL"
      },
      "Resource": "arn:aws:s3:::static.gadgetlink-app.com/*",
      "Sid": "1"
    }
  ],
  "Version": "2008-10-17"
}
POLICY
  request_payer       = "BucketOwner"
  tags = {
    Environment = "prod"
  }
  tags_all = {
    Environment = "prod"
  }
  versioning {
    enabled    = "false"
    mfa_delete = "false"
  }
}

resource "aws_s3_bucket_public_access_block" "static" {
  bucket = aws_s3_bucket.static.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

####################
# CloudFront
####################
data "aws_cloudfront_origin_access_identity" "static" {
  id = "E3S89LOS21YRZL"
}

data "aws_cloudfront_cache_policy" "static" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_distribution" "static" {
  origin {
    domain_name         = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id           = aws_s3_bucket.static.bucket_regional_domain_name
    connection_attempts = 3
    connection_timeout  = 10

    s3_origin_config {
      origin_access_identity = data.aws_cloudfront_origin_access_identity.static.cloudfront_access_identity_path
    }
  }

  enabled         = true
  is_ipv6_enabled = true
  http_version    = "http2and3"

  aliases = ["static.gadgetlink-app.com"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.static.bucket_regional_domain_name
    cache_policy_id  = data.aws_cloudfront_cache_policy.static.id

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = aws_acm_certificate.static.arn
    minimum_protocol_version       = "TLSv1.2_2021"
    ssl_support_method             = "sni-only"
  }
}
