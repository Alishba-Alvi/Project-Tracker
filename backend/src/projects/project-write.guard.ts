import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ProjectWriteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const membership = request.projectMembership;

    if (!membership || membership.projectRole === 'viewer') {
      throw new ForbiddenException('Viewers do not have write access to this project');
    }

    return true;
  }
}