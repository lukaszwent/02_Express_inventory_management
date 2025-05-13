export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: OrderItem[],
    public readonly totalAmount: number,
    public readonly createdAt: Date = new Date()
  ) {}
}
