import { Order } from "../../../../domain/models/order.model";

export interface IOrderRepository {
  create(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
}
