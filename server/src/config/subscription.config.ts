import { SubscriptionPlan } from "@prisma/client";

interface PlanDetails {
  price: number;
  productId: string;
  features: {
    profileViews: number | 'unlimited';
    searches: number | 'unlimited';
    jobPosts: number;
  };
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, PlanDetails> = {
  CORE: {
    price: 95,
    productId: 'nixerly-core',
    features: {
      profileViews: 50,
      searches: 10,
      jobPosts: 0
    }
  },
  TEAM: {
    price: 195,
    productId: 'nixerly-team',
    features: {
      profileViews: 'unlimited',
      searches: 'unlimited',
      jobPosts: 5
    }
  },
  ENTERPRISE: {
    price: 495,
    productId: 'nixerly-enterprise',
    features: {
      profileViews: 'unlimited',
      searches: 'unlimited',
      jobPosts: 10
    }
  },
  FREE: {
    price: 0,
    productId: 'nixerly-free',
    features: {
      profileViews: 5,
      searches: 2,
      jobPosts: 0
    }
  }
};

// Helper function to get plan price ID from environment variables
export const getPlanPriceId = (plan: SubscriptionPlan): string => {
  const priceId = process.env[`STRIPE_${plan}_PRICE_ID`];
  if (!priceId) {
    throw new Error(`Price ID not found for plan ${plan}`);
  }
  return priceId;
};

// Helper function to validate plan
export const isValidPlan = (plan: string): plan is SubscriptionPlan => {
  return Object.keys(SUBSCRIPTION_PLANS).includes(plan);
}; 