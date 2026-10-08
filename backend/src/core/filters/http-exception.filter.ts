import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any)?.message || exception.message
        : 'Lỗi hệ thống nội bộ (Internal Server Error)';

    const datetime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    const fullPath = `${request.protocol}://${request.get('host')}${request.originalUrl}`;

    // Trả về JSON lỗi đồng bộ với form thành công
    response.status(status).json({
      status: 'error',
      statusCode: status,
      method: request.method,
      message: message, // Chứa thông tin lỗi (vd: Sai mật khẩu, Email đã tồn tại)
      path: fullPath,
      datetime,
    });
  }
}