import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectMember } from './project-member.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private membersRepository: Repository<ProjectMember>,
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

  async addMember(projectId: string, dto: AddMemberDto): Promise<ProjectMember> {
    const existing = await this.membersRepository.findOne({
      where: { projectId, userId: dto.userId },
    });
    if (existing) {
      throw new ConflictException('User is already a member of this project');
    }

    const membership = this.membersRepository.create({
      projectId,
      userId: dto.userId,
      projectRole: dto.projectRole,
    });
    return this.membersRepository.save(membership);
  }

  async removeMember(projectId: string, targetUserId: string): Promise<void> {
    const membership = await this.membersRepository.findOne({
      where: { projectId, userId: targetUserId },
    });
    if (!membership) {
      throw new NotFoundException('That user is not a member of this project');
    }

    const remainingLeads = await this.membersRepository.count({
      where: { projectId, projectRole: 'lead' },
    });
    if (membership.projectRole === 'lead' && remainingLeads <= 1) {
      throw new ConflictException('Cannot remove the last remaining Lead from a project');
    }

    await this.membersRepository.remove(membership);
  }

  async listMembers(projectId: string): Promise<ProjectMember[]> {
    return this.membersRepository.find({ where: { projectId } });
  }
  async updateMemberRole(
  projectId: string,
  targetUserId: string,
  dto: UpdateMemberRoleDto,
): Promise<ProjectMember> {
  const membership = await this.membersRepository.findOne({
    where: { projectId, userId: targetUserId },
  });
  if (!membership) {
    throw new NotFoundException('That user is not a member of this project');
  }

  if (membership.projectRole === 'lead' && dto.projectRole !== 'lead') {
    const remainingLeads = await this.membersRepository.count({
      where: { projectId, projectRole: 'lead' },
    });
    if (remainingLeads <= 1) {
      throw new ConflictException('Cannot demote the last remaining Lead from a project');
    }
  }

  membership.projectRole = dto.projectRole;
  return this.membersRepository.save(membership);
}
}
