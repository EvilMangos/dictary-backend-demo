import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { getTestingApp } from "../utils/getTestingApp";
import { UtilsService } from "../utils/utils.service";
import { RolesEnum } from "shared-structures";
import { WordWithAutofill } from "../../src/service/dictionary/dto/dictionaryWithAutofill.dto";

let app: INestApplication;
let server: NestApplication;

let utilsService: UtilsService;
beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;
	utilsService = TestingApp.utilsService;
});

describe("Word", () => {
	it.concurrent("GET /dictionaries/:dictionaryId/words/:wordId", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		const dictionary = await utilsService.createDictionary(user._id);
		const words = await utilsService.addWordsToDictionary(dictionary._id, 10);

		const response = await request(server)
			.get(`/dictionaries/${dictionary._id}/words/${words[0]._id}`)
			.set("Cookie", authCookie);

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			utilsService.checkSchemaValidation(WordWithAutofill, response.body)
		).toBeTruthy();
	});
});

afterAll(async () => {
	await app.close();
});
