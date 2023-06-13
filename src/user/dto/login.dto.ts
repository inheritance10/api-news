
import {IsEmpty,IsEmail,  IsNotEmpty, IsString} from "@nestjs/class-validator";

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  readonly password: string;
}