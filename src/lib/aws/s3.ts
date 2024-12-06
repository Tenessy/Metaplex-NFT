import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY as string,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY as string,
  },
  region: 'eu-west-3',
});

export default s3;
