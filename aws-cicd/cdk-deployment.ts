import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipelineActions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();

// Development Components

// Create a CodeCommit repository
const repo = new codecommit.Repository(app, 'MyCodeCommitRepo', {
  repositoryName: 'my-repo',
});

// Batch Job Components

// Create an ECR repository
const ecrRepo = new ecr.Repository(app, 'MyECRRepo', {
  repositoryName: 'my-ecr-repo',
});

// Code Deployment from GitHub to ECR

// Create a CodeBuild project
const codeBuildProject = new codebuild.Project(app, 'MyCodeBuildProject', {
  projectName: 'my-codebuild-project',
  source: codebuild.Source.gitHub({
    owner: 'your-github-owner',
    repo: 'your-github-repo',
    branchOrRef: 'your-github-branch',
  }),
  buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
  environment: {
    buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
  },
});

// Create an IAM role for CodePipeline
const pipelineRole = new iam.Role(app, 'MyPipelineRole', {
  assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
});

// Grant necessary permissions to the pipeline role
ecrRepo.grantPullPush(pipelineRole);
codeBuildProject.grantBuilds(pipelineRole);

// Create a CodePipeline pipeline
const pipeline = new codepipeline.Pipeline(app, 'MyCodePipeline', {
  pipelineName: 'my-pipeline',
  role: pipelineRole,
});

// Add source stage to the pipeline
const sourceStage = pipeline.addStage({
  stageName: 'Source',
  actions: [
    new codepipelineActions.GitHubSourceAction({
      actionName: 'Source',
      owner: 'your-github-owner',
      repo: 'your-github-repo',
      branch: 'your-github-branch',
      output: new codepipeline.Artifact(),
      oauthToken: cdk.SecretValue.secretsManager('github-token-secret'),
    }),
  ],
});

// Add build stage to the pipeline
const buildStage = pipeline.addStage({
  stageName: 'Build',
  actions: [
    new codepipelineActions.CodeBuildAction({
      actionName: 'Build',
      project: codeBuildProject,
      input: sourceStage.addAction(new codepipeline.Artifact()),
      outputs: [new codepipeline.Artifact()],
    }),
  ],
});

// Add deploy stage to the pipeline
const deployStage = pipeline.addStage({
  stageName: 'Deploy',
  actions: [
    new codepipelineActions.EcrPublishAction({
      actionName: 'Publish',
      repository: ecrRepo,
      input: buildStage.addAction(new codepipeline.Artifact()),
    }),
  ],
});

app.synth();
