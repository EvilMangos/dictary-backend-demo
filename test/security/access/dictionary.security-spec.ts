import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { UtilsService } from "../../utils/utils.service";
import { getWords } from "../../data/words.data";
import { getTestingApp } from "../../utils/getTestingApp";
import { RolesEnum } from "shared-structures";
import { ArrayExtended, ObjectExtended } from "types-extended";

let app: INestApplication;
let server: NestApplication;
let utilsService: UtilsService;

beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;

	utilsService = TestingApp.utilsService;
});

describe("Dictionary", () => {
	describe(`GET /dictionaries/:id`, () => {
		it.concurrent("should have access", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);

			const response = await request(server)
				.get(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("should return FORBIDDEN statusCode", async () => {
			const { user } = await utilsService.createUser(RolesEnum.User, server);
			const dictionary = await utilsService.createDictionary(user._id);

			const cheater = await utilsService.createUser(RolesEnum.User, server);

			const response = await request(server)
				.get(`/dictionaries/${dictionary._id}`)
				.set("Cookie", cheater.authCookie);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
	});

	describe(`DELETE /dictionaries/:id`, () => {
		it.concurrent("should have access", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionaries = await utilsService.createDictionaries(user._id, 3);

			const response = await request(server)
				.delete(`/dictionaries/${dictionaries[0]._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("should return FORBIDDEN statusCode", async () => {
			const { user } = await utilsService.createUser(RolesEnum.User, server);
			const dictionaries = await utilsService.createDictionaries(user._id, 3);

			const cheater = await utilsService.createUser(RolesEnum.User, server);

			const response = await request(server)
				.delete(`/dictionaries/${dictionaries[0]._id}`)
				.set("Cookie", cheater.authCookie);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
	});

	describe(`PATCH /dictionaries/:id`, () => {
		it.concurrent("should have access", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionaryForCreate = await utilsService.createDictionary(user._id);
			const words = getWords(4);

			const dictionary = {
				...new ObjectExtended(dictionaryForCreate)
					.withoutTimestamps()
					.getResult(),
				words: new ArrayExtended(words).withoutTimestamps().getResult(),
			};

			const response = await request(server)
				.patch(`/dictionaries/${dictionaryForCreate._id}`)
				.set("Cookie", authCookie)
				.send(dictionary);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("should return FORBIDDEN statusCode", async () => {
			const { user } = await utilsService.createUser(RolesEnum.User, server);
			const dictionaryForCreate = await utilsService.createDictionary(user._id);
			const words = getWords(4);

			const dictionary = {
				...new ObjectExtended(dictionaryForCreate)
					.withoutTimestamps()
					.getResult(),
				words: new ArrayExtended(words).withoutTimestamps().getResult(),
			};

			const cheater = await utilsService.createUser(RolesEnum.User, server);

			const response = await request(server)
				.patch(`/dictionaries/${dictionaryForCreate._id}`)
				.set("Cookie", cheater.authCookie)
				.send(dictionary);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
	});

	describe(`GET /dictionaries/:dictionaryId/words/:wordId`, () => {
		it.concurrent("should have access", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionaryForCreate = await utilsService.createDictionary(user._id);
			const words = await utilsService.addWordsToDictionary(
				dictionaryForCreate._id,
				10
			);

			const response = await request(server)
				.get(`/dictionaries/${dictionaryForCreate._id}/words/${words[0]._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("should return FORBIDDEN statusCode", async () => {
			const { user } = await utilsService.createUser(RolesEnum.User, server);
			const dictionaryForCreate = await utilsService.createDictionary(user._id);
			const words = await utilsService.addWordsToDictionary(
				dictionaryForCreate._id,
				10
			);

			const cheater = await utilsService.createUser(RolesEnum.User, server);

			const response = await request(server)
				.get(`/dictionaries/${dictionaryForCreate._id}/words/${words[0]._id}`)
				.set("Cookie", cheater.authCookie);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
	});
});

afterAll(async () => {
	await app.close();
});
