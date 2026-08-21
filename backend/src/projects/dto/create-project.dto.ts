import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Matches(/^[A-Z]{2,5}$/, {
    message: 'Key must be 2-5 uppercase letters',
  })
  key!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(0)
  description!: string;
}