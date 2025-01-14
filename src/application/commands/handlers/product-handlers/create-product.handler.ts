import { inject, injectable } from "inversify";
import { ICommandHandler } from "../../../interfaces/command-handler.interface";
import { CreateProductCommand } from "../../impl/products/create-product.command";
import { Product } from "../../../../domain/models/product.model";
import { v4 as uuidv4 } from "uuid";
import { TYPES } from "../../../../types";
import { IProductRepository } from "../../../../infrastructure/database/repositories/interfaces/product-repository.interface";

@injectable()
export class CreateProductCommandHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @inject(TYPES.ProductRepository)
    private productRepository: IProductRepository
  ) {}

  async handle(command: CreateProductCommand): Promise<string> {
    const productId = uuidv4();

    const product = new Product(
      productId,
      command.name,
      command.description,
      command.price,
      command.stock
    );

    await this.productRepository.create(product);
    return productId;
  }
}
