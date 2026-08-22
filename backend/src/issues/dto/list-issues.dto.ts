import { IsOptional, IsIn, IsUUID, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ListIssuesDto {
  @IsOptional()
  @IsIn(['to_do', 'in_progress', 'in_review', 'done'])
  status?: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsIn(['task', 'bug', 'story', 'epic'])
  type?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'critical'])
  priority?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsIn(['createdAt', 'priority', 'status'])
  sortBy?: 'createdAt' | 'priority' | 'status';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}