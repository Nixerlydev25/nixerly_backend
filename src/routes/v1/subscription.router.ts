import { Router } from 'express';
import { SubscriptionController } from '../../controllers/subscription.controller';
import express from 'express';

const router = Router();

// Create checkout session for subscription
router.post(
  '/create-checkout-session',
  SubscriptionController.createCheckoutSession
);

// Handle Stripe webhook
router.post(
  '/webhook',
  SubscriptionController.handleWebhook
);

// Get current user's subscription
router.get(
  '/current',
  SubscriptionController.getCurrentSubscription
);

// Cancel subscription
router.post(
  '/cancel',
  SubscriptionController.cancelSubscription
);

export default router; 