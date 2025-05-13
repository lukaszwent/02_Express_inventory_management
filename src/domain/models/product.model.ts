export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    private _price: number,
    private _stock: number
  ) {
    this.validatePrice(_price);
  }

  private validatePrice(price: number): void {
    if (price <= 0) {
      throw new Error("Price must be positive");
    }
  }

  get price(): number {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  canSell(quantity: number): boolean {
    return this._stock >= quantity;
  }

  decreaseStock(quantity: number): void {
    if (!this.canSell(quantity)) {
      throw new Error("Insufficient stock");
    }
    this._stock -= quantity;
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Stock increase quantity must be positive");
    }
    this._stock += quantity;
  }
}
