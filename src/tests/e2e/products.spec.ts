import request from "supertest";
import { Server } from "../../server";
import { MongoDBConnection } from "../../infrastructure/database/mongodb.connection";
import { Application } from "express";

describe("Products API", () => {
  let app: Application;
  let server: Server;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";

    try {
      await MongoDBConnection.initialize();
      server = new Server();
      app = server.getApp();
    } catch (error) {
      console.error("Test setup failed:", error);
      throw error;
    }
  }, 30000);

  afterAll(async () => {
    await MongoDBConnection.disconnect();
  }, 30000);

  describe("POST /api/products", () => {
    it("should create a new product", async () => {
      const response = await request(app).post("/api/products").send({
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 5,
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
    });

    it("should validate product input", async () => {
      const response = await request(app).post("/api/products").send({
        name: "", // Invalid
        description: "Test",
        price: -100, // Invalid
        stock: 5,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });
});
