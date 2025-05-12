import { z } from "zod";

export const createCertificateSchema = z.object({
  name: z.string(),
  issuingOrg: z.string(),
  issueDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  credentialUrl: z.string().optional(),
  assetId: z.string().optional(),
});

export const updateCertificateSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuingOrg: z.string(),
  issueDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  credentialUrl: z.string().optional(),
  assetId: z.string().optional(),
});

export const deleteCertificateSchema = z.object({
  id: z.string(),
});
