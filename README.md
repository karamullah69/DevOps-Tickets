# CI/CD Pipeline with AWS CloudFormation and Terraform

This project demonstrates the setup of a four-stage CI/CD pipeline using AWS CloudFormation and Terraform. The pipeline includes Dev, QA, UAT, and Prod stages, each with manual approvals before progressing to the next stage. Additionally, the project includes infrastructure deployment, batch job components, and code deployment from GitHub to Amazon Elastic Container Registry (ECR).

## Prerequisites

Before deploying the pipeline and infrastructure components, make sure you have the following:

- An AWS account with appropriate permissions to create resources.
- AWS CLI installed and configured with access keys.
- Terraform installed on your local machine.

## Deployment Instructions

### AWS CloudFormation

1. Open the AWS Management Console and navigate to AWS CloudFormation.
2. Create a new CloudFormation stack.
3. Upload the `pipeline.yaml` template file.
4. Follow the wizard to provide necessary parameters and create the stack.
5. Wait for the stack to be created. This will set up the CI/CD pipeline with the specified stages.

### Terraform

1. Clone or download this repository to your local machine.
2. Install Terraform by downloading it from the official website.
3. Open a command-line interface and navigate to the project directory.
4. Run `terraform init` to initialize the Terraform working directory.
5. Review the Terraform plan with `terraform plan`.
6. Apply the Terraform changes with `terraform apply`.
7. Confirm the changes by typing "yes" when prompted.
8. Wait for Terraform to provision the infrastructure and deploy the resources.

## Project Structure

The project includes the following files:

- `pipeline.yaml`: AWS CloudFormation template for the CI/CD pipeline.
- `deploy.tf`: Terraform configuration for infrastructure deployment, batch job components, and code deployment.
- `buildspec.yml`: Build specification file for CodeBuild project, specifying the build steps.

## Customization

Feel free to customize the CloudFormation template and Terraform configuration files to fit your specific requirements. You can modify the pipeline stages, add or remove resources, and adjust the deployment settings as needed.

## License

This project is licensed under the [MIT License](LICENSE).
