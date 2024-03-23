import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import session from "express-session";
import helmet from "helmet";
import { ApiTagEnum } from "./utils/enum/apiTag.enum";
import { ParamToIdPipe } from "./utils/pipe/paramToId.pipe";
import cookieParser from "cookie-parser";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const PORT = configService.get("PORT");
	const HOST = configService.get("HOSTNAME");
	const PROTOCOL = configService.get("PROTOCOL");

	app.setGlobalPrefix(configService.get("GLOBAL_PREFIX"));

	app.use(
		session({
			secret: configService.get("SESSION_SECRET"),
			resave: false,
			saveUninitialized: false,
		})
	);

	app.use(cookieParser(configService.get("COOKIE_SECRET")));

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			skipUndefinedProperties: true,
		}),
		new ParamToIdPipe()
	);

	if (+configService.get("ALLOW_API")) {
		const configDocument = new DocumentBuilder()
			.setTitle("Example")
			.setDescription("Description")
			.setVersion("1.0")
			.addTag(ApiTagEnum.auth)
			.addTag(ApiTagEnum.dictionaries)
			.addTag(ApiTagEnum.tester)
			.addTag(ApiTagEnum.testing)
			.addTag(ApiTagEnum.users)
			.addTag(ApiTagEnum.word)
			.build();
		const document = SwaggerModule.createDocument(app, configDocument);
		SwaggerModule.setup("api", app, document);
	}

	app.use(helmet());
	app.enableCors({
		origin: true,
		credentials: true,
	});

	console.log(`Server listen on ${PROTOCOL}://${HOST}:${PORT}`);
	await app.listen(PORT);
}
bootstrap();
