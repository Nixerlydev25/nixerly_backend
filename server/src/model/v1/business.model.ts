import { OnboardingStepBusinessProfile } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { DatabaseError, NotFoundError } from "../../utils/errors";
import { S3Service } from "../../services/s3.service";

export const updateBusinessProfile = async (
  userId: string,
  businessProfileData: {
    onboardingStep?: OnboardingStepBusinessProfile;
    companyName?: string;
    description?: string;
    industry?: string;
    city?: string;
    state?: string;
    country?: string;
    website?: string;
    employeeCount?: number;
    yearFounded?: number;
    phoneNumber?: string;
  }
) => {
  try {
    const fieldsToUpdate = { ...businessProfileData };

    await prisma.businessProfile.update({
      where: { userId },
      data: {
        ...fieldsToUpdate,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {},
      include: { businessProfile: true },
    });

    return updatedUser;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getBusinessProfileDetailsByUserId = async (userId: string) => {
  try {
    const businessProfile = await prisma.businessProfile.findUnique({
      where: { userId },
    });

    return businessProfile;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
export const getBusinessProfileDetails = async (businessId: string) => {
  try {
    const user = await prisma.businessProfile.findUnique({
      where: { id: businessId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            defaultProfile: true,
            email: true,
          },
        },
        profilePicture: true,
        jobs: {
          select: {
            id: true,
            title: true,
            description: true,
            requirements: true,
            employmentType: true,
            numberOfPositions: true,
            budget: true,
            hourlyRateMin: true,
            hourlyRateMax: true,
            status: true,
          },
        },
      },
    });

    // Get profile picture URL if exists
    if (user?.profilePicture?.s3Key) {
      const profilePictureUrl = await S3Service.getObjectUrl(
        user.profilePicture.s3Key
      );
      return {
        ...user,
        profilePicture: {
          ...user.profilePicture,
          url: profilePictureUrl,
        },
      };
    }

    return user;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getAllBusinessJobs = async (
  userId: string,
  filters: {
    page: number;
    limit: number;
    search?: string;
    status?: "OPEN" | "CLOSED";
  }
) => {
  try {
    console.log(filters);
    // Check if the business profile exists
    const businessProfile = await prisma.businessProfile.findUnique({
      where: { userId: userId },
    });

    if (!businessProfile) {
      throw new DatabaseError("Business Profile Not Found");
    }

    const { page, limit, search, status } = filters;
    const skip = (page - 1) * limit;

    // Build the where clause with optional search and status filters
    const where = {
      businessProfileId: businessProfile.id,
      ...(search && {
        title: {
          contains: search,
        },
      }),
      ...(status && { status }),
    };

    // Get total count for pagination
    const totalCount = await prisma.job.count({ where });

    // Get count for jobs with status OPEN and CLOSED
    const openJobsCount = await prisma.job.count({
      where: {
        businessProfileId: businessProfile.id,
        status: "OPEN",
      },
    });

    const closedJobsCount = await prisma.job.count({
      where: {
        businessProfileId: businessProfile.id,
        status: "CLOSED",
      },
    });

    // Get jobs with pagination and optional search and status filters
    const allJobsPosts = await prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        employmentType: true,
        numberOfPositions: true,
        budget: true,
        hourlyRateMin: true,
        hourlyRateMax: true,
        status: true,
        salary: true,
        jobType: true,
        startDate: true,
        numberOfWorkersRequired: true,
        expiresAt: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            applications: true,
          },
        },
        businessProfile: {
          select: {
            companyName: true,
          },
        },
      },
    });

    // Add total applications count to each job post
    const allJobsPostsWithApplications = allJobsPosts.map((job) => ({
      ...job,
      totalApplications: job._count.applications,
      companyName: job.businessProfile.companyName,
    }));

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      allJobsPosts: allJobsPostsWithApplications,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        hasMore,
      },
      jobStatusCounts: {
        open: openJobsCount,
        closed: closedJobsCount,
      },
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getJobById = async (jobId: string, businessId: string) => {
  try {
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        businessProfileId: businessId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        employmentType: true,
        numberOfPositions: true,
        budget: true,
        hourlyRateMin: true,
        hourlyRateMax: true,
        status: true,
        jobType: true,
        startDate: true,
        numberOfWorkersRequired: true,
        expiresAt: true,
        location: true,
        requirements: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            applications: true,
          },
        },
        businessProfile: {
          select: {
            companyName: true,
            industry: true,
            city: true,
            state: true,
            country: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    return {
      ...job,
      totalApplications: job._count.applications,
      company: job.businessProfile,
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const saveProfilePicture = async (userId: string, s3Key: string) => {
  try {
    // First, get the business profile ID
    const businessProfile = await prisma.businessProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!businessProfile) {
      throw new NotFoundError("Business profile not found");
    }

    // Check if profile picture already exists
    const existingProfilePicture = await prisma.profilePicture.findUnique({
      where: { businessProfileId: businessProfile.id },
    });

    if (existingProfilePicture) {
      // Update existing profile picture
      const updatedProfilePicture = await prisma.profilePicture.update({
        where: { businessProfileId: businessProfile.id },
        data: { s3Key },
      });
      return updatedProfilePicture;
    } else {
      // Create new profile picture
      const newProfilePicture = await prisma.profilePicture.create({
        data: {
          businessProfileId: businessProfile.id,
          s3Key,
        },
      });
      return newProfilePicture;
    }
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
