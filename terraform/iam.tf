resource "aws_iam_user" "prod_user" {
  name = "ga-prod-user"
  path = "/"

  tags = {
    Environment = "prod"
  }

  tags_all = {
    Environment = "prod"
  }
}

resource "aws_iam_user_policy_attachment" "prod_user_policy01" {
  user       = aws_iam_user.prod_user.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"
}

resource "aws_iam_user_policy_attachment" "prod_user_policy02" {
  user       = aws_iam_user.prod_user.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonECS_FullAccess"
}

resource "aws_iam_user_policy_attachment" "prod_user_policy03" {
  user       = aws_iam_user.prod_user.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}
