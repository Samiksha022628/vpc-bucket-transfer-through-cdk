import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Stage, StageProps } from 'aws-cdk-lib';
import { NetworkStack } from './network-stack';
import { AppStack } from './app-stack';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyCdkAppPipeline',
      synth: new ShellStep('SynthStep', {
        input: CodePipelineSource.gitHub('Samiksha022628/vpc-bucket-transfer-through-cdk', 'main', {
          authentication: cdk.SecretValue.secretsManager('GITHUB_TOKEN'), 
        }),
        commands: [
          'npm ci',
          'npm install -g aws-cdk',
          'cdk synth',
        ],
      }),
    });

    const appStage = new MyAppStage(this, 'AppStage', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
      },
    });

    pipeline.addStage(appStage);
  }
}

class MyAppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const network = new NetworkStack(this, 'NetworkStack');

    const app = new AppStack(this, 'AppStack');
    app.addDependency(network); 
  }
}
