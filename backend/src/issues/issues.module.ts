import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issue.entity';
import { Project } from '../projects/project.entity';
import { ProjectMember } from '../projects/project-member.entity';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { Label } from './label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Label, Project, ProjectMember])],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [TypeOrmModule],
})
export class IssuesModule {}