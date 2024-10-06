import {
  registerDecorator,
  ValidationArguments, ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../../features/users/infrastructure/users.repository";


@ValidatorConstraint({ name: "check-email-status", async: true })
@Injectable()
export class CheckEmailStatusConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersRepository: UsersRepository) {
  }

  async validate(value: any, validationArguments?: ValidationArguments) {
    // const checkStatus = await this.usersRepository.checkUserStatus(value);
    // return !checkStatus;
    try {
      await this.usersRepository.checkUserStatus(value);
    } catch (e) {
      return false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "User already confirm";
  }

}

export function CheckEmailStatus(property?: string, validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: "CheckEmailStatus",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: CheckEmailStatusConstraint
    });
  };
}

