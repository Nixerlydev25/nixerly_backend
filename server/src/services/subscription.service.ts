// import { stripe } from "../config/stripe.config";
// import { SubscriptionPlan } from "@prisma/client";
// import { SubscriptionModel } from "../model/v1/subscription.model";
// import prisma from "../config/prisma.config";
// import {
//   getPlanPriceId,
//   SUBSCRIPTION_PLANS,
// } from "../config/subscription.config";

// export class SubscriptionService {
//   static async createCheckoutSession(userId: string, plan: SubscriptionPlan) {
//     // Get the business profile with user details
//     const businessProfile = await prisma.businessProfile.findUnique({
//       where: {
//         userId,
//       },
//       include: {
//         user: true,
//         subscription: true,
//       },
//     });

//     if (!businessProfile) {
//       throw new Error("Business profile not found");
//     }

//     // Create or get Stripe customer
//     let stripeCustomerId = businessProfile.subscription?.stripeCustomerId;

//     if (!stripeCustomerId) {
//       const customer = await stripe.customers.create({
//         email: businessProfile.user.email,
//         name:
//           businessProfile.companyName ||
//           `${businessProfile.user.firstName} ${businessProfile.user.lastName}`,
//         metadata: {
//           businessProfileId: businessProfile.id,
//         },
//       });
//       stripeCustomerId = customer.id;
//     }

//     const planDetails = SUBSCRIPTION_PLANS[plan];
//     const priceId = getPlanPriceId(plan);

//     // Create checkout session
//     const session = await stripe.checkout.sessions.create({
//       customer: stripeCustomerId,
//       payment_method_types: ["card"],
//       mode: "subscription",
//       line_items: [
//         {
//           price: priceId,
//           quantity: 1,
//         },
//       ],
//       success_url: `${process.env.CLIENT_SERVER}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_SERVER}/subscription/cancel`,
//       metadata: {
//         businessProfileId: businessProfile.id,
//         plan,
//         features: JSON.stringify(planDetails.features),
//       },
//     });

//     return session;
//   }

//   static async handleCheckoutSessionCompleted(session: any) {
//     const { businessProfileId, plan, features } = session.metadata;
//     const parsedFeatures = JSON.parse(features);

//     try {
//       // Get the subscription details from Stripe
//       const subscription = await stripe.subscriptions.retrieve(session.subscription);

//       await SubscriptionModel.upsertSubscription({
//         businessProfileId,
//         plan,
//         stripeCustomerId: session.customer,
//         stripeSubscriptionId: session.subscription,
//         currentPeriodStart: new Date(subscription.current_period_start * 1000),
//         currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//         status: "ACTIVE",
//         // Reset usage counts when subscription is created/updated
//         profileViewsCount: 0,
//         profileSearchCount: 0,
//         jobPostsCount: 0,
//         // Set the last reset dates to now
//         lastProfileViewsReset: new Date(),
//         lastProfileSearchReset: new Date(),
//         lastJobPostsReset: new Date(),
//       });

//       // Send success email to customer
//       // TODO: Implement email service
//       // await EmailService.sendSubscriptionSuccessEmail(businessProfileId, plan);
//     } catch (error) {
//       console.error("Error handling successful checkout:", error);
//       throw error;
//     }
//   }

//   static async handleCheckoutSessionExpired(session: any) {
//     const { businessProfileId, plan } = session.metadata;

//     try {
//       // Log the expired session
//       console.log(`Checkout session expired for business ${businessProfileId}, plan ${plan}`);

//       // Update subscription status if it exists
//       const existingSubscription = await SubscriptionModel.getSubscriptionByBusinessId(businessProfileId);
//       if (existingSubscription?.stripeSubscriptionId) {
//         await SubscriptionModel.updateSubscription(existingSubscription.stripeSubscriptionId, {
//           status: "UNPAID"
//         });
//       }

//       // TODO: Implement email service
//       // await EmailService.sendCheckoutExpiredEmail(businessProfileId, plan);
//     } catch (error) {
//       console.error("Error handling expired checkout:", error);
//       throw error;
//     }
//   }

//   static async handlePaymentFailed(subscription: any) {
//     try {
//       await SubscriptionModel.updateSubscription(subscription.id, {
//         status: "PAST_DUE",
//       });

//       // Get business profile details
//       const subscriptionData = await SubscriptionModel.getSubscriptionByStripeId(subscription.id);
//       if (!subscriptionData?.businessProfileId) {
//         throw new Error("Business profile not found for failed payment");
//       }

//       // TODO: Implement email service
//       // await EmailService.sendPaymentFailedEmail(subscriptionData.businessProfileId);
//     } catch (error) {
//       console.error("Error handling failed payment:", error);
//       throw error;
//     }
//   }

//   static async handleSubscriptionUpdated(subscription: any) {
//     await SubscriptionModel.updateSubscription(subscription.id, {
//       status: subscription.status.toUpperCase(),
//       currentPeriodStart: new Date(subscription.current_period_start * 1000),
//       currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//       cancelAtPeriodEnd: subscription.cancel_at_period_end,
//     });
//   }

//   static async handleSubscriptionDeleted(subscription: any) {
//     await SubscriptionModel.updateSubscription(subscription.id, {
//       status: "CANCELLED",
//     });
//   }

//   // Helper method to check if a business has exceeded their plan limits
//   static async checkPlanLimits(
//     businessProfileId: string,
//     type: "profileViews" | "searches" | "jobPosts"
//   ): Promise<boolean> {
//     const subscription = await SubscriptionModel.getSubscriptionByBusinessId(
//       businessProfileId
//     );
//     if (!subscription) return false;

//     const planDetails = SUBSCRIPTION_PLANS[subscription.plan];
//     const limit =
//       planDetails.features[
//         type === "profileViews"
//           ? "profileViews"
//           : type === "searches"
//           ? "searches"
//           : "jobPosts"
//       ];

//     if (limit === "unlimited") return true;

//     switch (type) {
//       case "profileViews":
//         return subscription.profileViewsCount < limit;
//       case "searches":
//         return subscription.profileSearchCount < limit;
//       case "jobPosts":
//         return subscription.jobPostsCount < limit;
//     }
//   }
// }
