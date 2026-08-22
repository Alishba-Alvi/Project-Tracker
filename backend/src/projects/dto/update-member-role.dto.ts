import { IsIn } from 'class-validator';

export class UpdateMemberRoleDto {
  @IsIn(['lead', 'member', 'viewer'])
  projectRole!: 'lead' | 'member' | 'viewer';
}