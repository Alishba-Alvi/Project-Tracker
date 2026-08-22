import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectMemberGuard } from '../projects/project-member.guard';

@UseGuards(JwtAuthGuard, ProjectMemberGuard)
@Controller('projects/:projectId/issues')
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateIssueDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: string };
    return this.issuesService.create(projectId, dto, user.userId);
  }
}