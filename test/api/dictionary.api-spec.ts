import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { getTestingApp } from "../utils/getTestingApp";
import { UtilsService } from "../utils/utils.service";
import { getDictionaryDataForCreate } from "../data/dictionary.data";
import { ArrayExtended, ObjectExtended } from "types-extended";
import { getWords } from "../data/words.data";
import { DictionaryDto } from "../../src/utils/dto/dictionary.dto";
import { GetDictionariesResponseDto } from "../../src/service/dictionary/dto/getDictionaries/getDictionaries.response.dto";
import { RolesEnum } from "shared-structures";
import { CreateDictionaryResponseDto } from "../../src/service/dictionary/dto/createDictionary/createDictionary.response.dto";
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

describe("Dictionary", () => {
	it.concurrent("POST /dictionaries", async () => {
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
		expect(
			utilsService.checkSchemaValidation(
				CreateDictionaryResponseDto,
				response.body
			)
		).toBeTruthy();
	});
	it.concurrent("GET /dictionaries", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		await utilsService.createDictionaries(user._id, 3);

		const response = await request(server)
			.get("/dictionaries")
			.set("Cookie", authCookie);

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			utilsService.checkSchemaValidation(
				GetDictionariesResponseDto,
				response.body
			)
		).toBeTruthy();
	});
	it.concurrent("GET /dictionaries/:id", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		const dictionary = await utilsService.createDictionary(user._id);

		const response = await request(server)
			.get(`/dictionaries/${dictionary._id}`)
			.set("Cookie", authCookie);

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			utilsService.checkSchemaValidation(DictionaryDto, response.body)
		).toBeTruthy();
	});
	it.concurrent("DELETE /dictionaries/:id", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		const dictionaries = await utilsService.createDictionaries(user._id, 3);

		const response = await request(server)
			.delete(`/dictionaries/${dictionaries[0]._id}`)
			.set("Cookie", authCookie);

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			utilsService.checkSchemaValidation(DeletedDto, response.body)
		).toBeTruthy();
	});
	it.concurrent("PATCH /dictionaries/:id", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		const dictionaryForCreate = await utilsService.createDictionary(user._id);
		const words = new ArrayExtended(getWords(4))
			.withoutTimestamps()
			.getResult();

		const dictionary = {
			...new ObjectExtended(dictionaryForCreate)
				.withoutTimestamps()
				.getResult(),
			words,
		};

		const response = await request(server)
			.patch(`/dictionaries/${dictionaryForCreate._id}`)
			.set("Cookie", authCookie)
			.send(dictionary);

		expect(response.status).toBe(HttpStatus.OK);
	});
});

afterAll(async () => {
	await app.close();
});
