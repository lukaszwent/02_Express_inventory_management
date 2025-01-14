import { IQuery } from "../../../interfaces/qurey.interface";

export class GetAllProductsQuery implements IQuery {
  readonly type = "GetAllProducts";

  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10
  ) {}
}
