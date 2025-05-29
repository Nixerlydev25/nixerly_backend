import prisma from '../../../config/prisma.config';

export const getAllStatistics = async () => {
  const [
    totalJobs,
    totalWorkers,
    totalBusinesses,
    blockedJobs,
    blockedWorkers,
    blockedBusinesses,
    openJobs,
    closedJobs,
    activeWorkers,
    activeBusiness,
    jobsInProgress,
    completedJobs,
    totalApplications,
    acceptedApplications,
  ] = await Promise.all([
    prisma.job.count(),
    prisma.workerProfile.count(),
    prisma.businessProfile.count(),
    prisma.job.count({
      where: { isBlocked: true },
    }),
    prisma.workerProfile.count({
      where: { isBlocked: true },
    }),
    prisma.businessProfile.count({
      where: { isBlocked: true },
    }),
    prisma.job.count({
      where: { status: 'OPEN' },
    }),
    prisma.job.count({
      where: { status: 'CLOSED' },
    }),
    prisma.workerProfile.count({
      where: {
        updatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.businessProfile.count({
      where: {
        updatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.job.count({
      where: { status: 'OPEN' },
    }),
    prisma.job.count({
      where: { status: 'CLOSED' },
    }),
    prisma.jobApplication.count(),
    prisma.jobApplication.count({
      where: { status: 'ACCEPTED' },
    }),
  ]);

  const statistics = {
    totalJobs: {
      count: totalJobs,
      blocked: blockedJobs,
      open: openJobs,
      closed: closedJobs,
      inProgress: jobsInProgress,
      completed: completedJobs,
    },
    totalWorkers: {
      count: totalWorkers,
      blocked: blockedWorkers,
      activeLastMonth: activeWorkers,
    },
    totalBusiness: {
      count: totalBusinesses,
      blocked: blockedBusinesses,
      activeLastMonth: activeBusiness,
    },
    applications: {
      total: totalApplications,
      accepted: acceptedApplications,
      acceptanceRate:
        totalApplications === 0
          ? '0%'
          : ((acceptedApplications / totalApplications) * 100).toFixed(2) + '%',
    },
    jobMetrics: {
      completionRate: ((completedJobs / totalJobs) * 100).toFixed(2) + '%',
      openRate: ((openJobs / totalJobs) * 100).toFixed(2) + '%',
      blockRate: ((blockedJobs / totalJobs) * 100).toFixed(2) + '%',
    },
  };

  return { statistics };
};
