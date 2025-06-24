import prisma from "../../config/prisma.config";
import {
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/errors";

export const createPortfolios = async (
  userId: string,
  portfolios: {
    title: string;
    description: string;
    startDate: Date;
    endDate?: Date | null;
    employerName: string;
    employerWebsite?: string;
    projectUrl?: string;
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

    // Create all portfolios in a transaction
    const createdPortfolios = await prisma.$transaction(
      portfolios.map((portfolio) =>
        prisma.portfolio.create({
          data: {
            workerId: workerProfile.id,
            ...portfolio,
          },
        })
      )
    );

    return createdPortfolios;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const deletePortfolios = async (
  userId: string,
  portfolioIds: string[]
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

    // Verify ownership of all portfolios
    const portfolios = await prisma.portfolio.findMany({
      where: {
        id: { in: portfolioIds },
      },
      select: {
        id: true,
        workerId: true,
      },
    });

    // Check if all portfolios belong to the worker
    const unauthorized = portfolios.some(
      (portfolio) => portfolio.workerId !== workerProfile.id
    );
    if (unauthorized) {
      throw new UnauthorizedError(
        "Unauthorized to delete one or more portfolios"
      );
    }

    // Delete all portfolios in a transaction
    await prisma.$transaction([
      // First delete all assets associated with these portfolios
      prisma.asset.deleteMany({
        where: {
          portfolioId: { in: portfolioIds },
        },
      }),
      // Then delete the portfolios
      prisma.portfolio.deleteMany({
        where: {
          id: { in: portfolioIds },
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
  portfolioId: string,
  assets: {
    s3Key: string;
    mediaType: string;
  }[]
) => {
  try {
    // Get worker profile ID and verify portfolio ownership
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) {
      throw new NotFoundError("Worker profile not found");
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: portfolioId,
        workerId: workerProfile.id,
      },
    });

    if (!portfolio) {
      throw new NotFoundError("Portfolio not found or unauthorized");
    }

    // Create all assets in a transaction
    const createdAssets = await prisma.$transaction(
      assets.map((asset) =>
        prisma.asset.create({
          data: {
            key: asset.s3Key,
            mediaType: asset.mediaType,
            portfolioId,
          },
        })
      )
    );

    return createdAssets;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
