import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Issue } from './issue.entity';
import { Project } from '../projects/project.entity';
import { ProjectMember } from '../projects/project-member.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issuesRepository: Repository<Issue>,
    @InjectRepository(ProjectMember)
    private membersRepository: Repository<ProjectMember>,
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

  async findOne(projectId: string, issueId: string): Promise<Issue> {
    const issue = await this.issuesRepository.findOne({
      where: { id: issueId, projectId },
    });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    return issue;
  }

  async update(projectId: string, issueId: string, dto: UpdateIssueDto): Promise<Issue> {
    const issue = await this.findOne(projectId, issueId);

    if (dto.assigneeId !== undefined && dto.assigneeId !== null) {
      const membership = await this.membersRepository.findOne({
        where: { projectId, userId: dto.assigneeId },
      });
      if (!membership) {
        throw new BadRequestException('Assignee must be a member of this project');
      }
    }

    Object.assign(issue, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.type !== undefined && { type: dto.type }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      ...(dto.assigneeId !== undefined && { assigneeId: dto.assigneeId }),
    });

    return this.issuesRepository.save(issue);
  }

  async findAll(
    projectId: string,
    filters: {
      status?: string;
      assigneeId?: string;
      type?: string;
      priority?: string;
      page?: number;
      limit?: number;
      sortBy?: 'createdAt' | 'priority' | 'status';
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<{ data: Issue[]; total: number; page: number; limit: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 && filters.limit <= 100 ? filters.limit : 20;
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';

    const query = this.issuesRepository
      .createQueryBuilder('issue')
      .where('issue.projectId = :projectId', { projectId });

    if (filters.status) {
      query.andWhere('issue.status = :status', { status: filters.status });
    }
    if (filters.assigneeId) {
      query.andWhere('issue.assigneeId = :assigneeId', { assigneeId: filters.assigneeId });
    }
    if (filters.type) {
      query.andWhere('issue.type = :type', { type: filters.type });
    }
    if (filters.priority) {
      query.andWhere('issue.priority = :priority', { priority: filters.priority });
    }

    if (sortBy === 'priority') {
      query.orderBy(
        `CASE issue.priority
          WHEN 'low' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'high' THEN 3
          WHEN 'critical' THEN 4
        END`,
        sortOrder,
      );
    } else {
      query.orderBy(`issue.${sortBy}`, sortOrder);
    }

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, limit };
  }

  async remove(projectId: string, issueId: string): Promise<void> {
    const issue = await this.findOne(projectId, issueId);
    await this.issuesRepository.remove(issue);
  }
}