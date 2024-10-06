import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { TokenEntity } from "../domain/tokens.entity";
import { JwtService } from "@nestjs/jwt";
import { SETTINGS } from "../../../core/settings/settings";

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(TokenEntity.name) private userModel: Model<TokenEntity>,
    private readonly jwtService: JwtService
  ) {
  }

  createTokens(userId: string) {
    const [accessToken, refreshToken] = [
      this.jwtService.sign(
        {
          _id: userId
        },
        {
          secret: SETTINGS.VARIABLES.JWT_SECRET_ACCESS_TOKEN,
          expiresIn: "15m"
        }
      ),
      this.jwtService.sign(
        {
          _id: userId
        },
        {
          secret: SETTINGS.VARIABLES.JWT_SECRET_REFRESH_TOKEN,
          expiresIn: "30m"
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

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

}
