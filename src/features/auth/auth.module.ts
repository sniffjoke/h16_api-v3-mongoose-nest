import { Module } from "@nestjs/common";
import { AuthController } from "./api/auth.controller";
import { AuthService } from "./application/auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/domain/users.entity";
import { TokenEntity, TokenSchema } from "../tokens/domain/tokens.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{
        name: User.name,
        schema: UserSchema,
    }]),
    MongooseModule.forFeature([{
      name: TokenEntity.name,
      schema: TokenSchema,
    }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
  ],
})
export class AuthModule {}
