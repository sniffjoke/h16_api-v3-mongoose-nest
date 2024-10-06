import { IsEmail, IsString, Length } from "class-validator";
import { Trim } from '../../../../../core/decorators/transform/trim';

export class LoginDto {
  @Trim()
  @IsString({message: 'Должно быть строковым значением'})
  @Length(3, 10, {message: 'Количество знаков: 3-10'})
  loginOrEmail: string;

  @Trim()
  @IsString({message: 'Должно быть строковым значением'})
  @Length(6, 20, {message: 'Количество знаков: 6-20'})
  password: string;
}

export class ActivateAccountDto {
  @Trim()
  @IsString({message: 'Должно быть строковым значением'})
  code: string
}

export class ResendActivateCodeDto {
  @IsEmail({}, {message: 'Е-майл должен быть валидным'})
  email: string
}

export class PasswordRecoveryDto {
  @Trim()
  email: string
}
