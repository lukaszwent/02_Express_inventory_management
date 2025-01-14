import { injectable } from "inversify";
import { Order } from "../../../domain/models/order.model";
import { AppDataSource } from "../mongodb.connection";
import { IOrderRepository } from "./interfaces/order-repository.interface";
import { OrderEntity } from "../entities/Orders";

@injectable()
export class OrderRepository implements IOrderRepository {
  private repository = AppDataSource.getMongoRepository(OrderEntity);

  async create(order: Order): Promise<void> {
    const entity = this.repository.create({
      id: order.id,
      customerId: order.customerId,
      items: order.items,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    });

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Order | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;

    return new Order(
      entity.id,
      entity.customerId,
      entity.items,
      entity.totalAmount,
      entity.createdAt
    );
  }
}
