import { injectable } from "inversify";
import { ICommandBus } from "./interfaces/command-bus.interface";
import { ICommand } from "./interfaces/command.interface";
import { ICommandHandler } from "./interfaces/command-handler.interface";

@injectable()
export class CommandBus implements ICommandBus {
  private handlers = new Map<string, ICommandHandler<any>>();

  registerHandler<T extends ICommand>(
    commandType: string,
    handler: ICommandHandler<T>
  ): void {
    this.handlers.set(commandType, handler);
  }

  async execute<T extends ICommand>(command: T): Promise<any> {
    const handler = this.handlers.get(command.type);
    if (!handler) {
      throw new Error(`No handler found for command ${command.type}`);
    }
    return handler.handle(command);
  }
}
