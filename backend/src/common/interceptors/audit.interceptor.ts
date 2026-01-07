import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AUDIT_KEY, AuditMetadata } from '../decorators/audit.decorator';
import { AuditService } from '../../audit/audit.service';
import { CurrentUserPayload } from '../decorators/current-user.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMetadata = this.reflector.get<AuditMetadata>(AUDIT_KEY, context.getHandler());

    if (!auditMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user: CurrentUserPayload = request.user;
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(async (data) => {
        try {
          const projectId = request.params.projectId || request.body.projectId || null;
          const targetId = data?.id || request.params.id || null;

          await this.auditService.log({
            actorUserId: user.userId,
            projectId,
            actionKey: auditMetadata.actionKey,
            targetType: auditMetadata.targetType || context.getClass().name,
            targetId,
            metadata: {
              method: request.method,
              path: request.url,
              body: this.sanitizeBody(request.body),
            },
            ipAddress: request.ip,
            userAgent: request.get('user-agent'),
          });
        } catch (error) {
          // Don't fail the request if audit logging fails
          console.error('Audit logging failed:', error);
        }
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;
    const sanitized = { ...body };
    // Remove sensitive fields
    if (sanitized.password) delete sanitized.password;
    if (sanitized.token) delete sanitized.token;
    return sanitized;
  }
}
