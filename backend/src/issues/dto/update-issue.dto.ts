import { IsString, IsIn, MinLength, MaxLength, IsOptional, IsUUID } from 'class-validator';
import type { IssueType, IssuePriority } from '../issue.entity';

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['task', 'bug', 'story', 'epic'])
  type?: IssueType;

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'critical'])
  priority?: IssuePriority;

  @IsOptional()
  @IsUUID()
  assigneeId?: string | null;
}