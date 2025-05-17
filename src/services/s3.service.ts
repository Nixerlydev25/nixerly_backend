import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "./aws.service";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

export const generatePresignedUrl = async (
  key: string,
  contentType: string
): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return presignedUrl;
  } catch (error: any) {
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
};

export const getObjectUrl = async (key: string): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return presignedUrl;
  } catch (error: any) {
    throw new Error(`Failed to generate object URL: ${error.message}`);
  }
};
