export class HttpExceptionResponse {
  statusCode: number;
  error: string;
}

export class CustomHttpExceptionResponse extends HttpExceptionResponse {
  path: string;
  method: string;
  timeStamp: Date;
}
