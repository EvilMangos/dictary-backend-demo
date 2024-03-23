import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { UtilsService } from "../../utils/utils.service";
import { getTestingApp } from "../../utils/getTestingApp";
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
	describe(`POST /tester`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const { user } = await utilsService.createUser(RolesEnum.User, server);
				const dictionary = await utilsService.createDictionary(user._id);
				await utilsService.addWordsToDictionary(dictionary._id, 10);

				const response = await request(server)
					.post(`/tester`)
					.send({ dictionaryId: dictionary._id });

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return CREATED statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			await utilsService.addWordsToDictionary(dictionary._id, 10);

			const response = await request(server)
				.post(`/tester`)
				.set("Cookie", authCookie)
				.send({ dictionaryId: dictionary._id });

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent("premium - should return CREATED statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			await utilsService.addWordsToDictionary(dictionary._id, 10);

			const response = await request(server)
				.post(`/tester`)
				.set("Cookie", authCookie)
				.send({ dictionaryId: dictionary._id });

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent(
			"notVerified - should return FORBIDDEN statusCode",
			async () => {
				const { user, authCookie } = await utilsService.createUser(
					RolesEnum.NotVerifiedUser,
					server
				);
				const dictionary = await utilsService.createDictionary(user._id);
				await utilsService.addWordsToDictionary(dictionary._id, 10);

				const response = await request(server)
					.post(`/tester`)
					.set("Cookie", authCookie)
					.send({ dictionaryId: dictionary._id });

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);

		it.concurrent("guest - should return CREATED statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			await utilsService.addWordsToDictionary(dictionary._id, 10);

			const response = await request(server)
				.post(`/tester`)
				.set("Cookie", authCookie)
				.send({ dictionaryId: dictionary._id });

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent("developer - should return CREATED statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			await utilsService.addWordsToDictionary(dictionary._id, 10);

			const response = await request(server)
				.post(`/tester`)
				.set("Cookie", authCookie)
				.send({ dictionaryId: dictionary._id });

			expect(response.status).toBe(HttpStatus.CREATED);
		});
	});
});

afterAll(async () => {
	await app.close();
});
