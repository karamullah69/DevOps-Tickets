provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
}

# Infrastructure - Development Components
resource "aws_instance" "my_instance" {
  ami           = "ami-0889a44b331db0194"
  instance_type = "t2.micro"
  vpc_security_group_ids = [aws_security_group.my_sg.id]
  subnet_id              = aws_subnet.my_subnet.id
}

resource "aws_security_group" "my_sg" {
  vpc_id = aws_vpc.my_vpc.id
  # Specify inbound/outbound rules as needed
}

resource "aws_subnet" "my_subnet" {
  vpc_id     = aws_vpc.my_vpc.id
  cidr_block = "10.0.0.0/24"
}

# Batch Job Components
resource "aws_batch_compute_environment" "my_compute_env" {
  compute_environment_name = "my-compute-env"
  type                     = "MANAGED"
  # Specify other compute environment details
  compute_resources {
    type                = "EC2"
    min_vcpus           = 0
    desired_vcpus       = 2
    max_vcpus           = 10
    instance_type       = ["optimal"]
    subnets             = ["subnet-12345678", "subnet-87654321"]
    security_group_ids  = ["sg-12345678"]
    instance_role       = "arn:aws:iam::674100930412:instance-profile/MyInstanceRole"
  }

  service_role = "arn:aws:iam::674100930412:role/AWSBatchServiceRole"

}

resource "aws_batch_job_queue" "my_job_queue" {
  name                 = "my-job-queue"
  priority             = 1
  state                = "ENABLED"
  compute_environments = [aws_batch_compute_environment.my_compute_env.arn]
  # Specify other job queue details
}

# Code Deployment from GitHub to ECR
resource "aws_codebuild_project" "my_codebuild_project" {
  name        = "my-codebuild-project"
  description = "Build project for deploying code from GitHub to ECR"
  service_role = aws_iam_role.my_codebuild_role.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/karamullah69/aws_pipeline"
    buildspec       = "buildspec.yml"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:3.0"
    type                        = "LINUX_CONTAINER"
    environment_variable {
      name  = "ECR_REPO"
      value = aws_ecr_repository.my_ecr_repo.repository_url
    }
  }
}

resource "aws_ecr_repository" "my_ecr_repo" {
  name = "my-ecr-repo"
}

resource "aws_iam_role" "my_codebuild_role" {
  name = "my-codebuild-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}
