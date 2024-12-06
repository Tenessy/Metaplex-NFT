import { awsUploader } from '@metaplex-foundation/umi-uploader-aws';
import s3 from '@/lib/aws/s3';
import { UmiPlugin } from '@metaplex-foundation/umi';

const awsUploaderS3 = (): UmiPlugin =>
  awsUploader(s3, process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string);

export default awsUploaderS3;
