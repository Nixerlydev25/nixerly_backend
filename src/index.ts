import * as http from "http";

import app from "./app";
import prisma from "./config/prisma.config";

const PORT = process.env.PORT || 8000;

const httpServer: http.Server = http.createServer(app);

async function startServer(): Promise<void> {
  httpServer.listen(PORT, () => {
    console.log("listening to server on", PORT);
  });
}

startServer();

httpServer.on("close", async () => {
  await prisma.$disconnect();
});
