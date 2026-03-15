// src/auth/guards.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

// ── JWT Auth Guard ─────────────────────────────────────────
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// ── Optional JWT Guard ────────────────────────────────────
@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest(err, user) { return user || null; }
}

// ── Roles Guard ───────────────────────────────────────────
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), context.getClass(),
    ]);
    if (!required) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Authentication required');
    if (!required.includes(user.role)) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}

// ── Admin Guard shortcut ──────────────────────────────────
@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context);
    if (!authenticated) return false;
    const { user } = context.switchToHttp().getRequest();
    if (user?.role !== 'ADMIN') throw new ForbiddenException('Admin only');
    return true;
  }
  handleRequest(err, user) {
    if (err || !user) throw err || new ForbiddenException('Admin only');
    return user;
  }
}
