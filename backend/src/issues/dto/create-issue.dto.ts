import { IsString, IsIn, MinLength, MaxLength, IsOptional } from 'class-validator';
import type { IssueType, IssuePriority } from '../issue.entity';

export class CreateIssueDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['task', 'bug', 'story', 'epic'])
  type!: IssueType;

  @IsIn(['low', 'medium', 'high', 'critical'])
  priority!: IssuePriority;
}