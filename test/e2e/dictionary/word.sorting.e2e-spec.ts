import { UtilsService } from "../../utils/utils.service";
import { getTestingApp } from "../../utils/getTestingApp";
import { INestApplication } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import {
	DictionaryWordsSortingEnum,
	SortDirectionsEnum,
} from "shared-structures";
import { wordSortingHelper } from "./wordSorting.helper";

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
	describe(`GET /dictionary/:id with sorting`, () => {
		it.concurrent("term asc", async () => {
			await wordSortingHelper(server, utilsService, {
				sort: DictionaryWordsSortingEnum.term,
				sortDirection: SortDirectionsEnum.asc,
			});
		});
		it.concurrent("term desc", async () => {
			await wordSortingHelper(server, utilsService, {
				sort: DictionaryWordsSortingEnum.term,
				sortDirection: SortDirectionsEnum.desc,
			});
		});
		it.concurrent("date asc", async () => {
			await wordSortingHelper(server, utilsService, {
				sort: DictionaryWordsSortingEnum.date,
				sortDirection: SortDirectionsEnum.asc,
			});
		});
		it.concurrent("date desc", async () => {
			await wordSortingHelper(server, utilsService, {
				sort: DictionaryWordsSortingEnum.date,
				sortDirection: SortDirectionsEnum.desc,
			});
		});
		it.concurrent("number asc", async () => {
			await wordSortingHelper(server, utilsService, {
				sort: DictionaryWordsSortingEnum.default,
				sortDirection: SortDirectionsEnum.asc,
			});
		});
		it.concurrent("number desc", async () => {
			await wordSortingHelper(server, utilsService, {
				sort: DictionaryWordsSortingEnum.default,
				sortDirection: SortDirectionsEnum.desc,
			});
		});
	});
});

afterAll(async () => {
	await app.close();
});
