import { DataSource } from "typeorm";
import { OrderEntity } from "./entities/Orders";
import { ProductEntity } from "./entities/Products";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGODB_URI,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  entities: [ProductEntity, OrderEntity],
  synchronize: true,
  logging: false,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

export class MongoDBConnection {
  static async initialize(): Promise<void> {
    let retries = 5;
    while (retries) {
      try {
        await AppDataSource.initialize();
        console.log("MongoDB connected successfully");
        break;
      } catch (error) {
        console.error("MongoDB connection error:", error);
        retries -= 1;
        console.log(`Retries left: ${retries}`);
        await new Promise((res) => setTimeout(res, 5000));
      }
    }
    if (!retries) {
      throw new Error("Failed to connect to MongoDB");
    }
  }

  static async disconnect(): Promise<void> {
    await AppDataSource.destroy();
  }
}
