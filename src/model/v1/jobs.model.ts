import {
  Job,
  SkillName,
  JobStatus,
  JobType,
  JobApplicationDuration,
} from "@prisma/client";
import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";
import { ResponseStatus } from "../../types/response.enums";

export const createJob = async (
  businessProfileId: string,
  jobData: {
    title: string;
    description: string;
    budget?: number;
    hourlyRateMin?: number;
    hourlyRateMax?: number;
    skills: SkillName[];
    expiresAt?: Date;
    requirements: string;
    jobType?: JobType;
    startDate?: Date;
    numberOfWorkersRequired: number;
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
          startDate: jobData.startDate,
          numberOfWorkersRequired: jobData.numberOfWorkersRequired,
          skills: {
            create: jobData.skills.map((skillName) => ({
              skillName,
            })),
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
  sortBy: "createdAt" | "budget" | "hourlyRateMin";
  sortOrder: "asc" | "desc";
  search?: string;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  status?: JobStatus;
}) => {
  try {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      minHourlyRate,
      maxHourlyRate,
      status,
    } = filters;
    const skip = (page - 1) * limit;

    // Build the where clause
    const where = {
      AND: [
        // Search in title and description
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        // Hourly rate range
        minHourlyRate ? { hourlyRateMin: { gte: minHourlyRate } } : {},
        maxHourlyRate ? { hourlyRateMax: { lte: maxHourlyRate } } : {},
        // Status filter
        status ? { status } : {},
      ],
    };

    // Get total count for pagination
    const totalCount = await prisma.job.count({ where });

    // Get jobs with business profile details
    const jobs = await prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
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
    });

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

export const getJobDetails = async (jobId: string, userId: string) => {
  try {

    
    const jobDetials = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        businessProfile: true,
        skills: true,
        workAreaImages: true,
      },
    });

    const hasWorkerApplied = await prisma.jobApplication.findFirst({
      where: {
        jobId,
        workerProfileId: userId,
      },
    });

    const jobDetails = {
      hasWorkerApplied: hasWorkerApplied ? true : false,
      ...jobDetials,
      skills: jobDetials?.skills.map((skill) => skill.skillName),
      workAreaImages: jobDetials?.workAreaImages.map((image) => image.s3Key),
    };

    return jobDetails;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const applyJob = async (
  jobId: string,
  workerId: string,
  coverLetter: string,
  proposedRate: number,
  duration: JobApplicationDuration
) => {
  try {
    console.log({
      jobId,
      workerId,
      coverLetter,
      proposedRate,
      duration,
    });

    // Check if the worker profile exists
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId: workerId },
    });

    if (!workerProfile) {
      throw new DatabaseError("Worker profile not found");
    }

    const jobApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId,
        workerProfileId: workerProfile.id,
      },
    });

    if (jobApplication) {
      throw new DatabaseError("You have already applied for this job");
    }

    return await prisma.jobApplication.create({
      data: {
        jobId,
        workerProfileId: workerProfile.id,
        coverLetter,
        proposedRate,
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
