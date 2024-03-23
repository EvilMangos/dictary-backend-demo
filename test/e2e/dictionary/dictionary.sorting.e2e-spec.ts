import { UtilsService } from "../../utils/utils.service";
import { dictionarySortingHelper } from "./dictionarySorting.helper";
import { getTestingApp } from "../../utils/getTestingApp";
import { INestApplication } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { DictionarySortingEnum, SortDirectionsEnum } from "shared-structures";

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
	describe(`GET /dictionaries with sorting`, () => {
		it.concurrent("name asc", async () => {
			await dictionarySortingHelper(server, utilsService, {
				sort: DictionarySortingEnum.name,
				sortDirection: SortDirectionsEnum.asc,
			});
		});
		it.concurrent("name desc", async () => {
			await dictionarySortingHelper(server, utilsService, {
				sort: DictionarySortingEnum.name,
				sortDirection: SortDirectionsEnum.desc,
			});
		});
		it.concurrent("date asc", async () => {
			await dictionarySortingHelper(server, utilsService, {
				sort: DictionarySortingEnum.date,
				sortDirection: SortDirectionsEnum.asc,
			});
		});
		it.concurrent("date desc", async () => {
			await dictionarySortingHelper(server, utilsService, {
				sort: DictionarySortingEnum.date,
				sortDirection: SortDirectionsEnum.desc,
			});
		});
		it.concurrent("words asc", async () => {
			await dictionarySortingHelper(server, utilsService, {
				sort: DictionarySortingEnum.words,
				sortDirection: SortDirectionsEnum.asc,
			});
		});
		it.concurrent("words desc", async () => {
			await dictionarySortingHelper(server, utilsService, {
				sort: DictionarySortingEnum.words,
				sortDirection: SortDirectionsEnum.desc,
			});
		});
	});
});

afterAll(async () => {
	await app.close();
});
