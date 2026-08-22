import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Issue } from './issue.entity';
import { Project } from '../projects/project.entity';
import { CreateIssueDto } from './dto/create-issue.dto';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issuesRepository: Repository<Issue>,
    private dataSource: DataSource,
  ) {}

  async create(projectId: string, dto: CreateIssueDto, reporterId: string): Promise<Issue> {
    return this.dataSource.transaction(async (manager) => {
      const project = await manager.findOne(Project, { where: { id: projectId } });
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const lastIssue = await manager
        .createQueryBuilder(Issue, 'issue')
        .where('issue.projectId = :projectId', { projectId })
        .orderBy('issue.number', 'DESC')
        .setLock('pessimistic_write')
        .getOne();

      const nextNumber = lastIssue ? lastIssue.number + 1 : 1;
      const key = `${project.key}-${nextNumber}`;

      const issue = manager.create(Issue, {
        projectId,
        number: nextNumber,
        key,
        title: dto.title,
        description: dto.description || null,
        type: dto.type,
        priority: dto.priority,
        status: 'to_do',
        reporterId,
      });

      return manager.save(issue);
    });
  }
}