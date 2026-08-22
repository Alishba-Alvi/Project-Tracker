import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ProjectLeadGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const membership = request.projectMembership;

    if (!membership || membership.projectRole !== 'lead') {
      throw new ForbiddenException('Only the project Lead can perform this action');
    }

    return true;
  }
}