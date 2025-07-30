# CI/CD with AWS Developer Tools

Continuous Integration (CI) and Continuous Deployment (CD) form a practice that automates the software release process. By automating the build, test, and deployment phases, teams can release features more frequently and reliably. AWS provides a suite of developer tools to create powerful CI/CD pipelines.

## Core AWS Developer Tools

*   **AWS CodeCommit:** A fully-managed source control service that hosts secure and private Git repositories. It's the AWS equivalent of GitHub or GitLab.
*   **AWS CodeBuild:** A fully-managed continuous integration service that compiles source code, runs tests, and produces software packages that are ready to deploy. It's a serverless build service, so you don't need to manage any build servers.
*   **AWS CodeDeploy:** A fully-managed deployment service that automates software deployments to a variety of compute services such as Amazon EC2, AWS Fargate, AWS Lambda, and your on-premises servers.
*   **AWS CodePipeline:** A fully-managed continuous delivery service that helps you automate your release pipelines for fast and reliable application and infrastructure updates. CodePipeline automates the build, test, and deploy phases of your release process every time there is a code change, based on the release model you define.

## How They Work Together

A typical CI/CD pipeline on AWS works like this:

1.  A developer pushes a code change to a **CodeCommit** repository.
2.  This push automatically triggers **CodePipeline**.
3.  The pipeline's "Source" stage pulls the latest code from CodeCommit.
4.  The pipeline's "Build" stage sends the code to **CodeBuild**. CodeBuild compiles the code, runs unit tests, and creates deployment artifacts (e.g., a built application, a Docker image).
5.  The pipeline's "Deploy" stage sends the build artifacts to **CodeDeploy** (or another service like S3 or ECS directly), which deploys the application to the target environment (e.g., EC2, Fargate, Lambda).

This entire process is automated, providing rapid feedback to developers and enabling fast, consistent deployments.

## Labs

*   [Lab: Creating a Simple CI/CD Pipeline for a Static Website](./lab-cicd-pipeline-s3.md)
