// import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
// import { s3 } from "./aws.service";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { AwsServiceError } from "../utils/errors";

// export class S3Service {
//   // Upload a single file to S3
//   static async uploadFile(buffer: Buffer, key: string, mimetype: string): Promise<string> {
//     try {
//       const params = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME!,
//         Key: key,
//         Body: buffer,
//         ContentType: mimetype,
//       };

//       const command = new PutObjectCommand(params);
//       await s3.send(command);

//       return key;
//     } catch (error) {
//       console.error(`Error uploading file to S3: ${error}`);
//       throw new AwsServiceError("Failed to upload file to S3");
//     }
//   }

//   // Upload multiple files to S3
//   static async uploadMultipleFiles(
//     files: { buffer: Buffer; key: string; mimetype: string }[]
//   ): Promise<string[]> {
//     try {
//       const uploadedKeys: string[] = [];
//       for (const file of files) {
//         const key = await this.uploadFile(file.buffer, file.key, file.mimetype);
//         uploadedKeys.push(key);
//       }
//       return uploadedKeys;
//     } catch (error) {
//       console.error(`Error uploading multiple files to S3: ${error}`);
//       throw new AwsServiceError("Failed to upload multiple files to S3");
//     }
//   }

//   // Generate a URL for an S3 object
//   static async getFileUrl(key: string, expiresInSeconds = 3600): Promise<string> {
//     try {
//       const bucketName = process.env.AWS_S3_BUCKET_NAME!;

//       const command = new GetObjectCommand({
//         Bucket: bucketName,
//         Key: key,
//       });

//       // Generate a signed URL
//       const signedUrl = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
//       return signedUrl;
//     } catch (error) {
//       console.error(`Error generating signed URL: ${error}`);
//       throw new AwsServiceError("Failed to generate signed URL");
//     }
//   }
// }
