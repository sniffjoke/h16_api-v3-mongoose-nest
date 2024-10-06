import {
  registerDecorator,
  ValidationArguments, ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../../../features/blogs/infrastructure/blogs.repository';


@ValidatorConstraint({ name: 'email-is-exist', async: true })
@Injectable()
export class BlogIsExistConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly blogsRepository: BlogsRepository
  ) {
  }

  async validate(value: any, validationArguments?: ValidationArguments) {
    try {
      await this.blogsRepository.findBlogById(value);
    } catch (e) {
      return false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Blog with this id not found';
  }

}

export function BlogExists(property?: string, validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'BlogExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: BlogIsExistConstraint,
    });
  };
}

