import request from "supertest";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { getDictionaryDataForCreate } from "../../data/dictionary.data";
import { UtilsService } from "../../utils/utils.service";
import { getWords } from "../../data/words.data";
import { ArrayExtended } from "types-extended";
import { getTestingApp } from "../../utils/getTestingApp";
import { NestApplication } from "@nestjs/core";
import { RolesEnum, RolesLimits } from "shared-structures";

let server: NestApplication;
let app: INestApplication;
let utilsService: UtilsService;

beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;

	utilsService = TestingApp.utilsService;
});

describe("Dictionary limits", () => {
	describe(`POST /dictionaries`, () => {
		it.concurrent("guest - shouldn't create dictionary", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			await utilsService.createDictionaries(
				user._id,
				RolesLimits[user.role].dictionaries
			);
			const dictionaryData = getDictionaryDataForCreate(user._id);

			const response = await request(server)
				.post("/dictionaries")
				.set("Cookie", authCookie)
				.send(dictionaryData);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
		it.concurrent("user - shouldn't create dictionary", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			await utilsService.createDictionaries(
				user._id,
				RolesLimits[user.role].dictionaries
			);
			const dictionaryData = getDictionaryDataForCreate(user._id);

			const response = await request(server)
				.post("/dictionaries")
				.set("Cookie", authCookie)
				.send(dictionaryData);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
	});
	describe(`PATCH /dictionaries/:id`, () => {
		it("guest - shouldn't update dictionary", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			const dictionaryForCreate = await utilsService.createDictionary(user._id);
			const words = new ArrayExtended(
				getWords(RolesLimits[user.role].words + 1).map((word) => ({
					...word,
					isCreated: true,
				}))
			)
				.withoutTimestamps()
				.getResult();

			const updateData = {
				words,
			};

			const response = await request(server)
				.patch(`/dictionaries/${dictionaryForCreate._id}`)
				.set("Cookie", authCookie)
				.send(updateData);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
		it("user - shouldn't update dictionary", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionaryForCreate = await utilsService.createDictionary(user._id);
			const words = new ArrayExtended(
				getWords(RolesLimits[user.role].words + 1).map((word) => ({
					...word,
					isCreated: true,
				}))
			)
				.withoutTimestamps()
				.getResult();

			const updateData = {
				words,
			};

			const response = await request(server)
				.patch(`/dictionaries/${dictionaryForCreate._id}`)
				.set("Cookie", authCookie)
				.send(updateData);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
	});
});

afterAll(async () => {
	await app.close();
});
