import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectMember } from './project-member.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateProjectDto, creatorUserId: string): Promise<Project> {
    const existing = await this.projectsRepository.findOne({
      where: { key: dto.key },
    });
    if (existing) {
      throw new ConflictException('Project key already in use');
    }

    return this.dataSource.transaction(async (manager) => {
      const project = manager.create(Project, {
        key: dto.key,
        name: dto.name,
        description: dto.description || null,
      });
      const savedProject = await manager.save(project);

      const membership = manager.create(ProjectMember, {
        projectId: savedProject.id,
        userId: creatorUserId,
        projectRole: 'lead',
      });
      await manager.save(membership);

      return savedProject;
    });
  }

  async findMyProjects(userId: string): Promise<Project[]> {
    return this.projectsRepository
      .createQueryBuilder('project')
      .innerJoin('project.members', 'member')
      .where('member.userId = :userId', { userId })
      .getMany();
  }
}