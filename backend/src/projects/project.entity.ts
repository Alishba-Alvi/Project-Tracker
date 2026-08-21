import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProjectMember } from './project-member.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  key!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ default: false })
  isArchived!: boolean;

  @OneToMany(() => ProjectMember, (member) => member.project)
  members!: ProjectMember[];

  @CreateDateColumn()
  createdAt!: Date;
}