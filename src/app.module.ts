import {
	ClassSerializerInterceptor,
	ConsoleLogger,
	MiddlewareConsumer,
	Module,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { getEnvConfig } from "./config/env_config";
import { AuthModule } from "./service/auth/auth.module";
import { DbModule } from "./service/db/db.module";
import { DictionaryModule } from "./service/dictionary/dictionary.module";
import { TesterModule } from "./service/tester/tester.module";
import { TestingModule } from "./service/testing/testing.module";
import { MailModule } from "./service/mail/mail.module";
import { TokenModule } from "./service/token/token.module";
import { CryptoModule } from "./service/crypto/crypto.module";
import { TranslateModule } from "./service/translate/translate.module";
import { AutofillModule } from "./service/autofill/autofill.module";
import { LoggerMiddleware } from "./utils/middleware/logger.middleware";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { TaskModule } from "./task/task.module";
import { MainExceptionFilter } from "./utils/exeptionsFilter/mainExeption.filter";
import { StripeModule } from "./service/stripe/stripe.module";
import {
	ThrottlerGuard,
	ThrottlerModule,
	hours,
	minutes,
} from "@nestjs/throttler";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: getEnvConfig(),
			isGlobal: true,
		}),
		ThrottlerModule.forRoot([
			{
				name: "short",
				ttl: minutes(1),
				limit: 40,
			},
			{
				name: "medium",
				ttl: hours(1),
				limit: 600,
			},
		]),
		AuthModule,
		DbModule,
		DictionaryModule,
		TesterModule,
		TestingModule,
		MailModule,
		TokenModule,
		CryptoModule,
		TranslateModule,
		AutofillModule,
		TaskModule,
		StripeModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		ConsoleLogger,
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: MainExceptionFilter,
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
