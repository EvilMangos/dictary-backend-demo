import { Test } from "@nestjs/testing";
import { AppModule } from "../../src/app.module";
import { MailService } from "../../src/service/mail/mail.service";
import { MailServiceMock } from "../mock/service/mail.service.mock";
import { MiddlewareConsumer, ValidationPipe } from "@nestjs/common";
import { DbService } from "../../src/service/db/db.service";
import { JwtService } from "@nestjs/jwt";
import { CryptoService } from "../../src/service/crypto/crypto.service";
import { ConfigService } from "@nestjs/config";
import { UtilsService } from "./utils.service";
import { TranslateService } from "../../src/service/translate/translate.service";
import { TranslateServiceMock } from "../mock/service/translate.service.mock";
import { NextFunction, Request, Response } from "express";
import { ParamToIdPipe } from "../../src/utils/pipe/paramToId.pipe";
import { TaskServiceMock } from "../mock/service/task.service.mock";
import { TaskService } from "../../src/task/task.service";
import { ChatGptService } from "../../src/service/translate/translators/chatGpt.service";
import { TranslatorServiceMock } from "../mock/service/translator.service.mock";
import { LingvoDictionaryService } from "../../src/service/translate/translators/lingvoDictionary.service";
import { MicrosoftTranslatorService } from "../../src/service/translate/translators/microsoftTranslator.service";
import { YandexDictionaryService } from "../../src/service/translate/translators/yandexDictionary.service";
import cookieParser from "cookie-parser";

export const getTestingApp = async () => {
	const moduleApp = await Test.createTestingModule({
		imports: [AppModule],
	})
		.overrideProvider(MailService)
		.useClass(MailServiceMock)
		.overrideProvider(TranslateService)
		.useClass(TranslateServiceMock)
		.overrideProvider(TaskService)
		.useClass(TaskServiceMock)
		.overrideProvider(ChatGptService)
		.useClass(TranslatorServiceMock)
		.overrideProvider(LingvoDictionaryService)
		.useClass(TranslatorServiceMock)
		.overrideProvider(MicrosoftTranslatorService)
		.useClass(TranslatorServiceMock)
		.overrideProvider(YandexDictionaryService)
		.useClass(TranslatorServiceMock)
		.compile();

	const app = moduleApp.createNestApplication();

	const appModule = moduleApp.get(AppModule);
	appModule.configure = function (consumer: MiddlewareConsumer) {
		consumer
			.apply((req: Request, res: Response, next: NextFunction) => {
				next();
			})
			.forRoutes("*");
	};

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			skipUndefinedProperties: true,
		}),
		new ParamToIdPipe()
	);

	const configService = app.get(ConfigService);

	app.use(cookieParser(configService.get("COOKIE_SECRET")));

	await app.init();
	const server = app.getHttpServer().listen(configService.get("PORT"));

	const dbService = app.get(DbService);
	const jwtService = app.get(JwtService);
	const cryptoService = app.get(CryptoService);

	return {
		server,
		app,
		utilsService: new UtilsService(dbService, jwtService, cryptoService),
	};
};
