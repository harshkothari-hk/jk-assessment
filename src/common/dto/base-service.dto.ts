export class RequestQuery<T> {
  filter: T;
  pagination: Pagination;
  sort: any;
  projection?: string;
}

export class Pagination {
  limit: number | string;
  page: number | string;
}
