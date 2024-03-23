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

describe("Auth 2", () => {
	describe(`DELETE /auth/account`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const response = await request(server).delete(`/auth/account`);

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);

			const response = await request(server)
				.delete(`/auth/account`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);

			const response = await request(server)
				.delete(`/auth/account`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("notVerified - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.NotVerifiedUser,
				server
			);

			const response = await request(server)
				.delete(`/auth/account`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("guest - should return FORBIDDEN statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);

			const response = await request(server)
				.delete(`/auth/account`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);

			const response = await request(server)
				.delete(`/auth/account`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
	});
});

afterAll(async () => {
	await app.close();
});
