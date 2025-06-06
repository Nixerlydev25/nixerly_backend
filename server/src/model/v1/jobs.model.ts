import {
  Job,
  SkillName,
  JobStatus,
  JobType,
  JobApplicationDuration,
  ProfileType,
  ApplicationStatus,
} from '@prisma/client';
import prisma from '../../config/prisma.config';
import { DatabaseError } from '../../utils/errors';
import { ResponseStatus } from '../../types/response.enums';
import { stat } from 'fs';
import { S3Service } from '../../services/s3.service';

export const createJob = async (
  businessProfileId: string,
  jobData: {
    title: string;
    description: string;
    budget?: number;
    hourlyRateMin?: number;
    hourlyRateMax?: number;
    salary?: number;
    skills: SkillName[];
    expiresAt?: Date;
    requirements: string;
    jobType?: JobType;
    startDate?: Date;
    numberOfWorkersRequired: number;
    location: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
  }
): Promise<Job> => {
  try {
    return await prisma.$transaction(async (tx) => {
      // Create the job
      const job = await tx.job.create({
        data: {
          title: jobData.title,
          requirements: jobData.requirements,
          description: jobData.description,
          budget: jobData.budget,
          hourlyRateMin: jobData.hourlyRateMin,
          hourlyRateMax: jobData.hourlyRateMax,
          businessProfileId,
          expiresAt: jobData.expiresAt,
          jobType: jobData.jobType,
          salary: jobData.salary,
          startDate: jobData.startDate,
          numberOfWorkersRequired: jobData.numberOfWorkersRequired,
          skills: {
            create: jobData.skills.map((skillName) => ({
              skillName,
            })),
          },
          location: {
            create: {
              street: jobData.location.street,
              city: jobData.location.city,
              state: jobData.location.state,
              country: jobData.location.country,
              postalCode: jobData.location.postalCode,
            },
          },
        },
        include: {
          skills: true,
        },
      });

      // Update the business profile's posted jobs count
      await tx.businessProfile.update({
        where: { id: businessProfileId },
        data: {
          postedJobs: {
            increment: 1,
          },
        },
      });

      return job;
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getJobs = async (filters: {
  page: number;
  limit: number;
  sortOrder: 'asc' | 'desc';
  search?: string;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  status?: JobStatus;
  budget?: number;
  skills?: SkillName[];
}) => {
  try {
    const {
      page,
      limit,
      sortOrder,
      search,
      minHourlyRate,
      maxHourlyRate,
      status,
      budget,
      skills,
    } = filters;
    const skip = (page - 1) * limit;

    // Build the where clause
    const where = {
      AND: [
        // Search in title and description
        ...(search
          ? [
              {
                OR: [
                  { title: { contains: search } },
                  { description: { contains: search } },
                ],
              },
            ]
          : []),
        // Hourly rate range
        ...(minHourlyRate ? [{ hourlyRateMin: { gte: minHourlyRate } }] : []),
        ...(maxHourlyRate ? [{ hourlyRateMax: { lte: maxHourlyRate } }] : []),
        // Status filter
        ...(status ? [{ status }] : []),
        // Budget filter for contract jobs
        ...(budget ? [{ budget: { gte: budget } }] : []),
        // Skills filter
        ...(skills
          ? [{ skills: { some: { skillName: { in: skills } } } }]
          : []),
      ],
    };

    console.log('wherea', JSON.stringify(where));
    console.log('sortOrder', sortOrder);

    // Use Promise.all to fetch totalCount and jobs concurrently
    const [totalCount, jobs] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: sortOrder,
        },
        include: {
          businessProfile: {
            select: {
              id: true,
              companyName: true,
              description: true,
              industry: true,
              city: true,
              state: true,
              country: true,
              website: true,
              employeeCount: true,
              yearFounded: true,
            },
          },
          skills: {
            select: {
              skillName: true,
            },
          },
        },
      }),
    ]);

    // Transform the jobs to simplify skills array
    const transformedJobs = jobs.map((job) => ({
      ...job,
      skills: job.skills.map((skill) => skill.skillName),
    }));

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      jobs: transformedJobs,
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

export const getJobById = async (jobId: string) => {
  try {
    return await prisma.job.findUnique({
      where: { id: jobId },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getJobDetails = async (
  jobId: string,
  userId: string,
  role: string
) => {
  try {
    const jobDetails = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        businessProfile: {
          include: {
            profilePicture: true
          }
        },
        skills: {
          select: {
            skillName: true,
          },
        },
        workAreaImages: {
          select: {
            s3Key: true,
          },
        },
        applications:
          role === ProfileType.BUSINESS
            ? {
                include: {
                  workerProfile: {
                    include: {
                      user: {
                        select: {
                          firstName: true,
                          lastName: true,
                          email: true,
                        },
                      },
                      profilePicture: true,
                      skills: true,
                      experience: true,
                      education: true,
                      languages: true,
                    },
                  },
                },
              }
            : false,
      },
    });

    if (!jobDetails) {
      throw new DatabaseError('Job not found');
    }

    let hasWorkerApplied = false;
    if (role === ProfileType.WORKER) {
      const workerProfile = await prisma.workerProfile.findUnique({
        where: { userId: userId },
      });

      if (!workerProfile) {
        throw new DatabaseError('Worker profile not found');
      }

      const application = await prisma.jobApplication.findFirst({
        where: {
          jobId,
          workerProfileId: workerProfile.id,
        },
      });

      hasWorkerApplied = !!application;
    }

    // Get work area image URLs
    const workAreaImageUrls = await Promise.all(
      jobDetails.workAreaImages.map(async (image) => {
        try {
          return await S3Service.getObjectUrl(image.s3Key);
        } catch (error) {
          console.error("Failed to get work area image URL:", error);
          return null;
        }
      })
    );

    // Get business profile picture URL if exists
    let businessProfilePictureUrl = null;
    if (jobDetails.businessProfile?.profilePicture?.s3Key) {
      try {
        businessProfilePictureUrl = await S3Service.getObjectUrl(
          jobDetails.businessProfile.profilePicture.s3Key
        );
      } catch (error) {
        console.error("Failed to get business profile picture URL:", error);
      }
    }

    // Get worker profile pictures for applications if business role
    let applications = jobDetails.applications;
    if (role === ProfileType.BUSINESS && Array.isArray(applications)) {
      applications = await Promise.all(
        applications.map(async (application: any) => {
          let workerProfilePictureUrl = null;
          if (application.workerProfile?.profilePicture?.s3Key) {
            try {
              workerProfilePictureUrl = await S3Service.getObjectUrl(
                application.workerProfile.profilePicture.s3Key
              );
            } catch (error) {
              console.error("Failed to get worker profile picture URL:", error);
            }
          }
          return {
            ...application,
            workerProfile: {
              ...application.workerProfile,
              profilePicture: workerProfilePictureUrl,
              skills: application.workerProfile.skills.map((skill: { skillName: SkillName }) => skill.skillName)
            }
          };
        })
      );
    }

    const transformedJobDetails = {
      ...jobDetails,
      businessProfile: {
        ...jobDetails.businessProfile,
        profilePicture: businessProfilePictureUrl
      },
      skills: jobDetails.skills.map((skill) => skill.skillName),
      workAreaImages: workAreaImageUrls.filter(url => url !== null),
      hasWorkerApplied:
        role === ProfileType.WORKER ? hasWorkerApplied : undefined,
      applicants:
        role === ProfileType.BUSINESS ? applications : undefined,
    };

    return transformedJobDetails;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const applyJob = async (
  jobId: string,
  workerId: string,
  coverLetter: string,
  proposedRate: number,
  workerStartDateAvailability: Date,
  duration: JobApplicationDuration
) => {
  try {
    // Check if the worker profile exists
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId: workerId },
    });

    if (!workerProfile) {
      throw new DatabaseError('Worker profile not found');
    }

    const jobApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId,
        workerProfileId: workerProfile.id,
      },
    });

    if (jobApplication) {
      throw new DatabaseError('You have already applied for this job');
    }

    return await prisma.jobApplication.create({
      data: {
        jobId,
        workerProfileId: workerProfile.id,
        coverLetter,
        proposedRate,
        workerStartDateAvailability,
        duration,
      },
      include: {
        job: true,
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getApplicantsOfJob = async (
  jobId: string,
  filters: {
    page: number;
    limit: number;
  }
) => {
  try {
    const { page, limit } = filters;
    const skip = (page - 1) * limit;

    const applicants = await prisma.jobApplication.findMany({
      where: { jobId },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        workerProfile: {
          select: {
            phoneNumber: true,
            profilePicture: true,
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
    });

    // Transform applicants to include profile picture URLs
    const transformedApplicants = await Promise.all(
      applicants.map(async (applicant) => {
        let profilePictureUrl = null;
        if (applicant.workerProfile?.profilePicture?.s3Key) {
          try {
            profilePictureUrl = await S3Service.getObjectUrl(
              applicant.workerProfile.profilePicture.s3Key
            );
          } catch (error) {
            console.error("Failed to get worker profile picture URL:", error);
          }
        }

        return {
          ...applicant,
          workerProfile: {
            ...applicant.workerProfile,
            profilePicture: profilePictureUrl
          }
        };
      })
    );

    const totalCount = await prisma.jobApplication.count({ where: { jobId } });
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    const totalApplications = await prisma.jobApplication.count({
      where: { jobId },
    });
    const averageHourlyRate = await prisma.jobApplication.aggregate({
      where: { jobId },
      _avg: { proposedRate: true },
    });

    return {
      applicants: transformedApplicants,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        hasMore,
      },
      stats: {
        totalApplications,
        averageHourlyRateProposed: averageHourlyRate._avg.proposedRate,
      },
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const checkIfUserOwnsJob = async (userId: string, jobId: string) => {
  const businessProfile = await prisma.businessProfile.findFirst({
    where: { userId },
  });

  if (!businessProfile) {
    return false;
  }

  const job = await prisma.job.findFirst({
    where: { businessProfileId: businessProfile.id, id: jobId },
  });

  return job ? true : false;
};
