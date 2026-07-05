import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SecurityService } from '../../modules/security/security.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly securityService: SecurityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, ip } = req;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;

        // Structured JSON logs for modern cloud distributed logging (e.g., Google Cloud Logging / Pino / Winston)
        const logObject = {
          timestamp: new Date().toISOString(),
          level: 'INFO',
          method,
          url: originalUrl,
          statusCode,
          durationMs: duration,
          ip,
          userAgent,
        };

        console.log(`[HTTP TRACE] ${JSON.stringify(logObject)}`);
        
        // Push an event telemetry if it takes > 50ms (simulating latency metrics)
        if (duration > 50) {
          this.securityService.logSecurityEvent('INFO', `PERF ALERT: Latency spike detected on ${method} ${originalUrl} - ${duration}ms`, ip);
        }
      })
    );
  }
}
