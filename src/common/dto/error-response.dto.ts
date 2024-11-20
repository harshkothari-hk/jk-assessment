export class ErrorResponse {
  constructor(
    public statusCode: number,
    public message: string, // Error message
    public errorDetails?: string,
    public timestamp: string = new Date().toISOString(),
  ) {}
}
