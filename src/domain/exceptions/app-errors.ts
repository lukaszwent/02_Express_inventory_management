export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidInputError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class InsufficientStockError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
