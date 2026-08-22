import { IsEmail } from 'class-validator';

export class SearchUserDto {
  @IsEmail()
  email!: string;
}