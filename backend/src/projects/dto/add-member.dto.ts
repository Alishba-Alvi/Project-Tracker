import { IsUUID, IsIn } from 'class-validator';

export class AddMemberDto {
  @IsUUID()
  userId!: string;

  @IsIn(['lead', 'member', 'viewer'])
  projectRole!: 'lead' | 'member' | 'viewer';
}