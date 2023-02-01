####################
# Route 53
####################
resource "aws_route53_zone" "prod" {
  name    = "gadgetlink-app.com"
  comment = "HostedZone created by Route53 Registrar"
  tags = {
    Environment = "prod"
  }
}

resource "aws_route53_record" "ns" {
  zone_id = aws_route53_zone.prod.zone_id
  name    = "gadgetlink-app.com"
  type    = "NS"
  ttl     = 172800
  records = [
    "${aws_route53_zone.prod.name_servers[0]}.",
    "${aws_route53_zone.prod.name_servers[1]}.",
    "${aws_route53_zone.prod.name_servers[2]}.",
    "${aws_route53_zone.prod.name_servers[3]}.",
  ]
}

resource "aws_route53_record" "soa" {
  zone_id = aws_route53_zone.prod.zone_id
  name    = "gadgetlink-app.com"
  type    = "SOA"
  ttl     = 900
  records = [
    "${aws_route53_zone.prod.primary_name_server}. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400"
  ]
}

resource "aws_route53_record" "a01" {
  zone_id = aws_route53_zone.prod.zone_id
  name    = "www.gadgetlink-app.com"
  type    = "A"
  alias {
    name                   = "dualstack.${aws_lb.alb.dns_name}"
    zone_id                = aws_lb.alb.zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "a02" {
  zone_id = aws_route53_zone.prod.zone_id
  name    = "static.gadgetlink-app.com"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.static.domain_name
    zone_id                = aws_cloudfront_distribution.static.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "cname01" {
  zone_id = aws_route53_zone.prod.zone_id
  name    = var.cname01_name
  type    = "CNAME"
  ttl     = 300

  records = [var.cname01_record]
}

resource "aws_route53_record" "cname02" {
  zone_id = aws_route53_zone.prod.zone_id
  name    = var.cname02_name
  type    = "CNAME"
  ttl     = 300

  records = [var.cname02_record]
}

####################
# ACM
####################
resource "aws_acm_certificate" "www" {
  domain_name       = "www.gadgetlink-app.com"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = false
  }

  tags = {
    Environment = "prod"
  }
}

resource "aws_acm_certificate" "static" {
  provider          = aws.acm_provider
  domain_name       = "static.gadgetlink-app.com"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = false
  }
}
