import prisma from "../../../config/prisma.config";
import { DatabaseError, NotFoundError } from "../../../utils/errors";
import { ReportStatus } from "@prisma/client";

interface ReportFilters {
  page: number;
  limit: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: ReportStatus;
}

const createDateFilter = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return {};
  
  return {
    createdAt: {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate && { lte: new Date(endDate) }),
    },
  };
};

export const getAllJobReports = async (filters: ReportFilters) => {
  try {
    const { page, limit, search, startDate, endDate, status } = filters;
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        // Date range filter
        createDateFilter(startDate, endDate),
        // Status filter
        ...(status ? [{ status }] : []),
        // Search in description or through related job title
        ...(search
          ? [
              {
                OR: [
                  { description: { contains: search } },
                  {
                    reportedJob: {
                      title: { contains: search },
                    },
                  },
                ],
              },
            ]
          : []),
      ],
    };

    const [totalCount, reports] = await Promise.all([
      prisma.jobReport.count({ where }),
      prisma.jobReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          reportedJob: {
            select: {
              title: true,
              businessProfile: {
                select: {
                  companyName: true,
                },
              },
            },
          },
          reporterWorker: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      reports,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        hasMore,
      },
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getAllWorkerReports = async (filters: ReportFilters) => {
  try {
    const { page, limit, search, startDate, endDate, status } = filters;
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        // Date range filter
        createDateFilter(startDate, endDate),
        // Status filter
        ...(status ? [{ status }] : []),
        // Search in description or through related worker name
        ...(search
          ? [
              {
                OR: [
                  { description: { contains: search } },
                  {
                    reportedWorker: {
                      user: {
                        OR: [
                          { firstName: { contains: search } },
                          { lastName: { contains: search } },
                        ],
                      },
                    },
                  },
                ],
              },
            ]
          : []),
      ],
    };

    const [totalCount, reports] = await Promise.all([
      prisma.workerReport.count({ where }),
      prisma.workerReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          reportedWorker: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          reporterBusiness: {
            select: {
              companyName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      reports,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        hasMore,
      },
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getAllBusinessReports = async (filters: ReportFilters) => {
  try {
    const { page, limit, search, startDate, endDate, status } = filters;
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        // Date range filter
        createDateFilter(startDate, endDate),
        // Status filter
        ...(status ? [{ status }] : []),
        // Search in description or through related business name
        ...(search
          ? [
              {
                OR: [
                  { description: { contains: search } },
                  {
                    reportedBusiness: {
                      companyName: { contains: search },
                    },
                  },
                ],
              },
            ]
          : []),
      ],
    };

    const [totalCount, reports] = await Promise.all([
      prisma.businessReport.count({ where }),
      prisma.businessReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          reportedBusiness: {
            select: {
              companyName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          reporterWorker: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      reports,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        hasMore,
      },
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getJobReportDetails = async (reportId: string) => {
  try {
    const report = await prisma.jobReport.findUnique({
      where: { id: reportId },
      include: {
        reportedJob: {
          include: {
            businessProfile: {
              select: {
                companyName: true,
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
            skills: true,
            location: true,
          },
        },
        reporterWorker: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
              },
            },
            skills: true,
            experience: {
              orderBy: {
                startDate: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundError("Job report not found");
    }

    return report;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getWorkerReportDetails = async (reportId: string) => {
  try {
    const report = await prisma.workerReport.findUnique({
      where: { id: reportId },
      include: {
        reportedWorker: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                isVerified: true,
              },
            },
            skills: true,
            experience: {
              orderBy: {
                startDate: 'desc',
              },
            },
            education: true,
            languages: true,
            profilePicture: true,
          },
        },
        reporterBusiness: {
          include: {
            user: {
              select: {
                email: true,
                createdAt: true,
                isVerified: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundError("Worker report not found");
    }

    return report;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getBusinessReportDetails = async (reportId: string) => {
  try {
    const report = await prisma.businessReport.findUnique({
      where: { id: reportId },
      include: {
        reportedBusiness: {
          include: {
            user: {
              select: {
                email: true,
                createdAt: true,
                isVerified: true,
              },
            },
            jobs: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 5, // Get last 5 jobs
              select: {
                title: true,
                status: true,
                createdAt: true,
              },
            },
          },
        },
        reporterWorker: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
              },
            },
            skills: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundError("Business report not found");
    }

    return report;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
