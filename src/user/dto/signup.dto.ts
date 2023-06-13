import { IsEmail, IsNotEmpty, IsString, MinLength } from "@nestjs/class-validator";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be min 6 characters' })
  readonly password: string;

}
