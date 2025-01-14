import "reflect-metadata";
import { container } from "../container";

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  // Reset container
  container.unbindAll();
});
