import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { UserModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";
import { TokenModule } from "../token/token.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./guard/jwtAuth.guard";
import { SessionSerializeService } from "./sessionSerialize.service";
import { CryptoModule } from "../crypto/crypto.module";
import { VerificationService } from "./verification.service";
import { RestoreService } from "./restore.service";
import { RolesGuard } from "./guard/roles.guard";
import { UserGuard } from "./guard/user.guard";
import { CookieService } from "./cookie.service";
import { DbModule } from "../db/db.module";
import { TesterModule } from "../tester/tester.module";
import { DictionaryModule } from "../dictionary/dictionary.module";

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get("JWT_SECRET"),
				signOptions: { expiresIn: configService.get("JWT_EXPIRES") },
			}),
			inject: [ConfigService],
		}),
		UserModule,
		MailModule,
		TokenModule,
		CryptoModule,
		DbModule,
		TesterModule,
		DictionaryModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		SessionSerializeService,
		VerificationService,
		RestoreService,
		CookieService,
		{ provide: APP_GUARD, useClass: JwtAuthGuard },
		{ provide: APP_GUARD, useClass: RolesGuard },
		{ provide: APP_GUARD, useClass: UserGuard },
	],
})
export class AuthModule {}
