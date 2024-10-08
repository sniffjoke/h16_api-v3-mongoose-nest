import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { TokenEntity } from "../domain/tokens.entity";
import { JwtService } from "@nestjs/jwt";
import { SETTINGS } from "../../../core/settings/settings";

@Injectable()
export class TokensService {
  constructor(
    @InjectModel('TokenEntity') private tokensModel: Model<TokenEntity>,
    private readonly jwtService: JwtService
  ) {
  }

  createTokens(userId: string, deviceId?: string) {
    console.log('deviceIdForCreateTokens: ', deviceId);
    const [accessToken, refreshToken] = [
      this.jwtService.sign(
        {
          _id: userId
        },
        {
          secret: SETTINGS.VARIABLES.JWT_SECRET_ACCESS_TOKEN,
          expiresIn: "10s"
        }
      ),
      this.jwtService.sign(
        {
          _id: userId,
          deviceId
        },
        {
          secret: SETTINGS.VARIABLES.JWT_SECRET_REFRESH_TOKEN,
          expiresIn: "20s"
        }
      )
    ];
    return {
      accessToken,
      refreshToken
    };
  }

  validateAccessToken(token: string) {
    try {
      const userData = this.jwtService.verify(
        token,
        { secret: SETTINGS.VARIABLES.JWT_SECRET_ACCESS_TOKEN }
      );
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = this.jwtService.verify(
        token,
        { secret: SETTINGS.VARIABLES.JWT_SECRET_REFRESH_TOKEN }
      );
      return userData;
    } catch (e) {
      return null;
    }
  }
//TODO: brarer header
  getToken(bearerHeader: string) {
    const token = bearerHeader.split(" ")[1];
    return token;
  }

  getTokenFromCookie(bearerHeaderR: any) {
    const tokenValue = Object.values(bearerHeaderR)
    return tokenValue[0] as string;
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  async findToken(filter: any) {
    const findedToken = await this.tokensModel.findOne(filter)
    return findedToken
  }

  async updateManyTokensInDb(filter: any, payload: any) {
    const updateTokens = await this.tokensModel.updateMany(filter, payload)
    return updateTokens
  }

  async updateOneTokenInDb(filter: any, payload: any) {
    const updateTokens = await this.tokensModel.updateOne(filter, payload)
    return updateTokens
  }

  async saveToken(tokenData: any) {
    const saveToken = await this.tokensModel.create(tokenData)
    return saveToken
  }

}
