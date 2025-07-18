// import { Router } from "express";
// import { createCheckoutSession, handleWebhook } from "../../controllers/subscription.controller";
// import deserializeUser from "../../middleware/deserializeUsers";
// import isAuthorized from "../../middleware/isAuthorized";
// import { Role } from "@prisma/client";
// import express from "express";
// import { ROUTES } from "../../constants/routes.constants";

// const router = Router();

// // This endpoint requires authentication and business role
// router.post(
//   ROUTES.SUBSCRIPTION.CREATE_CHECKOUT_SESSION,
//   isAuthorized([Role.BUSINESS]),
//   createCheckoutSession
// );

// // Webhook endpoint - needs raw body for signature verification
// router.post(
//   ROUTES.SUBSCRIPTION.HANDLE_WEBHOOK,
//   handleWebhook
// );

// export default router; 