import { ICommand } from "../../../interfaces/command.interface";

export class RestockProductCommand implements ICommand {
  readonly type = "RestockProduct";

  constructor(
    public readonly productId: string,
    public readonly quantity: number
  ) {}
}
