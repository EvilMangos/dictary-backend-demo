import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { getTestingApp } from "../utils/getTestingApp";
import { UtilsService } from "../utils/utils.service";
import { UserDto } from "../../src/utils/dto/user.dto";
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
	it.concurrent("GET /users/me", async () => {
		const { authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);

		const response = await request(server)
			.get("/users/me")
			.set("Cookie", authCookie);

		expect(response.status).toBe(HttpStatus.OK);
		expect(
			utilsService.checkSchemaValidation(UserDto, response.body)
		).toBeTruthy();
	});
	it.concurrent("PATCH /users/me", async () => {
		const { authCookie } = await utilsService.createUser(
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
			utilsService.checkSchemaValidation(UserDto, response.body)
		).toBeTruthy();
	});
});

afterAll(async () => {
	await app.close();
});
