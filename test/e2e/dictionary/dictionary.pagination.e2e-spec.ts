import request from "supertest";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { UtilsService } from "../../utils/utils.service";
import { ArrayExtended, ObjectExtended } from "types-extended";
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

describe("Dictionary Pagination", () => {
	describe(`GET /dictionaries/:id`, () => {
		it.concurrent("should return correct words", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const LENGTH = 100;
			const dictionary = await utilsService.createDictionary(user._id);
			const words = await utilsService.addWordsToDictionary(
				dictionary._id,
				LENGTH
			);

			const requestData = [
				{ offset: 0, limit: 40 },
				{ offset: 40, limit: 40 },
				{ offset: 80, limit: 40 },
				{ offset: 120, limit: 40 },
			];

			const promises = requestData.map(async (data) => {
				const url = utilsService.addQueryParamsToURL(
					`/dictionaries/${dictionary._id}`,
					[
						{ key: "offset", value: data.offset.toString() },
						{ key: "limit", value: data.limit.toString() },
					]
				);

				const response = await request(server)
					.get(url)
					.set("Cookie", authCookie);

				expect(response.status).toBe(HttpStatus.OK);
				return response.body.words;
			});

			const results = await Promise.all(promises);
			results.forEach((result, index) => {
				const expectValue = new ArrayExtended(result)
					.exclude(["isAuto"])
					.getResult()
					.map((elem) =>
						new ObjectExtended(elem).exclude(["_id"]).sort().getResultAsString()
					);

				const modelValue =
					requestData[index].offset < LENGTH
						? new ArrayExtended(words)
								.sortByProperty("createdAt")
								.exclude(["_id", "cacheDefinitions"])
								.getResult()
								.slice(
									requestData[index].offset,
									requestData[index].offset + requestData[index].limit
								)
								.map((elem) =>
									new ObjectExtended(elem).sort().getResultAsString()
								)
						: [];
				expect(JSON.stringify(expectValue)).toBe(JSON.stringify(modelValue));
			});
		});
	});
});

afterAll(async () => {
	await app.close();
});
