import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { ListIssuesDto } from './dto/list-issues.dto';
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

  @Get()
  findAll(@Param('projectId') projectId: string, @Query() query: ListIssuesDto) {
    return this.issuesService.findAll(projectId, query);
  }

  @Get(':issueId')
  findOne(@Param('projectId') projectId: string, @Param('issueId') issueId: string) {
    return this.issuesService.findOne(projectId, issueId);
  }

  @Patch(':issueId')
  update(
    @Param('projectId') projectId: string,
    @Param('issueId') issueId: string,
    @Body() dto: UpdateIssueDto,
  ) {
    return this.issuesService.update(projectId, issueId, dto);
  }
}