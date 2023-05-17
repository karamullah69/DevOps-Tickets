import * as cdk from 'aws-cdk-lib';
import { App, Stack, StackProps, Stage, CfnOutput } from 'aws-cdk-lib';
import { Pipeline, Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { CodeCommitSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { ManualApprovalAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { CloudFormationCreateUpdateStackAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { PipelineProject, BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';

class CICDPipelineStack extends Stack {
  constructor(scope: cdk.Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Source Stage - CodeCommit/GitHub
    const sourceOutput = new Artifact();
    const sourceAction = new CodeCommitSourceAction({
      actionName: 'Source',
      repository: 'your-github-repo',
      output: sourceOutput,
    });

    // Build Stage - CodeBuild
    const buildOutput = new Artifact();
    const buildProject = new PipelineProject(this, 'BuildProject', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'echo "Building application..."',
              // Add your build commands here
            ],
          },
        },
        artifacts: {
          'base-directory': 'path-to-build-output',
          files: [
            // Add the files that need to be deployed
          ],
        },
      }),
    });
    const buildAction = buildProject.addBuildAction({
      actionName: 'Build',
      input: sourceOutput,
      outputs: [buildOutput],
    });

    // Deploy Stage - CloudFormation
    const deployStackAction = new CloudFormationCreateUpdateStackAction({
      actionName: 'Deploy',
      stackName: 'YourStackName',
      templatePath: buildOutput.atPath('template.yaml'),
      adminPermissions: true, // Adjust permissions as needed
      parameterOverrides: {
        // Add any necessary CloudFormation parameter overrides
      },
      extraInputs: [buildOutput],
    });

    // Manual Approval Stage
    const manualApprovalAction = new ManualApprovalAction({
      actionName: 'ManualApproval',
      notifyEmails: ['your-email@example.com'], // Add the email addresses to receive approval notifications
    });

    // Create Pipeline
    const pipeline = new Pipeline(this, 'Pipeline', {
      pipelineName: 'YourPipelineName',
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [buildAction],
        },
        {
          stageName: 'Deploy',
          actions: [deployStackAction],
        },
        {
          stageName: 'Approval',
          actions: [manualApprovalAction],
        },
      ],
    });

    // Output Pipeline URL
    new CfnOutput(this, 'PipelineUrl', {
      value: pipeline.pipelineUrl,
    });
  }
}

const app = new App();
new CICDPipelineStack(app, 'CICDPipelineStack');
app.synth();
