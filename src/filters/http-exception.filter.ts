import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // 响应请求对象
    const response = ctx.getResponse();
    console.log('response', response);

    const request = ctx.getRequest();
    console.log('request', request);

    const status = exception.getStatus();

    this.logger.error(exception.message, exception.stack);

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });

    // throw new Error('Method not implement.');
  }
}
