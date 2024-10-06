import { Injectable, UnauthorizedException } from "@nestjs/common";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import { TokensService } from "../../tokens/application/tokens.service";
import { User } from "../../users/domain/users.entity";
import { LoginDto } from "../api/models/input/auth.input.model";
import { CryptoService } from "../../../core/modules/crypto/application/crypto.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly tokensService: TokensService,
        private readonly cryptoService: CryptoService
    ) {
    }

    async login(loginDto: LoginDto) {
        const findedUser = await this.userModel.findOne({login: loginDto.loginOrEmail});
        if (!findedUser) {
            throw new UnauthorizedException('User not found');
        }
        const comparePass = await this.cryptoService.comparePassword(loginDto.password, findedUser.password);
        if (!comparePass) {
            throw new UnauthorizedException("Password not match");
        }
        const {accessToken, refreshToken} = this.tokensService.createTokens(findedUser._id.toString());
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
