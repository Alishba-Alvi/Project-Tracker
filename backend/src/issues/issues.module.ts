import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issue.entity';
import { Project } from '../projects/project.entity';
import { ProjectMember } from '../projects/project-member.entity';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Project, ProjectMember])],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [TypeOrmModule],
})
export class IssuesModule {}