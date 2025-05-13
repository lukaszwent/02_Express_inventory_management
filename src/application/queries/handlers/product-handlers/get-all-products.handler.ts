import { inject, injectable } from "inversify";
import { IQueryHandler } from "../../../interfaces/query-handler.interface";
import { Product } from "../../../../domain/models/product.model";
import { GetAllProductsQuery } from "../../impl/products/get-all-products.query";
import { TYPES } from "../../../../types";
import { IProductRepository } from "../../../../infrastructure/database/repositories/interfaces/product-repository.interface";

@injectable()
export class GetAllProductsQueryHandler
  implements IQueryHandler<GetAllProductsQuery, Product[]>
{
  constructor(
    @inject(TYPES.ProductRepository)
    private productRepository: IProductRepository
  ) {}

  async handle(query: GetAllProductsQuery): Promise<Product[]> {
    return this.productRepository.findAll(query.page, query.limit);
  }
}
