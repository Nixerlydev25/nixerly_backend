import { Router } from "express";
const healthRouter = Router();

import { Request, Response } from "express";

import prisma from "../../config/prisma.config";

healthRouter.get("/", async (_: Request, response: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.status(200).json({
      server: "healthy",
      database: "connected",
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      server: "healthy",
      database: "disconnected",
      message: "Database connection failed",
    });
  }
});

export default healthRouter;
