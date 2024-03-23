import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { getTestingApp } from "../utils/getTestingApp";
import { UtilsService } from "../utils/utils.service";
import { ObjectExtended } from "types-extended";
import { RolesEnum } from "shared-structures";
import { getSignUpData } from "../data/auth.data";

let app: INestApplication;
let server: NestApplication;

let utilsService: UtilsService;
beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;
	utilsService = TestingApp.utilsService;
});

describe("User", () => {
	describe("GET /users/me", () => {
		it.concurrent("user", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);

			const response = await request(server)
				.get("/users/me")
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
			expect(response.body._id).toBe(user._id.toString());
		});
		it.concurrent("guest", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);

			const response = await request(server)
				.get("/users/me")
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
			expect(response.body._id).toBe(user._id.toString());
			expect(response.body.email).toBe("JohnDoe@gmail.com");
		});
	});

	it.concurrent("PATCH /users/me", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		const data = getSignUpData();

		const response = await request(server)
			.patch("/users/me")
			.set("Cookie", authCookie)
			.send(data);

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			new ObjectExtended(response.body)
				.sort()
				.withoutTimestamps()
				.getResultAsString()
		).toBe(
			new ObjectExtended({
				...data,
				_id: user._id.toString(),
				role: user.role,
				email: user.email,
				testersCounter: user.testersCounter,
				shouldShowWelcomeMessage: false,
			})
				.sort()
				.exclude(["password", "acceptPolicy"])
				.getResultAsString()
		);
	});
});

afterAll(async () => {
	await app.close();
});
