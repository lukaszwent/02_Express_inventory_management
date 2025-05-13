import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { container } from "../../container";
import { ProductsController } from "../controllers/products.controller";
import { OrdersController } from "../controllers/orders.controller";

const router = Router();

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

const productsController =
  container.get<ProductsController>(ProductsController);
const ordersController = container.get<OrdersController>(OrdersController);

// Product routes
router.get(
  "/products",
  asyncHandler((req: Request, res: Response) =>
    productsController.getAllProducts(req, res)
  )
);
router.post(
  "/products",
  asyncHandler((req: Request, res: Response) =>
    productsController.createProduct(req, res)
  )
);
router.post(
  "/products/:id/restock",
  asyncHandler((req: Request, res: Response) =>
    productsController.restockProduct(req, res)
  )
);
router.post(
  "/products/:id/sell",
  asyncHandler((req: Request, res: Response) =>
    productsController.sellProduct(req, res)
  )
);

// Order routes
router.post(
  "/orders",
  asyncHandler((req: Request, res: Response) =>
    ordersController.createOrder(req, res)
  )
);

export default router;
