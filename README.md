# CI/CD Pipeline with AWS CDK

This project sets up a four-stage CI/CD pipeline using AWS CloudFormation and AWS CDK. The pipeline automates the deployment of code from a GitHub repository to different environments (Dev, QA, UAT, Prod) with manual approvals for each stage.

## Prerequisites

Before deploying the CI/CD pipeline, make sure you have the following prerequisites:

- AWS account credentials with sufficient permissions to create AWS resources.
- Node.js and npm installed on your local machine.
- AWS CDK installed and configured on your local machine.

## Getting Started

Follow the steps below to deploy the CI/CD pipeline:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies by running the following command:
4. Modify the AWS CDK script (`cicd-pipeline.ts`) to update any specific configurations (e.g., GitHub repository details, AWS region, etc.).
5. Deploy the CI/CD pipeline by running the following command:
6. Confirm the deployment by reviewing the changes to be made and entering "y" when prompted.

## Architecture

The CI/CD pipeline is created using AWS CDK and deploys the following AWS resources for each stage:

- CodeCommit repository: Stores the application code for each environment.
- ECR repository: Stores Docker images of the application.
- CodeBuild project: Builds the Docker image and pushes it to the ECR repository.
- CodePipeline: Orchestrates the flow of the CI/CD pipeline and triggers the appropriate actions.

## Manual Approvals

The pipeline includes manual approvals for each stage, except the first one. This allows designated individuals to review and approve the deployments before progressing to the next stage.

When a deployment reaches

Feel free to modify the README.md file according to your project's specific details and requirements.
