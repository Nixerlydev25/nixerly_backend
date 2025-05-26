import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getS3Client = () => {
  return new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
};

export class S3Service {
  static async generatePresignedUrl(
    key: string,
    contentType: string
  ): Promise<string> {
    try {
      const s3 = getS3Client();
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
        ContentType: contentType,
      });

      return await getSignedUrl(s3, command, { expiresIn: 3600 });
    } catch (error: any) {
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }

  static async getObjectUrl(key: string): Promise<string> {
    try {
      const s3 = getS3Client();
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
      });

      return await getSignedUrl(s3, command, { expiresIn: 3600 });
    } catch (error: any) {
      throw new Error(`Failed to generate object URL: ${error.message}`);
    }
  }
}