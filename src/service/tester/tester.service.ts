import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { JwtAuthUserDto } from "../auth/dto/jwt/jwtAuthUser.dto";
import { TesterDto, TesterForCreateDto } from "../../utils/dto/tester.dto";
import { TId } from "../../utils/type/id.type";
import { WordDto } from "../../utils/dto/word.dto";
import { DictionaryService } from "../dictionary/dictionary.service";
import { CreateTesterRequestDto } from "./dto/createTester/createTester.request.dto";
import { WordsFilterDto } from "../dictionary/dto/wordsFilter.dto";
import { AutofillService } from "../autofill/autofill.service";
import { DictionaryRepository } from "../dictionary/dictionary.repository";
import { TesterRepository } from "./tester.repository";
import { TestWordDto } from "./dto/testWord.dto";
import { UserRepository } from "../user/user.repository";
import { RolesLimits } from "shared-structures";
import { WordService } from "../dictionary/word.service";

@Injectable()
export class TesterService {
	constructor(
		private testerRepository: TesterRepository,
		private dictionaryService: DictionaryService,
		private wordService: WordService,
		private dictionaryRepository: DictionaryRepository,
		private autofillService: AutofillService,
		private userRepository: UserRepository
	) {}

	async createTester(
		data: CreateTesterRequestDto,
		user: JwtAuthUserDto
	): Promise<TesterDto> {
		await this.deleteTesterIfExists(user.id);
		const { testersCounter } = await this.userRepository.findById(user.id);
		if (testersCounter + 1 > RolesLimits[user.role].testing) {
			throw new ForbiddenException(
				`For the "${
					user.role
				}" role, the maximum number of testing attempts is set to ${
					RolesLimits[user.role].dictionaries
				} per day`
			);
		}
		const testerDataForCreation = await this.createTestingDataForDictionary(
			data,
			user
		);
		const tester = await this.testerRepository.create(testerDataForCreation);
		await this.userRepository.updateOne(user.id, {
			testersCounter: testersCounter + 1,
		});
		return tester;
	}

	async deleteTesterIfExists(userId: TId) {
		await this.testerRepository.deleteByUserId(userId);
	}

	async createTestingDataForDictionary(
		params: CreateTesterRequestDto,
		user: JwtAuthUserDto
	): Promise<TesterForCreateDto> {
		const filter: WordsFilterDto = {
			direction: params.direction,
			wordsDateLimit: params.wordsDateLimit
				? new Date(params.wordsDateLimit)
				: null,
			wordsNumberLimit: params.wordsNumberLimit,
		};

		const words = await this.wordService.findWordsByDictionaryId(
			params.dictionaryId,
			filter
		);

		if (!words.length) {
			throw new BadRequestException(
				"The number of selected words should be greater than 0."
			);
		}

		const dictionary = await this.dictionaryRepository.findById(
			params.dictionaryId
		);
		const lowerWords = words.map((word) => ({
			...word,
			term: word.term.toLowerCase(),
		}));
		const uniqueWords = this.getUniqueWords(lowerWords);
		const autofilled = await this.autofillService.autofill(
			uniqueWords,
			dictionary.termsLanguage,
			dictionary.definitionsLanguage
		);
		if (autofilled.wasAutofilled) {
			await this.dictionaryService.saveCacheDefinition(
				dictionary._id,
				autofilled.words
			);
		}
		const existenceWords = autofilled.words.filter(
			(word) =>
				word.definitions &&
				word.definitions?.length &&
				word.definitions?.find((definition) => !!definition)
		);
		const shuffledWords = this.getShuffledArray(existenceWords);
		const testWords = this.validateWordsForTester(
			shuffledWords,
			params.isReverseFlow
		);

		if (!testWords.length) {
			throw new BadRequestException(
				"The number of selected words should be greater than 0."
			);
		}

		return {
			userId: user.id,
			words: testWords,
		};
	}

	validateWordsForTester(
		words: WordDto[],
		isReverseFlow = false
	): TestWordDto[] {
		const rightFlowWords = isReverseFlow
			? this.getReverseFlowWords(words)
			: words;
		const uniqueTerms = this.getUniqueTermsForWords(rightFlowWords);

		return uniqueTerms.map((term) => {
			const correctWords = rightFlowWords.filter((elem) => elem.term === term);
			const definitions = correctWords.reduce(
				(accum, current) => accum.concat(current.definitions),
				[]
			);
			return {
				term,
				definitions: definitions.map((definition) => definition.toLowerCase()),
				needAnswers: correctWords.length,
				doneDefinitions: [],
				skipped: false,
			};
		});
	}

	getReverseFlowWords(words: WordDto[]): WordDto[] {
		return words.map((elem) => ({
			term: elem.definitions.join(", "),
			definitions: [elem.term],
			cacheDefinitions: elem.cacheDefinitions,
		}));
	}

	getUniqueTermsForWords(words: WordDto[]): string[] {
		const wordsTerms: string[] = words.map((elem) => elem.term);
		return [...new Set(wordsTerms)];
	}

	getShuffledArray(array: WordDto[]): WordDto[] {
		const randomNumbersArray = array.map(() => Math.random());
		const sortedRandomNumbersArray = randomNumbersArray.slice().sort();

		return sortedRandomNumbersArray.map((sortedNum) => {
			return array[randomNumbersArray.indexOf(sortedNum)];
		});
	}

	getUniqueWords(words: WordDto[]): WordDto[] {
		const uniqueWords = [];
		for (const word of words) {
			const isUnique = !uniqueWords.find(
				(uniqWord) =>
					uniqWord.term.toLowerCase() === word.term.toLowerCase() &&
					JSON.stringify(
						uniqWord.definitions
							?.map((definition) => definition.toLowerCase())
							.sort()
					) ===
						JSON.stringify(
							word.definitions
								?.map((definition) => definition.toLowerCase())
								.sort()
						)
			);
			if (isUnique) {
				uniqueWords.push(word);
			}
		}
		return uniqueWords;
	}
}
