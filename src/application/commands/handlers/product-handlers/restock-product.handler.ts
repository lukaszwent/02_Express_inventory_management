import { injectable, inject } from "inversify";
import { ICommandHandler } from "../../../interfaces/command-handler.interface";
import { RestockProductCommand } from "../../impl/products/restock-product.command";
import { TYPES } from "../../../../types";
import { IProductRepository } from "../../../../infrastructure/database/repositories/interfaces/product-repository.interface";

@injectable()
export class RestockProductCommandHandler
  implements ICommandHandler<RestockProductCommand>
{
  constructor(
    @inject(TYPES.ProductRepository)
    private productRepository: IProductRepository
  ) {}

  async handle(command: RestockProductCommand): Promise<void> {
    const product = await this.productRepository.findById(command.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    product.increaseStock(command.quantity);
    await this.productRepository.update(product);
  }
}
