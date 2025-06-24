import { z } from "zod";

// Schema for creating portfolios
export const createPortfolios = z.object({
  portfolios: z.array(
    z.object({
      title: z.string().min(1, "Portfolio title is required"),
      description: z.string().min(1, "Description is required"),
      startDate: z.string().transform((str) => new Date(str)),
      endDate: z.string().optional().nullable().transform((str) => str ? new Date(str) : null),
      employerName: z.string().min(1, "Employer name is required"),
      employerWebsite: z.string().url().optional(),
      projectUrl: z.string().url().optional(),
    })
  ),
});

// Schema for deleting portfolios
export const deletePortfolios = z.object({
  portfolioIds: z.array(z.string().uuid()),
});

// Schema for getting asset upload URL
export const getAssetUploadUrl = z.object({
  portfolioId: z.string().uuid(),
  files: z.array(
    z.object({
      fileName: z.string(),
      contentType: z.string(),
    })
  ),
});

// Schema for saving assets
export const saveAssets = z.object({
  portfolioId: z.string().uuid(),
  assets: z.array(
    z.object({
      s3Key: z.string(),
      mediaType: z.string(),
    })
  ),
}); 