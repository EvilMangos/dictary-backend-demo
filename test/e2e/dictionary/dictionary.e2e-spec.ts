import request from "supertest";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { DbService } from "../../../src/service/db/db.service";
import { getDictionaryDataForCreate } from "../../data/dictionary.data";
import { UtilsService } from "../../utils/utils.service";
import { getWords } from "../../data/words.data";
import { ArrayExtended, ObjectExtended } from "types-extended";
import { getTestingApp } from "../../utils/getTestingApp";
import { NestApplication } from "@nestjs/core";
import { RolesEnum } from "shared-structures";
import { WordForUpdate } from "../../../src/service/dictionary/dto/updateDictionary/updateDictionary.request.dto";

let server: NestApplication;
let app: INestApplication;
let dbService: DbService;
let utilsService: UtilsService;

beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;

	utilsService = TestingApp.utilsService;
	dbService = app.get(DbService);
});

describe("Dictionary", () => {
	describe(`POST /dictionaries`, () => {
		it.concurrent("should create dictionary", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionaryData = getDictionaryDataForCreate(user._id);

			const response = await request(server)
				.post("/dictionaries")
				.set("Cookie", authCookie)
				.send(dictionaryData);

			expect(response.status).toBe(HttpStatus.CREATED);
		});
	});

	describe(`GET /dictionaries`, () => {
		it.concurrent("should return dictionaries list", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionaries = await utilsService.createDictionaries(user._id, 3);

			const response = await request(server)
				.get("/dictionaries")
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
			expect(response.body.data.length).toBe(dictionaries.length);

			const responseIds = response.body.data.map((value) => value._id).sort();
			const modelIds = dictionaries.map((value) => value._id).sort();

			expect(JSON.stringify(responseIds)).toBe(JSON.stringify(modelIds));
		});
	});

	describe(`GET /dictionaries/:id`, () => {
		it.concurrent("should return dictionary", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);

			const response = await request(server)
				.get(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);

			const validDictionary = {
				...dictionary,
				_id: dictionary._id.toString(),
				wordsNumber: 0,
			};
			delete validDictionary.userId;

			expect(new ObjectExtended(response.body).sort().getResultAsString()).toBe(
				new ObjectExtended(validDictionary).sort().getResultAsString()
			);
		});
	});

	describe(`DELETE /dictionaries/:id`, () => {
		it.concurrent("should delete dictionary", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionaries = await utilsService.createDictionaries(user._id, 3);

			const response = await request(server)
				.delete(`/dictionaries/${dictionaries[0]._id}`)
				.set("Cookie", authCookie);

			dictionaries.shift();

			expect(response.status).toBe(HttpStatus.OK);

			const dictionariesFromDb = await dbService.model.dictionary.find({
				userId: user._id,
			});

			const resultIds = dictionariesFromDb.map((value) => value._id).sort();
			const modelIds = dictionaries.map((value) => value._id).sort();

			expect(dictionaries.length).toBe(dictionariesFromDb.length);
			expect(JSON.stringify(resultIds)).toBe(JSON.stringify(modelIds));
		});
	});

	describe(`PATCH /dictionaries/:id`, () => {
		it.concurrent("should update dictionary", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionaryForCreate = await utilsService.createDictionary(user._id);
			const words = getWords(4).map((word) => ({ ...word, isCreated: true }));
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

			const dictionaryFromDB = await dbService.model.dictionary.findById(
				dictionaryForCreate._id,
				{ "words.createdAt": 0, "words._id": 0 }
			);

			const dictionaryObject = dictionaryFromDB.toObject();
			// @ts-ignore
			dictionaryObject.words = new ArrayExtended(dictionaryObject.words)
				.withoutTimestamps()
				.exclude(["cacheDefinitions"])
				.getResult();
			const result = new ObjectExtended(dictionaryObject)
				.withoutTimestamps()
				.sort()
				.getResultAsString();
			expect(result).toBe(
				new ObjectExtended({
					...dictionary,
					words: new ArrayExtended(dictionary.words)
						.withoutTimestamps()
						.exclude(["isCreated"])
						.getResult(),
				})
					.withoutTimestamps()
					.sort()
					.getResultAsString()
			);
		});

		it.concurrent("should part update dictionary words", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionaryForCreate = await utilsService.createDictionary(user._id);
			const words = await utilsService.addWordsToDictionary(
				dictionaryForCreate._id,
				30
			);
			const createdWords: WordForUpdate[] = getWords(4).map((word) => ({
				...word,
				isCreated: true,
			}));
			const wordsForUpdate = structuredClone(createdWords);
			wordsForUpdate.push({ ...words[3], term: "1234" });
			words[3].term = "1234";
			wordsForUpdate.push({ ...words[4], term: "123456" });
			words[4].term = "123456";
			wordsForUpdate.push({ ...words[24], isDeleted: true });
			words.splice(24, 1);

			const dictionary = {
				words: new ArrayExtended(wordsForUpdate)
					.withoutTimestamps()
					.getResult(),
			};

			const response = await request(server)
				.patch(`/dictionaries/${dictionaryForCreate._id}`)
				.set("Cookie", authCookie)
				.send(dictionary);

			expect(response.status).toBe(HttpStatus.OK);

			const dictionaryFromDB = await dbService.model.dictionary.findById(
				dictionaryForCreate._id,
				{ "words.createdAt": 0, "words._id": 0 }
			);

			const dictionaryObject = dictionaryFromDB.toObject();
			// @ts-ignore
			dictionaryObject.words = new ArrayExtended(dictionaryObject.words)
				.withoutTimestamps()
				.exclude(["cacheDefinitions", "_id"])
				.getResult();
			const result = new ObjectExtended(dictionaryObject)
				.withoutTimestamps()
				.sort()
				.getResult();
			// @ts-ignore
			expect(JSON.stringify(result.words)).toBe(
				new ArrayExtended([...words, ...createdWords])
					.withoutTimestamps()
					.exclude(["isCreated", "cacheDefinitions", "_id"])
					.getResultAsString()
			);
		});
	});
});

afterAll(async () => {
	await app.close();
});
