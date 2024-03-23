import request from "supertest";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { UtilsService } from "../../utils/utils.service";
import { ObjectExtended } from "types-extended";
import { getTestingApp } from "../../utils/getTestingApp";
import { NestApplication } from "@nestjs/core";
import { RolesEnum } from "shared-structures";

let server: NestApplication;
let app: INestApplication;
let utilsService: UtilsService;

beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;

	utilsService = TestingApp.utilsService;
});

describe("Dictionary", () => {
	describe(`GET /dictionaries/:dictionaryId/words/:wordId`, () => {
		it.concurrent("should return dictionary", async () => {
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
				new ObjectExtended(response.body)
					.exclude(["isAuto"])
					.sort()
					.getResultAsString()
			).toBe(
				new ObjectExtended(words[0])
					.exclude(["cacheDefinitions"])
					.sort()
					.getResultAsString()
			);
		});
	});
});

afterAll(async () => {
	await app.close();
});
