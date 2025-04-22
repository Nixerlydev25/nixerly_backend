import Stripe from 'stripe';
import { PrismaClient, SubscriptionTier } from '@prisma/client';
import { config } from '../config/stripe.config';

const prisma = new PrismaClient();
const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-03-31.basil',
});

export class StripeService {
  static async createCheckoutSession(userId: string, priceId: string, planType: SubscriptionTier) {
    try {
      // Get or create Stripe customer
      const user = await prisma.users.findUnique({ 
        where: { id: userId },
        include: { subscription: true }
      });

      if (!user) throw new Error('User not found');

      let customerId = user.subscription?.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${config.clientUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.clientUrl}/subscription/cancel`,
        metadata: {
          userId,
          planType,
        },
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  static async handleWebhook(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await this.handleSuccessfulSubscription(
            session.metadata?.userId as string,
            session.customer as string,
            session.subscription as string,
            session.metadata?.planType as SubscriptionTier
          );
          break;
        }
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await this.handleCancelledSubscription(subscription.metadata.userId);
          break;
        }
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  private static async handleSuccessfulSubscription(
    userId: string,
    customerId: string,
    subscriptionId: string,
    planType: SubscriptionTier
  ) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;

    // Calculate subscription end date (30 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Update or create subscription in database
    await prisma.subscription.upsert({
      where: { userId },
      update: {
        type: planType,
        stripeCustomerId: customerId,
        stripePriceId: priceId,
        stripeSubscriptionId: subscriptionId,
        isActive: true,
        endDate,
        dailyLimit: this.getDailyLimitByPlan(planType),
      },
      create: {
        userId,
        type: planType,
        stripeCustomerId: customerId,
        stripePriceId: priceId,
        stripeSubscriptionId: subscriptionId,
        isActive: true,
        endDate,
        dailyLimit: this.getDailyLimitByPlan(planType),
      },
    });
  }

  private static async handleCancelledSubscription(userId: string) {
    await prisma.subscription.update({
      where: { userId },
      data: {
        isActive: false,
        type: 'FREE',
        dailyLimit: this.getDailyLimitByPlan('FREE'),
      },
    });
  }

  private static getDailyLimitByPlan(planType: SubscriptionTier): number {
    switch (planType) {
      case 'FREE':
        return 5;
      case 'BASIC':
        return 50;
      case 'PREMIUM':
        return 100;
      default:
        return 5;
    }
  }
}
