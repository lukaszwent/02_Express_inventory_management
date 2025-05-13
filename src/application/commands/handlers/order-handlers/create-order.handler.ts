import { injectable, inject } from "inversify";
import { v4 as uuidv4 } from "uuid";
import {
  ResourceNotFoundError,
  InsufficientStockError,
} from "../../../../domain/exceptions/app-errors";
import { OrderItem, Order } from "../../../../domain/models/order.model";
import { Product } from "../../../../domain/models/product.model";
import { ICommandHandler } from "../../../interfaces/command-handler.interface";
import { CreateOrderCommand } from "../../impl/orders/create-order.command";
import { TYPES } from "../../../../types";
import { IOrderRepository } from "../../../../infrastructure/database/repositories/interfaces/order-repository.interface";
import { IProductRepository } from "../../../../infrastructure/database/repositories/interfaces/product-repository.interface";

@injectable()
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(
    @inject(TYPES.ProductRepository)
    private productRepository: IProductRepository,
    @inject(TYPES.OrderRepository) private orderRepository: IOrderRepository
  ) {}

  async handle(command: CreateOrderCommand): Promise<string> {
    const orderItems: OrderItem[] = [];
    const productUpdates: Product[] = [];

    // Validate and process all products
    for (const item of command.products) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new ResourceNotFoundError(
          `Product with id ${item.productId} not found`
        );
      }

      if (!product.canSell(item.quantity)) {
        throw new InsufficientStockError(
          `Insufficient stock for product ${item.productId}. Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }

      product.decreaseStock(item.quantity);
      productUpdates.push(product);

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const orderId = uuidv4();
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order(
      orderId,
      command.customerId,
      orderItems,
      totalAmount
    );

    // Update all products and create order
    await Promise.all([
      ...productUpdates.map((product) =>
        this.productRepository.update(product)
      ),
      this.orderRepository.create(order),
    ]);

    return orderId;
  }
}
