import { z } from "zod";
import { CertificateType } from "@prisma/client";

// Schema for creating certificates
export const createCertificates = z.object({
  certificates: z.array(
    z.object({
      name: z.string().min(1, "Certificate name is required"),
      issuingOrg: z.string().min(1, "Issuing organization is required"),
      issueDate: z.string().transform((str) => new Date(str)),
      expiryDate: z.string().optional().nullable().transform((str) => str ? new Date(str) : null),
      credentialUrl: z.string().url().optional(),
      certificateType: z.nativeEnum(CertificateType),
    })
  ),
});

// Schema for deleting certificates
export const deleteCertificates = z.object({
  certificateIds: z.array(z.string().uuid()),
});

// Schema for getting asset upload URL
export const getAssetUploadUrl = z.object({
  certificateId: z.string().uuid(),
  files: z.array(
    z.object({
      fileName: z.string(),
      contentType: z.string(),
    })
  ),
});

// Schema for saving assets
export const saveAssets = z.object({
  certificateId: z.string().uuid(),
  assets: z.array(
    z.object({
      s3Key: z.string(),
      mediaType: z.string(),
    })
  ),
}); 