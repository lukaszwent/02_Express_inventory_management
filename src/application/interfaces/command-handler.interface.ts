import { ICommand } from "./command.interface";

export interface ICommandHandler<T extends ICommand> {
  handle(command: T): Promise<any>;
}
