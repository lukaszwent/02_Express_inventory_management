import { injectable } from "inversify";
import { IQueryHandler } from "./interfaces/query-handler.interface";
import { IQuery } from "./interfaces/qurey.interface";
import { IQueryBus } from "./interfaces/query-bus.interface";

@injectable()
export class QueryBus implements IQueryBus {
  private handlers = new Map<string, IQueryHandler<any, any>>();

  registerHandler<TQuery extends IQuery, TResult>(
    queryType: string,
    handler: IQueryHandler<TQuery, TResult>
  ): void {
    this.handlers.set(queryType, handler);
  }

  async execute<TQuery extends IQuery, TResult>(
    query: TQuery
  ): Promise<TResult> {
    const handler = this.handlers.get(query.type);
    if (!handler) {
      throw new Error(`No handler found for query ${query.type}`);
    }
    return handler.handle(query);
  }
}
