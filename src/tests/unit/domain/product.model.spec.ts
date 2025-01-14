import { Product } from "../../../domain/models/product.model";

describe("Product", () => {
  describe("stock operations", () => {
    it("should not allow negative stock when selling", () => {
      const product = new Product("1", "Test Product", "Description", 100, 5);

      expect(() => product.decreaseStock(6)).toThrow("Insufficient stock");
    });

    it("should not allow negative quantity when restocking", () => {
      const product = new Product("1", "Test Product", "Description", 100, 5);

      expect(() => product.increaseStock(-1)).toThrow(
        "Stock increase quantity must be positive"
      );
    });
  });

  describe("price validation", () => {
    it("should not allow negative or zero price", () => {
      expect(() => new Product("1", "Test", "Description", 0, 5)).toThrow(
        "Price must be positive"
      );

      expect(() => new Product("1", "Test", "Description", -10, 5)).toThrow(
        "Price must be positive"
      );
    });
  });
});
