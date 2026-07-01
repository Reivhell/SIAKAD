import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    
    let message = exception.message || 'Terjadi kesalahan internal.';
    let errors: any[] | undefined = undefined;
    let code: string | undefined = undefined;
    
    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse() as any;
      if (typeof responseBody === 'object' && responseBody !== null) {
        message = responseBody.message || message;
        errors = responseBody.errors || undefined;
        code = responseBody.code || undefined;
      }
    }
    
    response.status(status).json({
      status: 'error',
      code,
      message: Array.isArray(message) ? message[0] : message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
