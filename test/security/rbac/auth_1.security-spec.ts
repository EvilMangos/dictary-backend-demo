import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { UtilsService } from "../../utils/utils.service";
import { getTestingApp } from "../../utils/getTestingApp";
import { getSignUpData } from "../../data/auth.data";
import { faker } from "@faker-js/faker";
import { LanguagesEnum, RolesEnum } from "shared-structures";

let app: INestApplication;
let server: NestApplication;
let utilsService: UtilsService;

beforeAll(async () => {
	const TestingApp = await getTestingApp();
	app = TestingApp.app;
	server = TestingApp.server;

	utilsService = TestingApp.utilsService;
});

describe("Auth 1", () => {
	describe(`POST /auth/signup`, () => {
		it.concurrent(
			"unauthorized - should return CREATED statusCode",
			async () => {
				const credentials = getSignUpData();
				const response = await request(server)
					.post(`/auth/signup`)
					.send(credentials);

				expect(response.status).toBe(HttpStatus.CREATED);
			}
		);
		it.concurrent("user - should return CREATED statusCode", async () => {
			const credentials = getSignUpData();
			const { authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);

			const response = await request(server)
				.post(`/auth/signup`)
				.set("Cookie", authCookie)
				.send(credentials);

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent("premium - should return CREATED statusCode", async () => {
			const credentials = getSignUpData();
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);

			const response = await request(server)
				.post(`/auth/signup`)
				.set("Cookie", authCookie)
				.send(credentials);

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent(
			"notVerified - should return CREATED statusCode",
			async () => {
				const credentials = getSignUpData();
				const { authCookie } = await utilsService.createUser(
					RolesEnum.NotVerifiedUser,
					server
				);

				const response = await request(server)
					.post(`/auth/signup`)
					.set("Cookie", authCookie)
					.send(credentials);

				expect(response.status).toBe(HttpStatus.CREATED);
			}
		);
		it.concurrent("guest - should return CREATED statusCode", async () => {
			const credentials = getSignUpData();
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);

			const response = await request(server)
				.post(`/auth/signup`)
				.set("Cookie", authCookie)
				.send(credentials);

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent("developer - should return CREATED statusCode", async () => {
			const credentials = getSignUpData();
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);

			const response = await request(server)
				.post(`/auth/signup`)
				.set("Cookie", authCookie)
				.send(credentials);

			expect(response.status).toBe(HttpStatus.CREATED);
		});
	});

	describe(`POST /auth/login`, () => {
		it.concurrent("unauthorized - should return OK statusCode", async () => {
			const { user, password } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const response = await request(server).post(`/auth/login`).send({
				email: user.email,
				password,
			});

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("user - should return OK statusCode", async () => {
			const { user, authCookie, password } = await utilsService.createUser(
				RolesEnum.User,
				server
			);

			const response = await request(server)
				.post(`/auth/login`)
				.set("Cookie", authCookie)
				.send({
					email: user.email,
					password,
				});

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { user, authCookie, password } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);

			const response = await request(server)
				.post(`/auth/login`)
				.set("Cookie", authCookie)
				.send({
					email: user.email,
					password,
				});

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("notVerified - should return OK statusCode", async () => {
			const { user, authCookie, password } = await utilsService.createUser(
				RolesEnum.NotVerifiedUser,
				server
			);

			const response = await request(server)
				.post(`/auth/login`)
				.set("Cookie", authCookie)
				.send({
					email: user.email,
					password,
				});

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("guest - should return BAD_REQUEST statusCode", async () => {
			const { user, authCookie, password } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);

			const response = await request(server)
				.post(`/auth/login`)
				.set("Cookie", authCookie)
				.send({
					email: user.email,
					password,
				});

			expect(response.status).toBe(HttpStatus.BAD_REQUEST);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { user, authCookie, password } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);

			const response = await request(server)
				.post(`/auth/login`)
				.set("Cookie", authCookie)
				.send({
					email: user.email,
					password,
				});

			expect(response.status).toBe(HttpStatus.OK);
		});
	});

	describe(`POST /auth/verify`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const response = await request(server)
					.post(`/auth/verify`)
					.send({ code: faker.number.int().toString().slice(0, 6) });

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return FORBIDDEN statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);

			const response = await request(server)
				.post(`/auth/verify`)
				.set("Cookie", authCookie)
				.send({ code: faker.number.int().toString().slice(0, 6) });

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
		it.concurrent("premium - should return FORBIDDEN statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);

			const response = await request(server)
				.post(`/auth/verify`)
				.set("Cookie", authCookie)
				.send({ code: faker.number.int().toString().slice(0, 6) });

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
		it.concurrent("notVerified - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.NotVerifiedUser,
				server
			);

			const response = await request(server)
				.post(`/auth/verify`)
				.set("Cookie", authCookie)
				.send({ code: faker.number.int().toString().slice(0, 6) });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("guest - should return FORBIDDEN statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);

			const response = await request(server)
				.post(`/auth/verify`)
				.set("Cookie", authCookie)
				.send({ code: faker.number.int().toString().slice(0, 6) });

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
		it.concurrent(
			"developer - should return FORBIDDEN statusCode",
			async () => {
				const { authCookie } = await utilsService.createUser(
					RolesEnum.Developer,
					server
				);

				const response = await request(server)
					.post(`/auth/verify`)
					.set("Cookie", authCookie)
					.send({ code: faker.number.int().toString().slice(0, 6) });

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);
	});

	describe(`POST /auth/verify/resend`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const response = await request(server).post(`/auth/verify/resend`);

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return FORBIDDEN statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);

			const response = await request(server)
				.post(`/auth/verify/resend`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
		it.concurrent("premium - should return FORBIDDEN statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);

			const response = await request(server)
				.post(`/auth/verify/resend`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
		it.concurrent(
			"notVerified - should return CREATED statusCode",
			async () => {
				const { authCookie } = await utilsService.createUser(
					RolesEnum.NotVerifiedUser,
					server
				);

				const response = await request(server)
					.post(`/auth/verify/resend`)
					.set("Cookie", authCookie);

				expect(response.status).toBe(HttpStatus.CREATED);
			}
		);
		it.concurrent("guest - should return FORBIDDEN statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);

			const response = await request(server)
				.post(`/auth/verify/resend`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
		it.concurrent(
			"developer - should return FORBIDDEN statusCode",
			async () => {
				const { authCookie } = await utilsService.createUser(
					RolesEnum.Developer,
					server
				);

				const response = await request(server)
					.post(`/auth/verify/resend`)
					.set("Cookie", authCookie);

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);
	});

	describe(`POST /auth/password`, () => {
		const { password } = getSignUpData();
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const response = await request(server)
					.post(`/auth/password`)
					.send({ password });

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const { password } = getSignUpData();

			const response = await request(server)
				.post(`/auth/password`)
				.set("Cookie", authCookie)
				.send({ password });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);
			const { password } = getSignUpData();

			const response = await request(server)
				.post(`/auth/password`)
				.set("Cookie", authCookie)
				.send({ password });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("notVerified - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.NotVerifiedUser,
				server
			);
			const { password } = getSignUpData();

			const response = await request(server)
				.post(`/auth/password`)
				.set("Cookie", authCookie)
				.send({ password });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("guest - should return FORBIDDEN statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			const { password } = getSignUpData();

			const response = await request(server)
				.post(`/auth/password`)
				.set("Cookie", authCookie)
				.send({ password });

			expect(response.status).toBe(HttpStatus.FORBIDDEN);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);
			const { password } = getSignUpData();

			const response = await request(server)
				.post(`/auth/password`)
				.set("Cookie", authCookie)
				.send({ password });

			expect(response.status).toBe(HttpStatus.OK);
		});
	});

	describe(`POST /auth/restore/code`, () => {
		it.concurrent("unauthorized - should return OK statusCode", async () => {
			const response = await request(server)
				.post(`/auth/restore/code`)
				.send({ email: faker.internet.email() });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("user - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);

			const response = await request(server)
				.post(`/auth/restore/code`)
				.set("Cookie", authCookie)
				.send({ email: faker.internet.email() });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);

			const response = await request(server)
				.post(`/auth/restore/code`)
				.set("Cookie", authCookie)
				.send({ email: faker.internet.email() });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("notVerified - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.NotVerifiedUser,
				server
			);

			const response = await request(server)
				.post(`/auth/restore/code`)
				.set("Cookie", authCookie)
				.send({ email: faker.internet.email() });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("guest - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);

			const response = await request(server)
				.post(`/auth/restore/code`)
				.set("Cookie", authCookie)
				.send({ email: faker.internet.email() });

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);

			const response = await request(server)
				.post(`/auth/restore/code`)
				.set("Cookie", authCookie)
				.send({ email: faker.internet.email() });

			expect(response.status).toBe(HttpStatus.OK);
		});
	});

	describe(`POST /auth/restore`, () => {
		it.concurrent("unauthorized - should return OK statusCode", async () => {
			const email = faker.internet.email();
			const response = await request(server)
				.post(`/auth/restore`)
				.send({
					email,
					code: faker.number.int().toString().slice(0, 6),
				});

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("user - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);

			const response = await request(server)
				.post(`/auth/restore`)
				.set("Cookie", authCookie)
				.send({
					email: faker.internet.email(),
					code: faker.number.int().toString().slice(0, 6),
				});

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);

			const response = await request(server)
				.post(`/auth/restore`)
				.set("Cookie", authCookie)
				.send({
					email: faker.internet.email(),
					code: faker.number.int().toString().slice(0, 6),
				});

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("notVerified - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.NotVerifiedUser,
				server
			);

			const response = await request(server)
				.post(`/auth/restore`)
				.set("Cookie", authCookie)
				.send({
					email: faker.internet.email(),
					code: faker.number.int().toString().slice(0, 6),
				});

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("guest - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);

			const response = await request(server)
				.post(`/auth/restore`)
				.set("Cookie", authCookie)
				.send({
					email: faker.internet.email(),
					code: faker.number.int().toString().slice(0, 6),
				});

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);

			const response = await request(server)
				.post(`/auth/restore`)
				.set("Cookie", authCookie)
				.send({
					email: faker.internet.email(),
					code: faker.number.int().toString().slice(0, 6),
				});

			expect(response.status).toBe(HttpStatus.OK);
		});
	});

	describe(`POST /auth/guest`, () => {
		it.concurrent("unauthorized - should return OK statusCode", async () => {
			const response = await request(server).post(`/auth/guest`).send({
				interfaceLanguage: LanguagesEnum.uk,
			});

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent("user - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);

			const response = await request(server)
				.post(`/auth/guest`)
				.set("Cookie", authCookie)
				.send({
					interfaceLanguage: LanguagesEnum.uk,
				});

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);

			const response = await request(server)
				.post(`/auth/guest`)
				.set("Cookie", authCookie)
				.send({
					interfaceLanguage: LanguagesEnum.uk,
				});

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent("notVerified - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.NotVerifiedUser,
				server
			);

			const response = await request(server)
				.post(`/auth/guest`)
				.set("Cookie", authCookie)
				.send({
					interfaceLanguage: LanguagesEnum.uk,
				});

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent("guest - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);

			const response = await request(server)
				.post(`/auth/guest`)
				.set("Cookie", authCookie)
				.send({
					interfaceLanguage: LanguagesEnum.uk,
				});

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);

			const response = await request(server)
				.post(`/auth/guest`)
				.set("Cookie", authCookie)
				.send({
					interfaceLanguage: LanguagesEnum.uk,
				});

			expect(response.status).toBe(HttpStatus.CREATED);
		});
	});
});

afterAll(async () => {
	await app.close();
});
