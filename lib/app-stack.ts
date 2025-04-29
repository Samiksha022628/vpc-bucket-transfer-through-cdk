import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc, Instance, InstanceClass, InstanceType, InstanceSize, MachineImage, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Fn } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcId = Fn.importValue('MyVpcId');
    const bucketName = Fn.importValue('MyBucketName');
    const publicSubnetId = Fn.importValue('MyPublicSubnetId');  
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'InstanceSG', Fn.importValue('MySGId'), {
      mutable: true,
    }); 

    const vpc = Vpc.fromVpcAttributes(this, 'ImportedVpc', {
      vpcId: vpcId,
      availabilityZones: ['us-east-1a'],  
      publicSubnetIds: [publicSubnetId],  
    });

    const bucket = Bucket.fromBucketName(this, 'ImportedBucket', bucketName);

    new ec2.Instance(this, 'MyInstance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      securityGroup,
      keyName: 'demo-test', 
    });

    const lambdaFunction = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log("Hello from Lambda!");
          return { statusCode: 200, body: "Hello from Lambda!" };
        };
      `),
      vpc,
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      allowPublicSubnet: true, 
    });

    bucket.grantReadWrite(lambdaFunction);

    new cdk.CfnOutput(this, 'ImportedVpcId', {
      value: vpcId,
      description: 'The VPC ID imported from NetworkStack',
    });

    new cdk.CfnOutput(this, 'ImportedBucketName', {
      value: bucketName,
      description: 'The S3 Bucket name imported from NetworkStack',
    });
  }
}
