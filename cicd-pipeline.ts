import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipelineActions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

// Define the pipeline stack
class CICDPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the S3 bucket for pipeline artifacts
    const pipelineBucket = new s3.Bucket(this, 'PipelineBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Define your pipeline stages
    const stages = ['Dev', 'QA', 'UAT', 'Prod'];

    stages.forEach((stage, index) => {
      // Create a CodeCommit repository for each stage
      const repository = new codecommit.Repository(this, `${stage}Repo`, {
        repositoryName: `${stage}-repo`,
      });

      // Create an ECR repository for each stage
      const ecrRepository = new ecr.Repository(this, `${stage}ECRRepo`, {
        repositoryName: `${stage}-ecr-repo`,
      });

      // Create a CodeBuild project for each stage
      const buildProject = new codebuild.Project(this, `${stage}Build`, {
        source: codebuild.Source.gitHub({
          owner: 'karamullah69',
          repo: 'DevOps-Tickets',
          webhook: true,
        }),
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
          privileged: true,
        },
        environmentVariables: {
          ECR_REPO_URI: { value: ecrRepository.repositoryUri },
        },
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            pre_build: {
              commands: ['echo Logging in to Amazon ECR...', 'aws --version', 'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO_URI'],
            },
            build: {
              commands: ['echo Building the Docker image...', 'docker build -t $ECR_REPO_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION .'],
            },
            post_build: {
              commands: ['echo Pushing the Docker image to ECR...', 'docker push $ECR_REPO_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION'],
            },
          },
        }),
      });

      // Create a CodePipeline action for each stage
      const pipelineAction = new codepipelineActions.CodeBuildAction({
        actionName: `${stage}BuildAction`,
        input: new codepipeline.Artifact(),
        project: buildProject,
        outputs: [new codepipeline.Artifact()],
      });

      // Define the pipeline stage
      const pipelineStage = new codepipeline.Stage(this, `${stage}Stage`, {
        stageName: stage,
        actions: [pipelineAction],
      });

      // Add manual approval for all stages except the first one
      if (index > 0) {
        pipelineStage.addManualApprovalAction({
          actionName: `${stage}Approval`,
          additionalInformation: `Please review and approve the ${stage} deployment.`,
        });
      }

      // Add the pipeline stage to the pipeline
      pipeline.addStage(pipelineStage);
    });
  }
}

const pipelineApp = new cdk.Stage(app, 'CICDPipelineStage');
pipelineApp.addStack(new CICDPipelineStack(pipelineApp, 'CICDPipelineStack'));

app.synth();
