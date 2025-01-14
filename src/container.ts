import { Container } from "inversify";
import { CommandBus } from "./application/command-bus";
import { QueryBus } from "./application/query-bus";
import { ProductsController } from "./api/controllers/products.controller";
import { OrdersController } from "./api/controllers/orders.controller";
import { CreateOrderCommandHandler } from "./application/commands/handlers/order-handlers/create-order.handler";
import { CreateProductCommandHandler } from "./application/commands/handlers/product-handlers/create-product.handler";
import { SellProductCommandHandler } from "./application/commands/handlers/product-handlers/sell-product.handler";
import { GetAllProductsQueryHandler } from "./application/queries/handlers/product-handlers/get-all-products.handler";
import { RestockProductCommandHandler } from "./application/commands/handlers/product-handlers/restock-product.handler";
import { TYPES } from "./types";
import { ProductRepository } from "./infrastructure/database/repositories/ProductRepository";
import { OrderRepository } from "./infrastructure/database/repositories/OrderRepository";
import { IQueryBus } from "./application/interfaces/query-bus.interface";
import { ICommandBus } from "./application/interfaces/command-bus.interface";

const container = new Container();

// Repositories
container
  .bind(TYPES.ProductRepository)
  .to(ProductRepository)
  .inSingletonScope();
container.bind(TYPES.OrderRepository).to(OrderRepository).inSingletonScope();

// Buses
container.bind(TYPES.CommandBus).to(CommandBus).inSingletonScope();
container.bind(TYPES.QueryBus).to(QueryBus).inSingletonScope();

// Controllers
container.bind(ProductsController).toSelf();
container.bind(OrdersController).toSelf();

// Command Handlers
container.bind(CreateProductCommandHandler).toSelf();
container.bind(RestockProductCommandHandler).toSelf();
container.bind(SellProductCommandHandler).toSelf();
container.bind(CreateOrderCommandHandler).toSelf();

// Query Handlers
container.bind(GetAllProductsQueryHandler).toSelf();

// Register command handlers
const commandBus = container.get<ICommandBus>(TYPES.CommandBus);
commandBus.registerHandler(
  "CreateProduct",
  container.get(CreateProductCommandHandler)
);
commandBus.registerHandler(
  "RestockProduct",
  container.get(RestockProductCommandHandler)
);
commandBus.registerHandler(
  "SellProduct",
  container.get(SellProductCommandHandler)
);
commandBus.registerHandler(
  "CreateOrder",
  container.get(CreateOrderCommandHandler)
);

// Register query handlers
const queryBus = container.get<IQueryBus>(TYPES.QueryBus);
queryBus.registerHandler(
  "GetAllProducts",
  container.get(GetAllProductsQueryHandler)
);

export { container };
