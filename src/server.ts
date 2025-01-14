import "reflect-metadata";
import express, { Application } from "express";
import { json } from "body-parser";
import cors from "cors";
import { errorHandler } from "./api/middleware/error-handler.middleware";
import { MongoDBConnection } from "./infrastructure/database/mongodb.connection";
import dotenv from "dotenv";
import router from "./api/routes";

export class Server {
  private app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  public getApp(): Application {
    return this.app;
  }

  private setupMiddleware(): void {
    this.app.use(json());
    this.app.use(cors());
  }

  private setupRoutes(): void {
    this.app.use("/api", router);
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  async start(): Promise<void> {
    try {
      dotenv.config();

      await MongoDBConnection.initialize();

      const port = process.env.PORT || 3000;
      this.app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const server = new Server();
  server.start().catch((error) => {
    console.error("Failed to start application:", error);
    process.exit(1);
  });
}
