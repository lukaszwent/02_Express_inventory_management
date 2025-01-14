import { IQuery } from "./qurey.interface";
import { IQueryHandler } from "./query-handler.interface";

export interface IQueryBus {
  registerHandler<TQuery extends IQuery, TResult>(
    queryType: string,
    handler: IQueryHandler<TQuery, TResult>
  ): void;
  execute<TQuery extends IQuery, TResult>(query: TQuery): Promise<TResult>;
}
