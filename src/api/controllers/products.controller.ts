import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { InvalidInputError } from "../../domain/exceptions/app-errors";
import { CreateProductCommand } from "../../application/commands/impl/products/create-product.command";
import { RestockProductCommand } from "../../application/commands/impl/products/restock-product.command";
import { SellProductCommand } from "../../application/commands/impl/products/sell-product.command";
import { GetAllProductsQuery } from "../../application/queries/impl/products/get-all-products.query";
import {
  createProductSchema,
  restockProductSchema,
  sellProductSchema,
} from "../../infrastructure/validation/schemas/product.schema";
import { Product } from "../../domain/models/product.model";
import { TYPES } from "../../types";
import { ICommandBus } from "../../application/interfaces/command-bus.interface";
import { IQueryBus } from "../../application/interfaces/query-bus.interface";

@injectable()
export class ProductsController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: ICommandBus,
    @inject(TYPES.QueryBus) private readonly queryBus: IQueryBus
  ) {}

  async getAllProducts(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const query = new GetAllProductsQuery(page, limit);
    const products: Product[] = await this.queryBus.execute(query);

    res.json({
      data: products,
      page,
      limit,
      total: products.length,
    });
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const { error, value } = createProductSchema.validate(req.body);
    if (error) {
      throw new InvalidInputError(error.details[0].message);
    }

    const command = new CreateProductCommand(
      value.name,
      value.description,
      value.price,
      value.stock
    );

    const productId = await this.commandBus.execute(command);
    res.status(201).json({ id: productId });
  }

  async restockProduct(req: Request, res: Response): Promise<void> {
    const { error, value } = restockProductSchema.validate(req.body);
    if (error) {
      throw new InvalidInputError(error.details[0].message);
    }

    const command = new RestockProductCommand(req.params.id, value.quantity);
    await this.commandBus.execute(command);

    res.json({ message: "Product restocked successfully" });
  }

  async sellProduct(req: Request, res: Response): Promise<void> {
    const { error, value } = sellProductSchema.validate(req.body);
    if (error) {
      throw new InvalidInputError(error.details[0].message);
    }

    const command = new SellProductCommand(req.params.id, value.quantity);
    await this.commandBus.execute(command);

    res.json({ message: "Product sold successfully" });
  }
}
