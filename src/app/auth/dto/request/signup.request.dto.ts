import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupRequestDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

