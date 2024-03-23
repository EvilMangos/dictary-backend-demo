import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { UtilsService } from "../../utils/utils.service";
import { getTestingApp } from "../../utils/getTestingApp";
import { faker } from "@faker-js/faker";
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

describe("Testing", () => {
	describe(`GET /testing`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const response = await request(server).get(`/testing`);

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.get(`/testing`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.get(`/testing`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent(
			"notVerified - should return FORBIDDEN statusCode",
			async () => {
				const { user, authCookie } = await utilsService.createUser(
					RolesEnum.NotVerifiedUser,
					server
				);
				await utilsService.createTester(user._id);

				const response = await request(server)
					.get(`/testing`)
					.set("Cookie", authCookie);

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);
		it.concurrent("guest - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.get(`/testing`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.get(`/testing`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
	});

	describe(`POST /testing`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const response = await request(server).post(`/testing`);

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.post(`/testing`)
				.set("Cookie", authCookie)
				.send({ answer: faker.word.noun() });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.post(`/testing`)
				.set("Cookie", authCookie)
				.send({ answer: faker.word.noun() });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent(
			"notVerified - should return FORBIDDEN statusCode",
			async () => {
				const { user, authCookie } = await utilsService.createUser(
					RolesEnum.NotVerifiedUser,
					server
				);
				await utilsService.createTester(user._id);

				const response = await request(server)
					.post(`/testing`)
					.set("Cookie", authCookie)
					.send({ answer: faker.word.noun() });

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);
		it.concurrent("guest - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.post(`/testing`)
				.set("Cookie", authCookie)
				.send({ answer: faker.word.noun() });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.post(`/testing`)
				.set("Cookie", authCookie)
				.send({ answer: faker.word.noun() });

			expect(response.status).toBe(HttpStatus.OK);
		});
	});

	describe(`POST /testing/skip`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const response = await request(server).post(`/testing/skip`);

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.post(`/testing/skip`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.post(`/testing/skip`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent(
			"notVerified - should return FORBIDDEN statusCode",
			async () => {
				const { user, authCookie } = await utilsService.createUser(
					RolesEnum.NotVerifiedUser,
					server
				);
				await utilsService.createTester(user._id);

				const response = await request(server)
					.post(`/testing/skip`)
					.set("Cookie", authCookie);

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);
		it.concurrent("guest - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.post(`/testing/skip`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.post(`/testing/skip`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
	});
});

afterAll(async () => {
	await app.close();
});
