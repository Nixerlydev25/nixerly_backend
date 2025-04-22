import { Router } from "express";
import authRouter from "./auth.router";
import otpRouter from "./opt.router";
import roleRouter from "./role.router";
import restrictionsRouter from "./restrictions.router";
import userRouter from "./user.router";
import healthRouter from "./health.router";
import subscriptionRouter from "./subscription.router";

const Api2 = Router();
// authentication. 
//TODO : unit test.
Api2.use("/auth", authRouter);

// otp routes
//TODO : unit test.
Api2.use("/otp", otpRouter);

// roles routes
Api2.use("/roles", roleRouter);

// Notification router for sending and saving notifications
Api2.use("/restrictions", restrictionsRouter);

Api2.use("/user", userRouter);

// health route for server status
//TODO : unit test.
Api2.use("/health", healthRouter);

// subscription routes
Api2.use("/subscription", subscriptionRouter);

export default Api2;
