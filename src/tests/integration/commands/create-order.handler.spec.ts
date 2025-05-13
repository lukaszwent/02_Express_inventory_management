import { CreateOrderCommand } from "../../../application/commands/impl/orders/create-order.command";
import { Product } from "../../../domain/models/product.model";
import { Container } from "inversify";
import { TYPES } from "../../../types";
import { CreateOrderCommandHandler } from "../../../application/commands/handlers/order-handlers/create-order.handler";

describe("CreateOrderCommandHandler", () => {
  let handler: CreateOrderCommandHandler;
  let mockProductRepository: any;
  let mockOrderRepository: any;
  let container: Container;

  beforeEach(() => {
    container = new Container();

    mockProductRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };

    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };

    container
      .bind(TYPES.ProductRepository)
      .toConstantValue(mockProductRepository);
    container.bind(TYPES.OrderRepository).toConstantValue(mockOrderRepository);
    container.bind(CreateOrderCommandHandler).toSelf();

    handler = container.get(CreateOrderCommandHandler);
  });

  it("should fail when ordering more items than available stock", async () => {
    const product = new Product("1", "Test Product", "Description", 100, 5);
    mockProductRepository.findById.mockResolvedValue(product);

    const command = new CreateOrderCommand("customer1", [
      {
        productId: "1",
        quantity: 6,
      },
    ]);

    await expect(handler.handle(command)).rejects.toThrow("Insufficient stock");
  });

  it("should successfully create order and update product stock", async () => {
    const product = new Product("1", "Test Product", "Description", 100, 5);
    mockProductRepository.findById.mockResolvedValue(product);

    const command = new CreateOrderCommand("customer1", [
      {
        productId: "1",
        quantity: 3,
      },
    ]);

    const orderId = await handler.handle(command);

    expect(orderId).toBeDefined();
    expect(mockOrderRepository.create).toHaveBeenCalled();
    expect(mockProductRepository.update).toHaveBeenCalled();
    expect(product.stock).toBe(2);
  });
});
