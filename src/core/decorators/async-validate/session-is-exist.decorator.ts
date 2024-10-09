import {
  registerDecorator,
  ValidationArguments, ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../../../features/blogs/infrastructure/blogs.repository';
import { DevicesService } from '../../../features/devices/application/devices.service';


@ValidatorConstraint({ name: 'email-is-exist', async: true })
@Injectable()
export class SessionIsExistConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly devicesRepository: DevicesService
  ) {
  }

  async validate(value: any, validationArguments?: ValidationArguments) {
    try {
      await this.devicesRepository.findDevice({_id: value});
    } catch (e) {
      return false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Session with this id not found';
  }

}

export function SessionExists(property?: string, validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'SessionExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: SessionIsExistConstraint,
    });
  };
}

