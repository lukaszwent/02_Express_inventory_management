import { ICommand } from "./command.interface";
import { ICommandHandler } from "./command-handler.interface";

export interface ICommandBus {
  registerHandler<T extends ICommand>(
    commandType: string,
    handler: ICommandHandler<T>
  ): void;
  execute<T extends ICommand>(command: T): Promise<any>;
}
