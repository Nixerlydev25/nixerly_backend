import path from "path";
import cors from "cors";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import Api1 from "./routes/v1/global.router";

import { corsOptions } from "./config/cors.config";
import deserializeUser from "./middleware/deserializeUsers";
import { swaggerOptions } from "./config/swagger.config";
import { environment } from "./types/global";
import errorHandler from "./middleware/errorrHandler";

const IS_DEVELOPMENT = process.env.NODE_ENV === environment.DEVELOPMENT;

dotenv.config();

const app: Express = express();

app.use(cookieParser());
app.use(express.json());
app.use(morgan("combined"));

app.use(deserializeUser);
app.use(cors(corsOptions));

if (IS_DEVELOPMENT) {
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

console.log(process.env.CLIENT_SERVER_2)

// api versioning.
app.use("/v1", Api1);
app.use("/static", express.static(path.join(__dirname, "public")));

// global error handling.
app.use(errorHandler);

export default app;
