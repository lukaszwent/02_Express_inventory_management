import { injectable } from "inversify";
import { Product } from "../../../domain/models/product.model";
import { AppDataSource } from "../mongodb.connection";
import { ResourceNotFoundError } from "../../../domain/exceptions/app-errors";
import { IProductRepository } from "./interfaces/product-repository.interface";
import { ProductEntity } from "../entities/Products";

@injectable()
export class ProductRepository implements IProductRepository {
  private repository = AppDataSource.getMongoRepository(ProductEntity);

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;

    return new Product(
      entity.id,
      entity.name,
      entity.description,
      entity.price,
      entity.stock
    );
  }

  async create(product: Product): Promise<void> {
    const entity = this.repository.create({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.repository.save(entity);
  }

  async update(product: Product): Promise<void> {
    const result = await this.repository.updateOne(
      { id: product.id },
      {
        $set: {
          stock: product.stock,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new ResourceNotFoundError(
        `Product with id ${product.id} not found`
      );
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Product[]> {
    const entities = await this.repository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return entities.map(
      (entity) =>
        new Product(
          entity.id,
          entity.name,
          entity.description,
          entity.price,
          entity.stock
        )
    );
  }
}
