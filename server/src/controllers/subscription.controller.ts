// import { Request, Response } from "express";
// import { stripe } from "../config/stripe.config";
// import { SubscriptionService } from "../services/subscription.service";
// import { isValidPlan } from "../config/subscription.config";

// export const createCheckoutSession = async (req: Request, res: Response) => {
//   try {
//     const { plan } = req.body;
//     const { userId } = req.user;

//     // Validate plan
//     if (!plan || !isValidPlan(plan)) {
//       return res.status(400).json({ message: "Invalid subscription plan" });
//     }

//     const session = await SubscriptionService.createCheckoutSession(userId, plan);
//     res.json({ url: session.url });
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     res.status(500).json({ message: "Error creating checkout session" });
//   }
// };

// export const handleWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers["stripe-signature"] as string;

//   try {
//     const event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );

//     switch (event.type) {
//       case "checkout.session.completed": {
//         await SubscriptionService.handleCheckoutSessionCompleted(event.data.object);
//         break;
//       }

//       case "customer.subscription.updated": {
//         await SubscriptionService.handleSubscriptionUpdated(event.data.object);
//         break;
//       }

//       case "customer.subscription.deleted": {
//         await SubscriptionService.handleSubscriptionDeleted(event.data.object);
//         break;
//       }
//     }

//     res.json({ received: true });
//   } catch (error) {
//     console.error("Error handling webhook:", error);
//     res.status(400).json({ message: "Webhook error" });
//   }
// };
