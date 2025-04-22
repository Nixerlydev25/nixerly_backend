export const config = {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    },
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    // Add price IDs for each plan
    stripePriceIds: {
      basic: {
        monthly: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID || '',
        yearly: process.env.STRIPE_BASIC_YEARLY_PRICE_ID || '',
      },
      premium: {
        monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || '',
        yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || '',
      },
    },
  }; 