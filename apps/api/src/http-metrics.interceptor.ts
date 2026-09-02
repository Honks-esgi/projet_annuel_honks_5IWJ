import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Counter, Histogram, register } from 'prom-client';

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method } = req;
    const route = req.route?.path ?? req.url;
    const end = httpRequestDurationSeconds.startTimer();

    return next.handle().pipe(
      tap({
        next: () => {
          const status = String(context.switchToHttp().getResponse().statusCode);
          httpRequestsTotal.inc({ method, route, status });
          end({ method, route, status });
        },
        error: (err) => {
          const status = String(err.status ?? 500);
          httpRequestsTotal.inc({ method, route, status });
          end({ method, route, status });
        },
      }),
    );
  }
}
