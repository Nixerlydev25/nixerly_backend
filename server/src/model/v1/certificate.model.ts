import prisma from "../../config/prisma.config";
import { DatabaseError, NotFoundError, UnauthorizedError } from "../../utils/errors";
import { CertificateType } from "@prisma/client";

export const createCertificates = async (
  userId: string,
  certificates: {
    name: string;
    issuingOrg: string;
    issueDate: Date;
    expiryDate?: Date | null;
    credentialUrl?: string;
    certificateType: CertificateType;
  }[]
) => {
  try {
    // Get worker profile ID
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) {
      throw new NotFoundError("Worker profile not found");
    }

    // Create all certificates in a transaction
    const createdCertificates = await prisma.$transaction(
      certificates.map((cert) =>
        prisma.certificate.create({
          data: {
            workerId: workerProfile.id,
            ...cert,
          },
        })
      )
    );

    return createdCertificates;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const deleteCertificates = async (userId: string, certificateIds: string[]) => {
  try {
    // Get worker profile ID
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) {
      throw new NotFoundError("Worker profile not found");
    }

    // Verify ownership of all certificates
    const certificates = await prisma.certificate.findMany({
      where: {
        id: { in: certificateIds },
      },
      select: {
        id: true,
        workerId: true,
      },
    });

    // Check if all certificates belong to the worker
    const unauthorized = certificates.some((cert) => cert.workerId !== workerProfile.id);
    if (unauthorized) {
      throw new UnauthorizedError("Unauthorized to delete one or more certificates");
    }

    // Delete all certificates in a transaction
    await prisma.$transaction([
      // First delete all assets associated with these certificates
      prisma.asset.deleteMany({
        where: {
          certificateId: { in: certificateIds },
        },
      }),
      // Then delete the certificates
      prisma.certificate.deleteMany({
        where: {
          id: { in: certificateIds },
          workerId: workerProfile.id,
        },
      }),
    ]);
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const saveAssets = async (
  userId: string,
  certificateId: string,
  assets: {
    s3Key: string;
    mediaType: string;
  }[]
) => {
  try {
    // Get worker profile ID and verify certificate ownership
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) {
      throw new NotFoundError("Worker profile not found");
    }

    const certificate = await prisma.certificate.findFirst({
      where: {
        id: certificateId,
        workerId: workerProfile.id,
      },
    });

    if (!certificate) {
      throw new NotFoundError("Certificate not found or unauthorized");
    }

    // Create all assets in a transaction
    const createdAssets = await prisma.$transaction(
      assets.map((asset) =>
        prisma.asset.create({
          data: {
            key: asset.s3Key,
            mediaType: asset.mediaType,
            certificateId,
          },
        })
      )
    );

    return createdAssets;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
