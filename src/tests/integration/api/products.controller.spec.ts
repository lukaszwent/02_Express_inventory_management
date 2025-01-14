import { ProductsController } from "../../../api/controllers/products.controller";
import { Container } from "inversify";
import { TYPES } from "../../../types";
import { ICommandBus } from "../../../application/interfaces/command-bus.interface";
import { IQueryBus } from "../../../application/interfaces/query-bus.interface";
import { Request, Response } from "express";

describe("ProductsController", () => {
  let controller: ProductsController;
  let commandBus: jest.Mocked<ICommandBus>;
  let queryBus: jest.Mocked<IQueryBus>;
  let testContainer: Container;

  beforeEach(() => {
    testContainer = new Container();

    commandBus = {
      execute: jest.fn(),
      registerHandler: jest.fn(),
    };

    queryBus = {
      execute: jest.fn(),
      registerHandler: jest.fn(),
    };

    testContainer.bind(TYPES.CommandBus).toConstantValue(commandBus);
    testContainer.bind(TYPES.QueryBus).toConstantValue(queryBus);
    testContainer.bind(ProductsController).toSelf();

    controller = testContainer.get(ProductsController);
  });

  describe("createProduct", () => {
    it("should validate input before creating product", async () => {
      const req = {
        body: {
          name: "",
          description: "Test",
          price: 100,
          stock: 5,
        },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await expect(controller.createProduct(req, res)).rejects.toThrow(
        "Name is required"
      );

      expect(commandBus.execute).not.toHaveBeenCalled();
    });

    it("should handle successful product creation", async () => {
      const req = {
        body: {
          name: "Test Product",
          description: "Test Description",
          price: 100,
          stock: 5,
        },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const productId = "123";
      commandBus.execute.mockResolvedValue(productId);

      await controller.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: productId });
    });
  });
});
