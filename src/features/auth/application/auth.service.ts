import { Injectable, UnauthorizedException } from "@nestjs/common";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import { TokensService } from "../../tokens/application/tokens.service";
import { User } from "../../users/domain/users.entity";
import { LoginDto } from "../api/models/input/auth.input.model";
import { CryptoService } from "../../../core/modules/crypto/application/crypto.service";
import { UuidService } from "nestjs-uuid";
import { DevicesService } from '../../devices/application/devices.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly tokensService: TokensService,
        private readonly cryptoService: CryptoService,
        private readonly uuidService: UuidService,
        private readonly devicesService: DevicesService,
    ) {
    }

    async login(loginDto: LoginDto, myIp: string, userAgent: string) {
        const findedUser = await this.userModel.findOne({login: loginDto.loginOrEmail});
        if (!findedUser) {
            throw new UnauthorizedException('User not found');
        }
        const comparePass = await this.cryptoService.comparePassword(loginDto.password, findedUser.password);
        if (!comparePass) {
            throw new UnauthorizedException("Password not match");
        }
        // const myIp = ip.address()
        // const userAgent = req.headers['user-agent'] as string;
        const findSession = await this.devicesService.findDevice({userId: findedUser._id, ip: myIp, title: userAgent})
        // const deviceData: IDevice = {
        const deviceData: any = {
            userId: findedUser._id,
            deviceId: findSession ? findSession.deviceId : this.uuidService.generate(),
            ip: myIp,
            title: userAgent,
            lastActiveDate: new Date(Date.now()).toISOString(),
        }
        const {accessToken, refreshToken} = this.tokensService.createTokens(findedUser._id.toString());
        if (findSession) {
            await this.devicesService.updateDeviceById({_id: findSession._id}, {
                $set: {
                    lastActiveDate: new Date(Date.now()).toISOString(),
                }
            })
            const tokenData = {
                userId: findedUser._id,
                refreshToken,
                blackList: false,
                deviceId: findSession.deviceId
            }
            await this.tokensService.saveToken(tokenData)
        } else {
            const newDevice = await this.devicesService.createSession(deviceData)
            const tokenData = {
                userId: findedUser._id,
                refreshToken,
                blackList: false,
                deviceId: deviceData.deviceId
            }
            await this.tokensService.saveToken(tokenData)
        }
        return {
            accessToken,
            refreshToken,
        }
    }

    async getMe(bearerHeader: string) {
        const token = this.tokensService.getToken(bearerHeader)
        const validateToken = this.tokensService.validateAccessToken(token)
        if (!validateToken) {
            throw new UnauthorizedException('Invalid access token');
        }
        const findedUser = await this.userModel.findById(validateToken._id.toString());
        if (!findedUser) {
            throw new UnauthorizedException('User not exists');
        }
        return {
            email: findedUser.email,
            login: findedUser.login,
            userId: findedUser._id,
        }
    }

}
