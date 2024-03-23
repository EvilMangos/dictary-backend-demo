import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { getTestingApp } from "../utils/getTestingApp";
import { UtilsService } from "../utils/utils.service";
import { GetTestResponseDto } from "../../src/service/testing/dto/getTest/getTest.response.dto";
import { CheckAnswerResponseDto } from "../../src/service/testing/dto/checkAnswer/checkAnswer.response.dto";
import { SkipWordResponseDto } from "../../src/service/testing/dto/skipWord/skipWord.response.dto";
import { RolesEnum } from "shared-structures";

let app: INestApplication;
let server: NestApplication;

let utilsService: UtilsService;
beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;
	utilsService = TestingApp.utilsService;
});

describe("Testing", () => {
	it.concurrent("GET /testing", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		await utilsService.createTester(user._id);

		const response = await request(server)
			.get(`/testing`)
			.set("Cookie", authCookie);

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			utilsService.checkSchemaValidation(GetTestResponseDto, response.body)
		).toBeTruthy();
	});
	it.concurrent("POST /testing", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		const tester = await utilsService.createTester(user._id);

		const response = await request(server)
			.post(`/testing`)
			.set("Cookie", authCookie)
			.send({ answer: tester.words[0].definitions[0] });

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			utilsService.checkSchemaValidation(CheckAnswerResponseDto, response.body)
		).toBeTruthy();
	});
	it.concurrent("POST /testing/skip", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		await utilsService.createTester(user._id);

		const response = await request(server)
			.post(`/testing/skip`)
			.set("Cookie", authCookie);

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			utilsService.checkSchemaValidation(SkipWordResponseDto, response.body)
		).toBeTruthy();
	});
});

afterAll(async () => {
	await app.close();
});
