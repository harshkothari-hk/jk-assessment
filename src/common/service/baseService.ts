import { Pagination, RequestQuery } from '../dto/base-service.dto';

export class BaseService {
  public getQuery<P>(query: RequestQuery<P>): RequestQuery<P> {
    const result = new RequestQuery<P>();
    result.pagination = this.getPaginationQuery(query.pagination);
    result.sort = this.getSortQuery(query.sort);
    result.filter = this.getFilterQuery(query.filter as any as string);
    return result;
  }

  private getPaginationQuery(query: any): Pagination {
    query = query && typeof query === 'string' ? JSON.parse(query) : null;
    const pagination = new Pagination();
    pagination.page =
      query && query.page ? Number.parseInt(query.page.toString(), 10) : 1;
    pagination.limit =
      query && query.limit ? Number.parseInt(query.limit.toString(), 10) : 10;
    return pagination;
  }
  private getSortQuery(query: string): any {
    if (query) return JSON.parse(query);
    return {} as any;
  }

  private getFilterQuery<P>(query: any): P {
    if (!query) return {} as P;
    return JSON.parse(query) as P;
  }
}
