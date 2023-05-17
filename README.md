# CI/CD Pipeline with AWS CDK

This project sets up a four-stage CI/CD pipeline using AWS CDK, which automates the deployment of your application code from GitHub to an Amazon Elastic Container Registry (ECR) repository. The pipeline includes manual approval steps in each stage (Dev, QA, UAT, Prod) to ensure controlled deployment.

## Prerequisites

Before deploying the CI/CD pipeline, make sure you have the following prerequisites:

- Node.js and npm installed
- AWS CDK CLI installed and configured with appropriate permissions
- GitHub repository for your application code
- AWS credentials configured with appropriate permissions

## Getting Started

Follow these steps to deploy the CI/CD pipeline:

1. Clone this repository or create a new directory for your project.
2. Install dependencies by running `npm install` in the project directory.
3. Replace the `lib/cdk-stack.ts` file with the provided AWS CDK code.
4. Configure your AWS credentials by either setting environment variables or using the AWS CLI's `aws configure` command.
5. Run `cdk deploy` to deploy the AWS CDK stack and create the CI/CD pipeline.
6. Review the proposed changes and enter `y` to confirm the deployment.
7. Wait for the deployment to complete. Once successful, you will see the pipeline URL in the output.
8. Access the pipeline URL in a web browser to view and manage your CI/CD pipeline.

## Project Structure

The project structure is as follows:

- `lib/cdk-stack.ts`: Contains the AWS CDK code that defines the pipeline and its stages.
- `package.json` and `package-lock.json`: Define the project dependencies and metadata.
- `.gitignore`: Specifies the files and directories to ignore when committing changes to Git.
- `README.md`: Provides an overview of the project and instructions for deployment.

## Customization

Feel free to customize the AWS CDK code and pipeline stages to fit your specific requirements. You can modify the pipeline stages, add or remove actions, configure manual approvals, and adjust deployment settings as needed. Refer to the AWS CDK documentation for more information on working with CDK constructs.

## Cleanup

To remove the deployed resources and clean up your environment, run `cdk destroy`. This will delete the created pipeline, ECR repository, and associated resources from your AWS account.

## License

This project is licensed under the [MIT License](LICENSE).

