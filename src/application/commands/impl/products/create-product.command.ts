import { ICommand } from "../../../interfaces/command.interface";

export class CreateProductCommand implements ICommand {
  readonly type = "CreateProduct";

  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly stock: number
  ) {}
}
