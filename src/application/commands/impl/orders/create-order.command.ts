import { ICommand } from "../../../interfaces/command.interface";

export interface OrderProductItem {
  productId: string;
  quantity: number;
}

export class CreateOrderCommand implements ICommand {
  readonly type = "CreateOrder";

  constructor(
    public readonly customerId: string,
    public readonly products: OrderProductItem[]
  ) {}
}
