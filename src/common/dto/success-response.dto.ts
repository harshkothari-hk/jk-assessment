export class SuccessResponse<T> {
  constructor(
    public data: T,
    public message = 'Success',
  ) {}
}
