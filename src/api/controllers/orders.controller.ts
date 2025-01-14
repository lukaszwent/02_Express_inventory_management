import { injectable, inject } from "inversify";
import { CreateOrderCommand } from "../../application/commands/impl/orders/create-order.command";
import { InvalidInputError } from "../../domain/exceptions/app-errors";
import { createOrderSchema } from "../../infrastructure/validation/schemas/order.schema";
import { Request, Response } from "express";
import { TYPES } from "../../types";
import { ICommandBus } from "../../application/interfaces/command-bus.interface";

@injectable()
export class OrdersController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: ICommandBus
  ) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    const { error, value } = createOrderSchema.validate(req.body);
    if (error) {
      throw new InvalidInputError(error.details[0].message);
    }

    const command = new CreateOrderCommand(value.customerId, value.products);
    const orderId = await this.commandBus.execute(command);

    res.status(201).json({ id: orderId });
  }
}
