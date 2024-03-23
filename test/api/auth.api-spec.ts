import request from "supertest";
import { getSignUpData } from "../data/auth.data";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { getTestingApp } from "../utils/getTestingApp";
import { faker } from "@faker-js/faker";
import { UtilsService } from "../utils/utils.service";
import { TokenTypesEnum } from "../../src/service/token/enum/tokenTypes.enum";
import { LanguagesEnum, RolesEnum } from "shared-structures";
import { CreateGuestAccountResponseDto } from "../../src/service/auth/dto/guest/createGuestAccount.response.dto";
import { UserIdDto } from "../../src/service/auth/dto/userId.dto";
import { DeletedDto } from "../../src/utils/dto/deleted.dto";

let app: INestApplication;
let server: NestApplication;

let utilsService: UtilsService;
beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;
	utilsService = TestingApp.utilsService;
});

describe("Auth", () => {
	it.concurrent("POST /auth/signup", async () => {
		const credentials = getSignUpData();
		const response = await request(server)
			.post("/auth/signup")
			.send(credentials);

		expect(response.status).toBe(HttpStatus.CREATED);
		expect(
			utilsService.checkSchemaValidation(UserIdDto, response.body)
		).toBeTruthy();
	});
	it.concurrent("POST /auth/login", async () => {
		const { user, password } = await utilsService.createUser(
			RolesEnum.User,
			server
		);

		const response = await request(server).post("/auth/login").send({
			email: user.email,
			password,
		});

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			utilsService.checkSchemaValidation(UserIdDto, response.body)
		).toBeTruthy();
	});
	it.concurrent("POST /auth/verify", async () => {
		const { authCookie } = await utilsService.createUser(
			RolesEnum.NotVerifiedUser,
			server
		);

		const response = await request(server)
			.post("/auth/verify")
			.set("Cookie", authCookie)
			.send({ token: faker.number.int().toString() });

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			utilsService.checkSchemaValidation(UserIdDto, response.body)
		).toBeTruthy();
	});
	it.concurrent("POST /auth/verify/resend", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.NotVerifiedUser,
			server
		);
		await utilsService.createToken(user._id, TokenTypesEnum.verification);

		const response = await request(server)
			.post("/auth/verify/resend")
			.set("Cookie", authCookie);

		expect(response.status).toBe(HttpStatus.CREATED);
	});
	it.concurrent("POST /auth/password", async () => {
		const { authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		const newPassword = "1234567kkk";
		const response = await request(server)
			.post("/auth/password")
			.set("Cookie", authCookie)
			.send({ password: newPassword });

		expect(response.status).toBe(HttpStatus.OK);
	});
	it.concurrent("POST /auth/restore/code", async () => {
		const { user } = await utilsService.createUser(RolesEnum.User, server);

		const response = await request(server)
			.post("/auth/restore/code")
			.send({ email: user.email });

		expect(response.status).toBe(HttpStatus.OK);
	});
	it.concurrent("POST /auth/restore", async () => {
		const { user } = await utilsService.createUser(RolesEnum.User, server);
		const token = await utilsService.createRestorePasswordCodeForUser(user._id);

		const response = await request(server)
			.post("/auth/restore")
			.send({ email: user.email, code: token });

		expect(response.status).toBe(HttpStatus.OK);
	});
	it.concurrent("POST /auth/guest", async () => {
		const credentials = {
			interfaceLanguage: LanguagesEnum.uk,
		};
		const response = await request(server)
			.post("/auth/guest")
			.send(credentials);

		expect(response.status).toBe(HttpStatus.CREATED);
		expect(
			utilsService.checkSchemaValidation(
				CreateGuestAccountResponseDto,
				response.body
			)
		).toBeTruthy();
	});

	it.concurrent("DELETE /auth/account", async () => {
		const { authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);

		const response = await request(server)
			.delete("/auth/account")
			.set("Cookie", authCookie);

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			utilsService.checkSchemaValidation(DeletedDto, response.body)
		).toBeTruthy();
	});
});

afterAll(async () => {
	await app.close();
});
