import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./api/users.controller";
import { UsersService } from "./application/users.service";
import { UsersRepository } from "./infrastructure/users.repository";
import { UsersQueryRepository } from "./infrastructure/users.query-repository";
import { User, UserSchema } from "./domain/users.entity";
import { UuidModule } from "nestjs-uuid";
import { TokensModule } from "../tokens/tokens.module";
import { CryptoModule } from "../../core/modules/crypto/crypto.module";

@Global()
@Module({
  imports: [
    CryptoModule,
    UuidModule,
    TokensModule,
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository
  ],
  exports: [
    CryptoModule,
    UuidModule,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    TokensModule
  ]
})
export class UsersModule {
}
