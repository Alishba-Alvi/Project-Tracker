import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name!: string;
}