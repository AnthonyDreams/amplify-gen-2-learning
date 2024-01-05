import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import * as s3 from 'aws-cdk-lib/aws-s3';

const backend = defineBackend({
  auth,
  data,
});

// extract L1 CfnUserPool resources
const { cfnUserPool } = backend.auth.resources.cfnResources;
// use CDK's `addPropertyOverride` to modify properties directly
cfnUserPool.addPropertyOverride("Schema", [
  {
    Name: "workspace",
    AttributeDataType: "String",
    Mutable: true,
  },
]);


// create the bucket and its stack
const bucketStack = backend.createStack('BucketStack');
const bucket = new s3.Bucket(bucketStack, 'Bucket', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  bucketName: 'email-cms-mailit',
  cors: [
    {
      allowedOrigins: ["*"],
      allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD, s3.HttpMethods.POST, s3.HttpMethods.PUT, s3.HttpMethods.DELETE]
    }
  ]
});

// allow any authenticated user to read and write to the bucket
const authRole = backend.auth.resources.authenticatedUserIamRole;
bucket.grantReadWrite(authRole);

// allow any guest (unauthenticated) user to read from the bucket
const unauthRole = backend.auth.resources.unauthenticatedUserIamRole;
bucket.grantRead(unauthRole);