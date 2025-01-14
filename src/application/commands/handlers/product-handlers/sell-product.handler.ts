import { injectable, inject } from "inversify";
import {
  ResourceNotFoundError,
  InsufficientStockError,
} from "../../../../domain/exceptions/app-errors";
import { ICommandHandler } from "../../../interfaces/command-handler.interface";
import { SellProductCommand } from "../../impl/products/sell-product.command";
import { TYPES } from "../../../../types";
import { IProductRepository } from "../../../../infrastructure/database/repositories/interfaces/product-repository.interface";

@injectable()
export class SellProductCommandHandler
  implements ICommandHandler<SellProductCommand>
{
  constructor(
    @inject(TYPES.ProductRepository)
    private productRepository: IProductRepository
  ) {}

  async handle(command: SellProductCommand): Promise<void> {
    const product = await this.productRepository.findById(command.productId);
    if (!product) {
      throw new ResourceNotFoundError(
        `Product with id ${command.productId} not found`
      );
    }

    if (!product.canSell(command.quantity)) {
      throw new InsufficientStockError(
        `Insufficient stock. Available: ${product.stock}, Requested: ${command.quantity}`
      );
    }

    product.decreaseStock(command.quantity);
    await this.productRepository.update(product);
  }
}
