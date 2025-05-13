import { Product } from "../../../../domain/models/product.model";

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  findAll(page?: number, limit?: number): Promise<Product[]>;
}
