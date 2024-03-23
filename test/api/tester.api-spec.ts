import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { getTestingApp } from "../utils/getTestingApp";
import { UtilsService } from "../utils/utils.service";
import { CreateTesterResponseDto } from "../../src/service/tester/dto/createTester/createTester.response.dto";
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

describe("Tester", () => {
	it.concurrent("POST /tester", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		const dictionary = await utilsService.createDictionary(user._id);
		await utilsService.addWordsToDictionary(dictionary._id, 10);

		const response = await request(server)
			.post("/tester")
			.set("Cookie", authCookie)
			.send({ dictionaryId: dictionary._id });

		expect(response.status).toBe(HttpStatus.CREATED);
		expect(
			utilsService.checkSchemaValidation(CreateTesterResponseDto, response.body)
		).toBeTruthy();
	});
});

afterAll(async () => {
	await app.close();
});
