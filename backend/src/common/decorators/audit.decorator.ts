import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';
export interface AuditMetadata {
  actionKey: string;
  targetType?: string;
}

export const Audit = (actionKey: string, targetType?: string) =>
  SetMetadata(AUDIT_KEY, { actionKey, targetType } as AuditMetadata);
