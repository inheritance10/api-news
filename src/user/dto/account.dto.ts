import { IsBoolean, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AccountDto {
  @IsNotEmpty()
  @IsString()
  userId: string;


  @IsBoolean()
  status: boolean;

}
