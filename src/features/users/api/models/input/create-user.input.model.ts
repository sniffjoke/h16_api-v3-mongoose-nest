import { IsEmail, IsString, Length } from "class-validator";
import { Trim } from '../../../../../core/decorators/transform/trim';

export class UserCreateModel {
    @Trim()
    @IsString({message: 'Должно быть строкой'})
    @Length(3, 10, {message: 'Количество знаков: 3-10'})
    login: string;

    @IsEmail({}, {message: 'Е-майл должен быть валидным'})
    email: string;

    @Trim()
    @IsString({message: 'Должно быть строкой'})
    @Length(6, 20, {message: 'Количество знаков: 6-20'})
    password: string;
}

export class EmailConfirmationModel {
    confirmationCode?: string
    expirationDate?: string
    isConfirmed: boolean
}
