import { Request, Response } from 'express';
import { StripeService } from '../services/stripe.service';
import { PrismaClient, SubscriptionTier } from '@prisma/client';
import Stripe from 'stripe';
import { config } from '../config/stripe.config';

const prisma = new PrismaClient();
const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-03-31.basil',
});

export class SubscriptionController {
  static async createCheckoutSession(req: Request, res: Response) {
    try {
      const { priceId, planType } = req.body;
      const {userId} = req?.user

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const session = await StripeService.createCheckoutSession(userId, priceId, planType as SubscriptionTier);
      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ message: 'Error creating checkout session' });
    }
  }

  static async handleWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        config.stripe.webhookSecret
      );

      await StripeService.handleWebhook(event);
      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ message: 'Webhook error' });
    }
  }

  static async getCurrentSubscription(req: Request, res: Response) {
    try {
      const {userId} = req.user;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      res.json(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      res.status(500).json({ message: 'Error fetching subscription' });
    }
  }

  static async cancelSubscription(req: Request, res: Response) {
    try {
      const {userId} = req.user;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (!subscription?.stripeSubscriptionId) {
        return res.status(404).json({ message: 'No active subscription found' });
      }

      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      
      await prisma.subscription.update({
        where: { userId },
        data: {
          isActive: false,
          type: 'FREE',
        },
      });

      res.json({ message: 'Subscription cancelled successfully' });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({ message: 'Error cancelling subscription' });
    }
  }
} 