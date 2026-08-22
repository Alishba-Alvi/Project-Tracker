import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issue.entity';
import { ProjectMember } from '../projects/project-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, ProjectMember])],
  exports: [TypeOrmModule],
})
export class IssuesModule {}