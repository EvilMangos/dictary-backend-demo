import { DbService } from "../../src/service/db/db.service";
import { getSignUpData } from "../data/auth.data";
import { UserDto } from "../../src/utils/dto/user.dto";
import { JwtService } from "@nestjs/jwt";
import { DictionaryDto } from "../../src/utils/dto/dictionary.dto";
import { TId } from "../../src/utils/type/id.type";
import { getDictionaryDataForCreate } from "../data/dictionary.data";
import { getWords } from "../data/words.data";
import { CryptoService } from "../../src/service/crypto/crypto.service";
import { TokenTypesEnum } from "../../src/service/token/enum/tokenTypes.enum";
import { getTestingWords } from "../data/testingWords.data";
import { WordDto } from "../../src/utils/dto/word.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TestWordDto } from "../../src/service/tester/dto/testWord.dto";
import { TesterDto } from "../../src/utils/dto/tester.dto";
import {
	LanguagesEnum,
	RolesEnum,
	SortDirectionsEnum,
} from "shared-structures";
import { UserForUpdateDto } from "../../src/service/user/dto/userForUpdate.dto";
import request from "supertest";

export class UtilsService {
	constructor(
		private dbService: DbService,
		private jwtService: JwtService,
		private cryptoService: CryptoService
	) {}

	async createUser(
		role: RolesEnum,
		server: any,
		data: UserForUpdateDto = {}
	): Promise<{
		user: UserDto;
		authCookie: string[];
		password: string;
	}> {
		let password = null;
		let user = null;
		let response = null;
		if (role === RolesEnum.Guest) {
			response = await request(server).post("/auth/guest").send({
				interfaceLanguage: LanguagesEnum.uk,
			});
			user = await this.dbService.model.user.findByIdAndUpdate(
				response.body._id,
				data,
				{ new: true }
			);
		} else {
			const credentials = getSignUpData();
			password = credentials.password;
			user = await this.dbService.model.user.create({
				email: credentials.email,
				password: await this.cryptoService.encrypt(credentials.password),
				role,
				interfaceLanguage: LanguagesEnum.uk,
				...data,
			});
			response = await request(server).post("/auth/login").send(credentials);
		}
		const { header } = response;
		return {
			user,
			password,
			authCookie: [header["set-cookie"]],
		};
	}

	async createDictionaries(
		userId: TId,
		number: number
	): Promise<DictionaryDto[]> {
		const data = [];
		for (let i = 0; i < number; i++) {
			const dictionary = getDictionaryDataForCreate(userId);
			data.push(dictionary);
		}

		return this.dbService.model.dictionary.create(data);
	}

	async createDictionary(userId: TId): Promise<DictionaryDto> {
		const data = getDictionaryDataForCreate(userId);
		const dictionary = await this.dbService.model.dictionary.create(data);
		return dictionary.toObject();
	}

	async addWordsToDictionary(dictionaryId: TId, wordsNumber: number) {
		const words = getWords(wordsNumber);
		const dictionary = await this.dbService.model.dictionary.findOneAndUpdate(
			{ _id: dictionaryId },
			{ words },
			{ new: true }
		);
		return dictionary.toObject().words.map((word) => ({
			...word,
			cacheDefinitions: null,
		}));
	}

	async createTester(userId: TId, isCompleted = false): Promise<TesterDto> {
		let words = getTestingWords(5);
		if (isCompleted) {
			words = words.map((word) => {
				word.needAnswers = 0;
				return word;
			});
		}
		return this.dbService.model.tester.create({ userId, words });
	}

	addQueryParamsToURL(url: string, params: { key: string; value: string }[]) {
		return params.reduce(
			(url, param) => url + "&" + param.key + "=" + param.value,
			url + "?"
		);
	}

	async findDictionaries(
		filter: object,
		sort: { [p: string]: SortDirectionsEnum }
	): Promise<DictionaryDto[]> {
		return this.dbService.model.dictionary.find(filter, null, { sort });
	}

	async createToken(userId: TId, type: TokenTypesEnum): Promise<string> {
		const token = Math.random().toString().slice(2, 8);
		const validTokenData = {
			userId,
			type,
			tokenHash: await this.cryptoService.encrypt(token),
		};
		await this.dbService.model.token.create(validTokenData);

		return token;
	}

	async createVerificationCodeForUser(userId: TId): Promise<string> {
		return this.createToken(userId, TokenTypesEnum.verification);
	}

	async createRestorePasswordCodeForUser(userId: TId): Promise<string> {
		return this.createToken(userId, TokenTypesEnum.passwordRestore);
	}

	wordsToTestWords(words: WordDto[], isReverseFlow = false): TestWordDto[] {
		return words.map((word) =>
			isReverseFlow
				? {
						term: word.definitions.join(", "),
						definitions: [word.term],
						doneDefinitions: [],
						needAnswers: 1,
						skipped: false,
				  }
				: {
						term: word.term,
						definitions: word.definitions,
						doneDefinitions: [],
						needAnswers: 1,
						skipped: false,
				  }
		);
	}

	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	async checkSchemaValidation(schema: any, value: any): Promise<boolean> {
		const testObj = plainToInstance(schema, value);
		const errors = await validate(testObj);
		return errors.length === 0;
	}
}
