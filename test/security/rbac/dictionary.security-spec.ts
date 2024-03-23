import request from "supertest";
import { NestApplication } from "@nestjs/core";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { UtilsService } from "../../utils/utils.service";
import { getTestingApp } from "../../utils/getTestingApp";
import { getDictionaryDataForCreate } from "../../data/dictionary.data";
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

describe("Dictionary", () => {
	describe(`POST /dictionaries`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const dictionaryData = getDictionaryDataForCreate();

				const response = await request(server)
					.post(`/dictionaries`)
					.send(dictionaryData);

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return CREATED statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionaryData = getDictionaryDataForCreate(user._id);

			const response = await request(server)
				.post(`/dictionaries`)
				.set("Cookie", authCookie)
				.send(dictionaryData);

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent("premium - should return CREATED statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);
			const dictionaryData = getDictionaryDataForCreate(user._id);

			const response = await request(server)
				.post(`/dictionaries`)
				.set("Cookie", authCookie)
				.send(dictionaryData);

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent(
			"notVerified - should return FORBIDDEN statusCode",
			async () => {
				const { user, authCookie } = await utilsService.createUser(
					RolesEnum.NotVerifiedUser,
					server
				);
				const dictionaryData = getDictionaryDataForCreate(user._id);

				const response = await request(server)
					.post(`/dictionaries`)
					.set("Cookie", authCookie)
					.send(dictionaryData);

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);
		it.concurrent("guest - should return CREATED statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			const dictionaryData = getDictionaryDataForCreate(user._id);

			const response = await request(server)
				.post(`/dictionaries`)
				.set("Cookie", authCookie)
				.send(dictionaryData);

			expect(response.status).toBe(HttpStatus.CREATED);
		});
		it.concurrent("developer - should return CREATED statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);
			const dictionaryData = getDictionaryDataForCreate(user._id);

			const response = await request(server)
				.post(`/dictionaries`)
				.set("Cookie", authCookie)
				.send(dictionaryData);

			expect(response.status).toBe(HttpStatus.CREATED);
		});
	});

	describe(`GET /dictionaries`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const response = await request(server).get(`/dictionaries`);

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);

			const response = await request(server)
				.get(`/dictionaries`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);

			const response = await request(server)
				.get(`/dictionaries`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent(
			"notVerified - should return FORBIDDEN statusCode",
			async () => {
				const { authCookie } = await utilsService.createUser(
					RolesEnum.NotVerifiedUser,
					server
				);

				const response = await request(server)
					.get(`/dictionaries`)
					.set("Cookie", authCookie);

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);
		it.concurrent("guest - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);

			const response = await request(server)
				.get(`/dictionaries`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);

			const response = await request(server)
				.get(`/dictionaries`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
	});

	describe(`GET /dictionaries/:id`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const { user } = await utilsService.createUser(RolesEnum.User, server);
				const dictionary = await utilsService.createDictionary(user._id);

				const response = await request(server).get(
					`/dictionaries/${dictionary._id}`
				);

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);

			const response = await request(server)
				.get(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);

			const response = await request(server)
				.get(`/dictionaries/${dictionary._id}`)
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
				const dictionary = await utilsService.createDictionary(user._id);

				const response = await request(server)
					.get(`/dictionaries/${dictionary._id}`)
					.set("Cookie", authCookie);

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);
		it.concurrent("guest - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);

			const response = await request(server)
				.get(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);

			const response = await request(server)
				.get(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
	});

	describe(`DELETE /dictionaries/:id`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const { user } = await utilsService.createUser(RolesEnum.User, server);
				const dictionary = await utilsService.createDictionary(user._id);

				const response = await request(server).delete(
					`/dictionaries/${dictionary._id}`
				);

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);

			const response = await request(server)
				.delete(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);

			const response = await request(server)
				.delete(`/dictionaries/${dictionary._id}`)
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
				const dictionary = await utilsService.createDictionary(user._id);

				const response = await request(server)
					.delete(`/dictionaries/${dictionary._id}`)
					.set("Cookie", authCookie);

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);
		it.concurrent("guest - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);

			const response = await request(server)
				.delete(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);

			const response = await request(server)
				.delete(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
	});

	describe(`PATCH /dictionaries/:id`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const { user } = await utilsService.createUser(RolesEnum.User, server);
				const dictionary = await utilsService.createDictionary(user._id);
				const dictionaryData = getDictionaryDataForCreate();
				const response = await request(server)
					.patch(`/dictionaries/${dictionary._id}`)
					.send(dictionaryData);

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			const dictionaryData = getDictionaryDataForCreate();

			const response = await request(server)
				.patch(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie)
				.send(dictionaryData);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			const dictionaryData = getDictionaryDataForCreate();

			const response = await request(server)
				.patch(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie)
				.send(dictionaryData);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent(
			"notVerified - should return FORBIDDEN statusCode",
			async () => {
				const { user, authCookie } = await utilsService.createUser(
					RolesEnum.NotVerifiedUser,
					server
				);
				const dictionary = await utilsService.createDictionary(user._id);
				const dictionaryData = getDictionaryDataForCreate();

				const response = await request(server)
					.patch(`/dictionaries/${dictionary._id}`)
					.set("Cookie", authCookie)
					.send(dictionaryData);

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);
		it.concurrent("guest - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			const dictionaryData = getDictionaryDataForCreate();

			const response = await request(server)
				.patch(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie)
				.send(dictionaryData);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			const dictionaryData = getDictionaryDataForCreate();

			const response = await request(server)
				.patch(`/dictionaries/${dictionary._id}`)
				.set("Cookie", authCookie)
				.send(dictionaryData);

			expect(response.status).toBe(HttpStatus.OK);
		});
	});

	describe(`GET /dictionaries/:dictionaryId/words/:wordId`, () => {
		it.concurrent(
			"unauthorized - should return UNAUTHORIZED statusCode",
			async () => {
				const { user } = await utilsService.createUser(RolesEnum.User, server);
				const dictionary = await utilsService.createDictionary(user._id);
				const words = await utilsService.addWordsToDictionary(
					dictionary._id,
					10
				);

				const response = await request(server).get(
					`/dictionaries/${dictionary._id}/words/${words[0]._id}`
				);

				expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
			}
		);
		it.concurrent("user - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.User,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			const words = await utilsService.addWordsToDictionary(dictionary._id, 10);

			const response = await request(server)
				.get(`/dictionaries/${dictionary._id}/words/${words[0]._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("premium - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Premium,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			const words = await utilsService.addWordsToDictionary(dictionary._id, 10);

			const response = await request(server)
				.get(`/dictionaries/${dictionary._id}/words/${words[0]._id}`)
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
				const dictionary = await utilsService.createDictionary(user._id);
				const words = await utilsService.addWordsToDictionary(
					dictionary._id,
					10
				);

				const response = await request(server)
					.get(`/dictionaries/${dictionary._id}/words/${words[0]._id}`)
					.set("Cookie", authCookie);

				expect(response.status).toBe(HttpStatus.FORBIDDEN);
			}
		);
		it.concurrent("guest - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Guest,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			const words = await utilsService.addWordsToDictionary(dictionary._id, 10);

			const response = await request(server)
				.get(`/dictionaries/${dictionary._id}/words/${words[0]._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
		it.concurrent("developer - should return OK statusCode", async () => {
			const { user, authCookie } = await utilsService.createUser(
				RolesEnum.Developer,
				server
			);
			const dictionary = await utilsService.createDictionary(user._id);
			const words = await utilsService.addWordsToDictionary(dictionary._id, 10);

			const response = await request(server)
				.get(`/dictionaries/${dictionary._id}/words/${words[0]._id}`)
				.set("Cookie", authCookie);

			expect(response.status).toBe(HttpStatus.OK);
		});
	});
});

afterAll(async () => {
	await app.close();
});
