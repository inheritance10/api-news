// UpdateUserDto

import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @IsOptional()
  about?: string;

  @IsNotEmpty()
  @IsOptional()
  gender?: string;
}
