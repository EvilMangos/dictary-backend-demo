import request from "supertest";
import { getSignUpData } from "../data/auth.data";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { DbService } from "../../src/service/db/db.service";
import { getTestingApp } from "../utils/getTestingApp";
import { faker } from "@faker-js/faker";
import { TokenService } from "../../src/service/token/token.service";
import { UtilsService } from "../utils/utils.service";
import { CryptoService } from "../../src/service/crypto/crypto.service";
import { MailService } from "../../src/service/mail/mail.service";
import { TokenTypesEnum } from "../../src/service/token/enum/tokenTypes.enum";
import { LanguagesEnum, RolesEnum } from "shared-structures";

const TOKEN = "123456";

let app: INestApplication;
let server: NestApplication;

let dbService: DbService;
let tokenService: TokenService;
let cryptoService: CryptoService;
let mailService: MailService;

let utilsService: UtilsService;

beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;

	utilsService = TestingApp.utilsService;
	dbService = app.get(DbService);
	tokenService = app.get(TokenService);
	cryptoService = app.get(CryptoService);
	mailService = app.get(MailService);

	jest.spyOn(tokenService, "generate").mockImplementation((): string => {
		return TOKEN;
	});
});

describe("Auth", () => {
	describe(`POST /auth/signup`, () => {
		it.concurrent("should create user", async () => {
			const credentials = getSignUpData();
			const response = await request(server)
				.post("/auth/signup")
				.send(credentials);

			const user = await dbService.model.user.findOne({
				email: credentials.email,
			});

			expect(response.status).toBe(HttpStatus.CREATED);
			expect(user).toBeTruthy();
		});
		it.concurrent("shouldn't create user", async () => {
			const credentials = getSignUpData();
			const response = await request(server)
				.post("/auth/signup")
				.send({ ...credentials, acceptPolicy: false });

			const user = await dbService.model.user.findOne({
				email: credentials.email,
			});

			expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			expect(user).toBeFalsy();
		});
	});

	describe(`POST /auth/login`, () => {
		it.concurrent("should authorize", async () => {
			const { user, password } = await utilsService.createUser(
				RolesEnum.User,
				server
			);

			const response = await request(server).post("/auth/login").send({
				email: user.email,
				password,
			});

			expect(response.status).toBe(HttpStatus.OK);
			const { header } = response;
			expect(header["set-cookie"]).toBeTruthy();
		});
		it.concurrent("shouldn't authorize - wrong credentials", async () => {
			const { user } = await utilsService.createUser(RolesEnum.User, server);

			const response = await request(server).post("/auth/login").send({
				email: user.email,
				password: "Wrong password",
			});

			expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
		});
	});

	describe(`POST /auth/verify`, () => {
		it.concurrent("shouldn't verify user", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.NotVerifiedUser,
				server
			);

			const response = await request(server)
				.post("/auth/verify")
				.set("Cookie", authCookie)
				.send({ code: faker.number.int().toString() });

			expect(response.status).toBe(HttpStatus.OK);
			const { header } = response;
			expect(header["set-cookie"]).toBeTruthy();
		});
		it.concurrent("should verify user", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.NotVerifiedUser,
				server
			);
			const token = await utilsService.createToken(
				user._id,
				TokenTypesEnum.verification
			);

			const response = await request(server)
				.post("/auth/verify")
				.set("Cookie", authCookie)
				.send({ code: token });

			expect(response.status).toBe(HttpStatus.OK);
		});
	});

	describe(`POST /auth/verify/resend`, () => {
		it.concurrent("should resend token", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.NotVerifiedUser,
				server
			);
			await utilsService.createToken(user._id, TokenTypesEnum.verification);

			const tokenRecord = await dbService.model.token.findOne({
				userId: user._id,
				type: TokenTypesEnum.verification,
			});

			const response = await request(server)
				.post("/auth/verify/resend")
				.set("Cookie", authCookie);

			const newTokenRecord = await dbService.model.token.findOne({
				userId: user._id,
				type: TokenTypesEnum.verification,
			});

			expect(response.status).toBe(HttpStatus.CREATED);
			expect(newTokenRecord.tokenHash).not.toBe(tokenRecord.tokenHash);
		});
	});

	describe(`POST /auth/password`, () => {
		it.concurrent("should change password", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const newPassword = "1234567kkk";
			const response = await request(server)
				.post("/auth/password")
				.set("Cookie", authCookie)
				.send({ password: newPassword });

			const userFromDb = await dbService.model.user.findById(user._id);

			expect(response.status).toBe(HttpStatus.OK);
			expect(
				cryptoService.isMatch(newPassword, userFromDb.password)
			).toBeTruthy();
		});
	});

	describe(`POST /auth/restore/code`, () => {
		it.concurrent("should send restore token", async () => {
			const { user } = await utilsService.createUser(RolesEnum.User, server);

			const mailServiceSendRestoreCodeSpy = jest.spyOn(
				mailService,
				"sendRestoreCode"
			);

			const response = await request(server)
				.post("/auth/restore/code")
				.send({ email: user.email });

			const tokenFromDb = await dbService.model.token.findOne({
				userId: user._id,
				type: TokenTypesEnum.passwordRestore,
			});

			expect(response.status).toBe(HttpStatus.OK);
			expect(mailServiceSendRestoreCodeSpy).toHaveBeenCalledWith(
				user.email,
				TOKEN
			);
			expect(cryptoService.isMatch(TOKEN, tokenFromDb.tokenHash));
		});
	});

	describe(`POST /auth/restore`, () => {
		it.concurrent("should set authCookie", async () => {
			const { user } = await utilsService.createUser(RolesEnum.User, server);
			const token = await utilsService.createRestorePasswordCodeForUser(
				user._id
			);

			const response = await request(server)
				.post("/auth/restore")
				.send({ email: user.email, code: token });

			expect(response.status).toBe(HttpStatus.OK);
			const { header } = response;
			expect(header["set-cookie"]).toBeTruthy();
		});
	});

	describe(`POST /auth/guest`, () => {
		it.concurrent("should create user", async () => {
			const credentials = {
				interfaceLanguage: LanguagesEnum.us,
			};
			const response = await request(server)
				.post("/auth/guest")
				.send(credentials);

			expect(response.status).toBe(HttpStatus.CREATED);
			expect(response.body._id).toBeTruthy();
		});
	});

	describe(`DELETE /auth/account`, () => {
		it.concurrent("should delete account", async () => {
			const { authCookie, user } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			await utilsService.createDictionaries(user._id, 3);
			await utilsService.createTester(user._id, false);

			const response = await request(server)
				.delete("/auth/account")
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
			expect(response.body.deleted).toBeTruthy();

			const dictionariesFromDb = await dbService.model.dictionary.find({
				userId: user._id,
			});
			const testerFromDb = await dbService.model.tester.findOne({
				userId: user._id,
			});
			const userFromDb = await dbService.model.user.findById(user._id);

			expect(dictionariesFromDb.length).toBe(0);
			expect(testerFromDb).toBeFalsy();
			expect(userFromDb).toBeFalsy();
		});
	});
});

afterAll(async () => {
	await app.close();
});
