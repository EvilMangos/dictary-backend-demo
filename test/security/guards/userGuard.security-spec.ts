import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { getTestingApp } from "../../utils/getTestingApp";
import { UtilsService } from "../../utils/utils.service";
import { RolesEnum } from "shared-structures";
import { UserRepository } from "../../../src/service/user/user.repository";

let app: INestApplication;
let server: NestApplication;

let userRepository: UserRepository;

let utilsService: UtilsService;
beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;
	userRepository = TestingApp.app.get(UserRepository);
	utilsService = TestingApp.utilsService;
});

describe("UserGuard", () => {
	it.concurrent(" /users/me", async () => {
		const { user, authCookie } = await utilsService.createUser(
			RolesEnum.User,
			server
		);
		await userRepository.deleteById(user._id);

		const response = await request(server)
			.get("/users/me")
			.set("Cookie", authCookie);

		expect(response.status).toBe(HttpStatus.FORBIDDEN);
	});
});

afterAll(async () => {
	await app.close();
});
