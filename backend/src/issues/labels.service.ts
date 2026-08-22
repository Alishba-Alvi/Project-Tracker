import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './label.entity';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private labelsRepository: Repository<Label>,
  ) {}

  async create(projectId: string, dto: CreateLabelDto): Promise<Label> {
    const name = dto.name.trim();

    const existing = await this.labelsRepository
      .createQueryBuilder('label')
      .where('label.projectId = :projectId', { projectId })
      .andWhere('LOWER(label.name) = LOWER(:name)', { name })
      .getOne();

    if (existing) {
      throw new ConflictException('A label with this name already exists in this project');
    }

    const label = this.labelsRepository.create({ projectId, name });
    return this.labelsRepository.save(label);
  }

  async findAll(projectId: string): Promise<Label[]> {
    return this.labelsRepository.find({
      where: { projectId },
      order: { name: 'ASC' },
    });
  }

  async remove(projectId: string, labelId: string): Promise<void> {
    const label = await this.labelsRepository.findOne({
      where: { id: labelId, projectId },
      relations: { issues: true },
    });
    if (!label) {
      throw new NotFoundException('Label not found in this project');
    }

    if (label.issues && label.issues.length > 0) {
      await this.labelsRepository
        .createQueryBuilder()
        .relation(Label, 'issues')
        .of(label)
        .remove(label.issues);
    }

    await this.labelsRepository.remove(label);
  }
}