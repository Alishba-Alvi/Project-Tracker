import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import { Issue } from './issue.entity';

@Entity()
export class Label {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column()
  projectId!: string;

  @Column()
  name!: string;

  @ManyToMany(() => Issue, (issue) => issue.labels)
  issues!: Issue[];

  @CreateDateColumn()
  createdAt!: Date;
}