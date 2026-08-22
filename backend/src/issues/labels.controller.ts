import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectMemberGuard } from '../projects/project-member.guard';
import { ProjectWriteGuard } from '../projects/project-write.guard';
import { ProjectLeadGuard } from '../projects/project-lead.guard';

@UseGuards(JwtAuthGuard, ProjectMemberGuard)
@Controller('projects/:projectId/labels')
export class LabelsController {
  constructor(private labelsService: LabelsService) {}

  @UseGuards(ProjectWriteGuard)
  @Post()
  create(@Param('projectId') projectId: string, @Body() dto: CreateLabelDto) {
    return this.labelsService.create(projectId, dto);
  }

  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.labelsService.findAll(projectId);
  }

  @UseGuards(ProjectLeadGuard)
  @Delete(':labelId')
  remove(@Param('projectId') projectId: string, @Param('labelId') labelId: string) {
    return this.labelsService.remove(projectId, labelId);
  }
}