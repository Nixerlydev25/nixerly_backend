import prisma from "../../config/prisma.config";
import { Prisma, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

interface SubscriptionData {
  businessProfileId: string;
  plan: SubscriptionPlan;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  status: SubscriptionStatus;
  cancelAtPeriodEnd?: boolean;
  // Usage tracking
  profileViewsCount?: number;
  profileSearchCount?: number;
  jobPostsCount?: number;
  // Reset dates
  lastProfileViewsReset?: Date;
  lastProfileSearchReset?: Date;
  lastJobPostsReset?: Date;
}

export class SubscriptionModel {
  static async getBusinessProfileWithUser(businessProfileId: string) {
    return prisma.businessProfile.findUnique({
      where: { id: businessProfileId },
      include: {
        user: true,
        subscription: true
      }
    });
  }

  static async upsertSubscription(data: SubscriptionData) {
    const { businessProfileId, ...subscriptionData } = data;

    return prisma.subscription.upsert({
      where: { businessProfileId },
      create: {
        businessProfileId,
        ...subscriptionData
      },
      update: subscriptionData
    });
  }

  static async updateSubscription(stripeSubscriptionId: string, data: Partial<SubscriptionData>) {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId }
    });

    if (!subscription) {
      throw new Error(`Subscription not found for stripeSubscriptionId: ${stripeSubscriptionId}`);
    }

    return prisma.subscription.update({
      where: { id: subscription.id },
      data
    });
  }

  static async getSubscriptionByBusinessId(businessProfileId: string) {
    return prisma.subscription.findUnique({
      where: { businessProfileId }
    });
  }

  static async getSubscriptionByStripeId(stripeSubscriptionId: string) {
    return prisma.subscription.findFirst({
      where: { stripeSubscriptionId }
    });
  }

  // Usage tracking methods
  static async incrementUsageCount(
    businessProfileId: string,
    type: 'profileViews' | 'searches' | 'jobPosts'
  ) {
    const field = type === 'profileViews' ? 'profileViewsCount' :
                  type === 'searches' ? 'profileSearchCount' :
                  'jobPostsCount';

    return prisma.subscription.update({
      where: { businessProfileId },
      data: {
        [field]: {
          increment: 1
        }
      }
    });
  }

  static async resetUsageCounts(businessProfileId: string) {
    return prisma.subscription.update({
      where: { businessProfileId },
      data: {
        profileViewsCount: 0,
        profileSearchCount: 0,
        jobPostsCount: 0,
        lastProfileViewsReset: new Date(),
        lastProfileSearchReset: new Date(),
        lastJobPostsReset: new Date()
      }
    });
  }
} 