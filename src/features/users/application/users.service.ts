import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../infrastructure/users.repository";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../domain/users.entity";
import {
  EmailConfirmationModel,
  UserCreateModel
} from "../api/models/input/create-user.input.model";
import { UuidService } from "nestjs-uuid";
import { add } from "date-fns";
import { MailerService } from "@nestjs-modules/mailer";
import { CryptoService } from "../../../core/modules/crypto/application/crypto.service";
import { RecoveryPasswordModel } from "../../auth/api/models/output/auth.output.model";
import { SETTINGS } from "../../../core/settings/settings";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly uuidService: UuidService,
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailerService,
    private readonly cryptoService: CryptoService
  ) {
  }

  async createUser(user: UserCreateModel, isConfirm: boolean): Promise<string> {
    const emailConfirmation: EmailConfirmationModel = this.createEmailConfirmation(isConfirm);
    if (!isConfirm) {
      await this.sendActivationEmail(user.email, `${SETTINGS.PATH.API_URL}/?code=${emailConfirmation.confirmationCode as string}`);
    }
    const hashPassword = await this.cryptoService.hashPassword(user.password);
    const newUser = new this.userModel({ ...user, password: hashPassword, emailConfirmation });
    const saveData = await this.usersRepository.saveBlog(newUser);
    return saveData._id.toString();
  }

  async deleteUser(id: string) {
    const findedUser = await this.userModel.findById(id);
    if (!findedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const deleteUser = await this.userModel.deleteOne({ _id: id });
    return deleteUser;
  }

  private createEmailConfirmation(isConfirm: boolean) {
    const emailConfirmationNotConfirm: EmailConfirmationModel = {
      isConfirmed: false,
      confirmationCode: this.uuidService.generate(),
      expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30
        }
      ).toString()
    };
    const emailConfirmationIsConfirm: EmailConfirmationModel = {
      isConfirmed: true
    };
    return isConfirm ? emailConfirmationIsConfirm : emailConfirmationNotConfirm;
  }

  private async sendActivationEmail(to: string, link: string) {
    await this.mailService.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Активация аккаунта на " + SETTINGS.PATH.API_URL,
      text: "",
      html:
        `
                <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                    <a href='${link}'>Завершить регистрацию</a>
                </p>

            `
    });
  }

  private async sendRecoveryMail(to: string, link: string) {
    await this.mailService.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Восстановление пароля аккаунта на " + process.env.API_URL,
      text: "",
      html:
        `
                    <h1>Password recovery</h1>
                    <p>To finish password recovery please follow the link below:
                        <a href='${link}'>recovery password</a>
                    </p>
    

            `
    });
  }

  // private async findUserInDbByCode(confirmationCode: string) {
  //   const checkActivate = await this.userModel.findOne({ "emailConfirmation.confirmationCode": confirmationCode });
  //   return checkActivate;
  // }

  async resendEmail(email: string) {
    const checkStatus = await this.usersRepository.checkUserStatus(email);
    const emailConfirmation: EmailConfirmationModel = this.createEmailConfirmation(false);
    await this.sendActivationEmail(email, `${SETTINGS.PATH.API_URL}/?code=${emailConfirmation.confirmationCode as string}`);
    const updateUserInfo = await this.userModel.findOneAndUpdate(
      {email},
      {$set: {
        emailConfirmation
        }},
      { new: true }
    );
    return updateUserInfo;
  }

  async activateEmail(code: string) {
    // const checkUserStatus = await this.findUserInDbByCode(code);
    // if (!checkUserStatus) {
    //   throw new BadRequestException(`User with code ${code} not found`);
    // }
    const checkCodeStatus = await this.usersRepository.checkCodeStatus(code);
    const updateUserInfo = await this.userModel.findByIdAndUpdate(
      checkCodeStatus._id,
      {$set: {'emailConfirmation.isConfirmed': true}},
      { new: true }
    );
    return updateUserInfo;
  }

  async passwordRecovery(email: string) {
    // const emailExists = await userService.isEmailExistOrThrow(email)
    // if (!emailExists) {
    //     throw ApiError.BadRequest('Email не существует', email)
    // }
    const emailConfirmation: EmailConfirmationModel = this.createEmailConfirmation(false);
    await this.sendRecoveryMail(email, `${SETTINGS.PATH.API_URL}/?code=${emailConfirmation.confirmationCode as string}`);
    const updateUserInfo = await this.userModel.updateOne({ email }, {
      $set: {
        "emailConfirmation.confirmationCode": emailConfirmation.confirmationCode
      }
    });
    return updateUserInfo;
  }

  async approveNewPassword(recoveryPasswordData: RecoveryPasswordModel) {
    const updateUserInfo = await this.updatePassword(recoveryPasswordData);
    return updateUserInfo;
  }

  private async updatePassword(recoveryPasswordData: RecoveryPasswordModel) {
    const user = await this.userModel.findOne({ "emailConfirmation.confirmationCode": recoveryPasswordData.recoveryCode });
    if (!user) {
      throw new NotFoundException(`User with code ${recoveryPasswordData.recoveryCode} not found`);
    }
    // const emailExists = await usersRepository.getUserByEmail(user.email)
    // if (!emailExists) {
    //   throw ApiError.BadRequest('Данный email не найден', 'email')
    // }
    // const hashPassword = await cryptoService.hashPassword(password)
    // const updateUserInfo = await usersRepository.updateUserPassword(user.email, hashPassword)
    const updateUserInfo = await this.userModel.findByIdAndUpdate(user._id, { password: recoveryPasswordData.newPassword });
    return updateUserInfo;
  }

}
