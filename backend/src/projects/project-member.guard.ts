import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { ProjectMember } from './project-member.entity';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    @InjectRepository(ProjectMember)
    private membersRepository: Repository<ProjectMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { userId: string };
    const projectId = request.params.projectId as string;

    const membership = await this.membersRepository.findOne({
      where: { projectId, userId: user.userId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this project');
    }

    // attach so controllers/services can access the caller's role without re-querying
    request.projectMembership = membership;

    return true;
  }
}