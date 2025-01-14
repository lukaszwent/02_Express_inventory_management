import { ICommand } from "../../../interfaces/command.interface";

export class SellProductCommand implements ICommand {
  readonly type = "SellProduct";

  constructor(
    public readonly productId: string,
    public readonly quantity: number
  ) {}
}
