# AWS Fundamentals

Welcome to the AWS section of DevNotes! This section provides explanations and practical lab examples for various AWS services.

## What is AWS?

Amazon Web Services (AWS) is a comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally. Millions of customers—including the fastest-growing startups, largest enterprises, and leading government agencies—are using AWS to lower costs, become more agile, and innovate faster.

## Core Concepts

*   **Regions and Availability Zones (AZs):**
    *   **Region:** A physical location in the world where AWS has multiple data centers. Examples: `us-east-1` (N. Virginia), `eu-west-2` (London).
    *   **Availability Zone:** One or more discrete data centers with redundant power, networking, and connectivity in a region. AZs are isolated from each other to prevent a failure in one from affecting others.

*   **IAM (Identity and Access Management):**
    *   The service that controls access to AWS resources securely. You use IAM to control who is authenticated (signed in) and authorized (has permissions) to use resources.

*   **VPC (Virtual Private Cloud):**
    *   A virtual network dedicated to your AWS account. It is logically isolated from other virtual networks in the AWS Cloud. You can launch your AWS resources, such as Amazon EC2 instances, into your VPC.

## Next Steps

This directory contains dedicated folders for major AWS services, each with its own `README.md` and practical labs.

*   [EC2 (Elastic Compute Cloud)](./EC2/README.md)
*   [S3 (Simple Storage Service)](./S3/README.md)
*   [Route 53 (Domain Name System)](./Route53/README.md)
*   [IAM (Identity and Access Management)](./IAM/README.md)
*   [RDS (Relational Database Service)](./RDS/README.md)
*   [Lambda (Serverless Compute)](./Lambda/README.md)
*   [VPC (Virtual Private Cloud)](./VPC/README.md)
*   [Elastic Load Balancing (ELB)](./ELB/README.md)
*   [Auto Scaling](./AutoScaling/README.md)
*   [CloudFormation (Infrastructure as Code)](./CloudFormation/README.md)
*   [Containers (ECS, Fargate)](./Containers-ECS-Fargate/README.md)
*   [CI/CD with CodePipeline](./CI-CD-CodePipeline/README.md)
*   [Monitoring with CloudWatch](./Monitoring-CloudWatch/README.md)
