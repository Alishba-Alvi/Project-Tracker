import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';
import { Label } from './label.entity';

export type IssueType = 'task' | 'bug' | 'story' | 'epic';
export type IssueStatus = 'to_do' | 'in_progress' | 'in_review' | 'done';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

@Entity()
@Unique(['project', 'number'])
export class Issue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column()
  projectId!: string;

  @Column()
  number!: number;

  @Column()
  key!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar' })
  type!: IssueType;

  @Column({ type: 'varchar', default: 'to_do' })
  status!: IssueStatus;

  @Column({ type: 'varchar' })
  priority!: IssuePriority;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reporterId' })
  reporter!: User | null;

  @Column({ nullable: true })
  reporterId!: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assigneeId' })
  assignee!: User | null;

  @Column({ nullable: true })
  assigneeId!: string | null;

  @ManyToOne(() => Issue, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'epicId' })
  epic!: Issue | null;

  @Column({ nullable: true })
  epicId!: string | null;

  @ManyToMany(() => Label, (label) => label.issues)
  @JoinTable({
    name: 'issue_labels',
    joinColumn: { name: 'issueId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'labelId', referencedColumnName: 'id' },
  })
  labels!: Label[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}