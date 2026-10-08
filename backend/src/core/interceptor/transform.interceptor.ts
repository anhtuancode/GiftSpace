import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const statusCode = res.statusCode;

    // Lấy full URL của API giống hệt bên Exception Filter
    const fullPath = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    // Lấy link Swagger
    const baseUrl = `${req.protocol}://${req.get('host')}/api/docs`;
    const methodName = context.getHandler().name;
    const controllerName = context.getClass().name;
    const tag = controllerName.replace('Controller', '');
    const docUrl = `${baseUrl}#/${tag}/${controllerName}_${methodName}`;

    const datetime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        statusCode,
        method: req.method,  
        path: fullPath,      
        data,                
        doc: docUrl,         
        datetime,
      })),
    );
  }
}