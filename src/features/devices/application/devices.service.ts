import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceEntity } from '../domain/devices.entity';
import { TokensService } from '../../tokens/application/tokens.service';
import { UsersRepository } from '../../users/infrastructure/users.repository';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel('DeviceEntity') private deviceModel: Model<DeviceEntity>,
    private readonly tokensService: TokensService,
    private readonly usersRepository: UsersRepository,
  ) {
  }

  async createSession(deviceData: any) {
    const newDevice = await this.deviceModel.create(deviceData);
    return newDevice
  }

  async getDevices(bearerHeaderR: string) {
    const token = this.tokensService.getTokenFromCookie(bearerHeaderR);
    const validateToken: any = this.tokensService.validateRefreshToken(token);
    if (!validateToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.usersRepository.findUserById(validateToken._id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const devices = await this.deviceModel.find({ userId: user._id });
    const deviceMap = (device: any) => ({
      deviceId: device.deviceId,
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate,
    });
    const devicesOutput = devices.map((device) => {
      return deviceMap(device);
    });
    return devicesOutput;
  }

  async deleteDeviceByDeviceIdField(bearerHeaderR: string, deviceId: string) {
    const token = this.tokensService.getTokenFromCookie(bearerHeaderR);
    const validateToken: any = this.tokensService.validateRefreshToken(token);
    if (!validateToken) {
      throw new UnauthorizedException('Invalid refresh token - 1');
    }
    const findToken = await this.tokensService.findToken({ deviceId });
    if (!findToken) {
        throw new NotFoundException('Invalid deviceId');
    }
    if (validateToken._id !== findToken?.userId.toString()) {
      throw new ForbiddenException('Not your device');
    }
    const findSession = await this.findDevice({deviceId})
    if (!findSession) {
      throw new NotFoundException('Not found device');
    }
    await this.deviceModel.deleteOne({ deviceId });
    const updateTokensInfo = await this.tokensService.updateManyTokensInDb({ deviceId }, { $set: { blackList: true } });
    if (!updateTokensInfo) {
      throw new UnauthorizedException('Unknown Error');
    }
    return updateTokensInfo;
  }

  async deleteAllDevicesExceptCurrent(bearerHeaderR: string) {
    const token = this.tokensService.getTokenFromCookie(bearerHeaderR);
    const validateToken: any = this.tokensService.validateRefreshToken(token);
    if (!validateToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.deviceModel.deleteMany({ userId: validateToken._id, deviceId: { $ne: validateToken.deviceId } });
    const updateTokensInfo = await this.tokensService.updateManyTokensInDb({
      userId: validateToken._id,
      deviceId: { $ne: validateToken.deviceId },
    }, { $set: { blackList: true } });
    if (!updateTokensInfo) {
      throw new UnauthorizedException('Unknown Error');
    }
    return updateTokensInfo;
  }

  async findDevice(filter: any) {
    const findedDevice = await this.deviceModel.findOne(filter)
    return findedDevice
  }

  async updateDeviceById(filter: any, payload: any) {
    const updateDevice = await this.deviceModel.updateOne(filter, payload)
    return updateDevice
  }

  async findAndUpdateDeviceById(filter: any, payload: any) {
    const updateDevice = await this.deviceModel.findOneAndUpdate(filter, payload)
    return updateDevice
  }

  async deleteDeviceById(filter: any) {
    const deleteDevice = await this.deviceModel.deleteOne(filter)
    return deleteDevice
  }

}
