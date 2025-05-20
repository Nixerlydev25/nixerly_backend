import { z } from "zod";

export const getWorkerDetailsSchema = z
  .string()
  .uuid({ message: "Invalid worker ID format" });

export const getProfilePictureUploadUrl = z.object({
  contentType: z
    .string()
    .regex(/^image\/(jpeg|png|gif|webp)$/, "Invalid image format"),
  fileName: z.string().min(1, "File name is required"),
});

export const saveProfilePicture = z.object({
  s3Key: z.string().min(1, "S3 key is required"),
});
