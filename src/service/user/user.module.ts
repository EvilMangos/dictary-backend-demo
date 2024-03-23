import { Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { DbModule } from "../db/db.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CryptoModule } from "../crypto/crypto.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [DbModule, CryptoModule, ConfigModule],
	providers: [UserRepository, UserService],
	exports: [UserRepository],
	controllers: [UserController],
})
export class UserModule {}
