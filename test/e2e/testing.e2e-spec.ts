import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { UtilsService } from "../utils/utils.service";
import { getTestingApp } from "../utils/getTestingApp";
import { DbService } from "../../src/service/db/db.service";
import { RolesEnum } from "shared-structures";

let app: INestApplication;
let server: NestApplication;

let utilsService: UtilsService;
let dbService: DbService;

beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;

	utilsService = TestingApp.utilsService;
	dbService = app.get(DbService);
});

describe("Dictionary", () => {
	describe(`GET /testing`, () => {
		it.concurrent("should return test", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const tester = await utilsService.createTester(user._id);

			const response = await request(server)
				.get(`/testing`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);

			const testerFromDBFirstWord = tester.words[0].term;

			expect(JSON.stringify(response.body)).toBe(
				JSON.stringify({
					test: testerFromDBFirstWord,
					testsLeft: tester.words.length,
					report: null,
				})
			);
		});
		it.concurrent("should delete tester", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const tester = await utilsService.createTester(user._id, true);

			const response = await request(server)
				.get(`/testing`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
			expect(response.body.test).toBeFalsy();
			const testerFromDb = await dbService.model.tester.findById(tester._id);
			expect(testerFromDb).toBeFalsy();
		});
	});

	describe(`POST /testing`, () => {
		it.concurrent("should return message that answer is correct", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const tester = await utilsService.createTester(user._id);

			const response = await request(server)
				.post(`/testing`)
				.set("Cookie", authCookie)
				.send({ answer: tester.words[0].definitions[0] });

			expect(response.status).toBe(HttpStatus.OK);
			expect(
				JSON.stringify({
					answer: response.body.answer,
					result: response.body.result,
				})
			).toBe(
				JSON.stringify({
					answer: response.body.needAnswers
						? null
						: tester.words[0].definitions,
					result: true,
				})
			);
		});
		it.concurrent("should return message that answer is wrong", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			await utilsService.createTester(user._id);

			const response = await request(server)
				.post(`/testing`)
				.set("Cookie", authCookie)
				.send({ answer: "wrong answer" });

			expect(response.status).toBe(HttpStatus.OK);
			expect(JSON.stringify(response.body)).toBe(
				JSON.stringify({
					result: false,
					answer: null,
					needAnswers: response.body.needAnswers,
					doneDefinitions: response.body.doneDefinitions,
				})
			);
		});
	});

	describe(`POST /testing/skip`, () => {
		it.concurrent("should skip word", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const tester = await utilsService.createTester(user._id);

			const response = await request(server)
				.post(`/testing/skip`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
			expect(JSON.stringify(response.body)).toBe(
				JSON.stringify({ answer: tester.words[0].definitions })
			);

			const testerFromDb = await dbService.model.tester.findById(tester._id);

			expect(testerFromDb.words[0].skipped).toBeTruthy();
		});
	});
});

afterAll(async () => {
	await app.close();
});
