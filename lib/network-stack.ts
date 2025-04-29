import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CfnOutput } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class NetworkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      const vpc = new Vpc(this, 'MyVpc', {
      cidr: '10.1.0.0/16',  
      maxAzs: 1,  
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,  
          name: 'PublicSubnet',
          cidrMask: 24,  
        },
      ],
    });

      const securityGroup = new ec2.SecurityGroup(this, 'InstanceSG', {
      vpc,
      description: 'Allow SSH and HTTP',
      allowAllOutbound: true,
    });

      securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH');
      securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP');

      const bucket = new Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, 'VpcId', {
      value: vpc.vpcId,
      exportName: 'MyVpcId',
    });

    new CfnOutput(this, 'SecurityGroupId', {
      value: securityGroup.securityGroupId,
      exportName: 'MySGId'
    });
    

    new CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      exportName: 'MyBucketName',
    });

    new CfnOutput(this, 'PublicSubnetId', {
      value: vpc.publicSubnets[0].subnetId,
      exportName: 'MyPublicSubnetId',
    });
  }
}
