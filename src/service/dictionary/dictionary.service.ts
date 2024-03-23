import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { CreateDictionaryRequestDto } from "./dto/createDictionary/createDictionary.request.dto";
import {
	DictionaryDto,
	DictionaryForCreateDto,
} from "../../utils/dto/dictionary.dto";
import { JwtAuthUserDto } from "../auth/dto/jwt/jwtAuthUser.dto";
import { TId } from "../../utils/type/id.type";
import { WordDto } from "../../utils/dto/word.dto";
import { GetDictionariesRequestDto } from "./dto/getDictionaries/getDictionaries.request.dto";
import {
	UpdateDictionaryRequestDto,
	WordForUpdate,
	WordForUpdateWithCache,
} from "./dto/updateDictionary/updateDictionary.request.dto";
import { DictionaryRepository } from "./dictionary.repository";
import { AutofillService } from "../autofill/autofill.service";
import { GetDictionaryRequestDto } from "./dto/getDictionary/getDictionary.request.dto";
import { RolesLimits } from "shared-structures";
import {
	DictionaryWithAutofillDto,
	WordWithAutofill,
} from "./dto/dictionaryWithAutofill.dto";
import { WordRepository } from "./word.repository";
import { WordService } from "./word.service";

@Injectable()
export class DictionaryService {
	constructor(
		private dictionaryRepository: DictionaryRepository,
		private wordRepository: WordRepository,
		private autofillService: AutofillService,
		private wordService: WordService
	) {}

	async create(
		data: CreateDictionaryRequestDto,
		user: JwtAuthUserDto
	): Promise<DictionaryDto> {
		const dictionaries = await this.dictionaryRepository.findByUser(user.id);
		if (dictionaries.length + 1 > RolesLimits[user.role].dictionaries) {
			throw new ForbiddenException(
				`For the "${
					user.role
				}" role, the maximum number of dictionaries is set to ${
					RolesLimits[user.role].dictionaries
				}`
			);
		}
		const dictionaryForCreate = await this.modifyForCreation(data, user);
		return this.dictionaryRepository.create(dictionaryForCreate);
	}

	async modifyForCreation(
		data: CreateDictionaryRequestDto,
		user: JwtAuthUserDto
	): Promise<DictionaryForCreateDto> {
		return {
			userId: user.id,
			...data,
			words: [],
		};
	}

	async findByUser(
		user: JwtAuthUserDto,
		params: GetDictionariesRequestDto
	): Promise<DictionaryDto[]> {
		return this.dictionaryRepository.findByUser(
			user.id,
			params.filter,
			params.sort,
			params.sortDirection
		);
	}

	async getDictionary(
		id: TId,
		user: JwtAuthUserDto,
		params: GetDictionaryRequestDto
	): Promise<DictionaryWithAutofillDto> {
		const dictionary = await this.dictionaryRepository.findById(id);

		if (!dictionary) {
			throw new NotFoundException("Dictionary not found");
		}
		if (dictionary.userId.toString() !== user.id.toString()) {
			throw new ForbiddenException("Access is denied");
		}

		const words =
			params.sort ||
			params.filter ||
			params.offset ||
			params.limit ||
			params.isReverted
				? await this.wordService.getDictionaryWords(id, params)
				: dictionary.words;
		if (params.isReverted) {
			words.reverse();
		}

		const validWords = words.map((word) => ({
			...word,
			cacheDefinitions: word.cacheDefinitions?.length
				? word.cacheDefinitions
				: null,
		}));

		const autofilled = await this.autofillService.autofill(
			validWords,
			dictionary.termsLanguage,
			dictionary.definitionsLanguage
		);

		if (autofilled.wasAutofilled) {
			await this.saveCacheDefinition(dictionary._id, autofilled.words);
		}

		return {
			...dictionary,
			words: autofilled.words,
			wordsNumber: dictionary.words.length,
		};
	}

	async saveCacheDefinition(
		dictionaryId: TId,
		words: WordWithAutofill[]
	): Promise<void> {
		await this.wordRepository.updatePartially(
			dictionaryId,
			words.map((word) => {
				const definitions = word.isAuto ? null : word.definitions;
				const cacheDefinitions = word.isAuto ? word.definitions : null;
				return {
					...word,
					definitions,
					cacheDefinitions,
				};
			})
		);
	}

	async deleteDictionary(id: TId, userId: TId): Promise<boolean> {
		const dictionary = await this.dictionaryRepository.findById(id);

		if (!dictionary) {
			throw new NotFoundException("Dictionary not found");
		}
		if (dictionary.userId.toString() !== userId.toString()) {
			throw new ForbiddenException("Access is denied");
		}

		return this.dictionaryRepository.deleteById(id);
	}

	async updateDictionary(
		id: TId,
		data: UpdateDictionaryRequestDto,
		user: JwtAuthUserDto
	): Promise<DictionaryDto> {
		const dictionary = await this.dictionaryRepository.findById(id);

		if (!dictionary) {
			throw new NotFoundException("Dictionary not found");
		}
		if (dictionary.userId.toString() !== user.id.toString()) {
			throw new ForbiddenException("Access is denied");
		}

		const dictionaryForUpdate = await this.getUpdateData(id, data);
		if (dictionaryForUpdate.words.length > RolesLimits[user.role].words) {
			throw new ForbiddenException(
				`For the "${
					user.role
				}" role, the maximum words per dictionary is set to ${
					RolesLimits[user.role].words
				}`
			);
		}

		return this.dictionaryRepository.update(dictionaryForUpdate);
	}

	async getUpdateData(
		id: TId,
		data: UpdateDictionaryRequestDto
	): Promise<DictionaryDto> {
		const { name, termsLanguage, definitionsLanguage, words } = data;
		const dictionary = await this.dictionaryRepository.findById(id);
		if (dictionary) {
			const isLanguageChanged =
				dictionary.termsLanguage !== termsLanguage ||
				dictionary.definitionsLanguage !== definitionsLanguage;
			dictionary.words = words?.length
				? this.mergeWords(dictionary.words, words, isLanguageChanged)
				: dictionary.words;

			dictionary.name = name || dictionary.name;
			dictionary.termsLanguage = termsLanguage || dictionary.termsLanguage;
			dictionary.definitionsLanguage =
				definitionsLanguage || dictionary.definitionsLanguage;
		}
		return dictionary;
	}

	mergeWords(
		oldWords: WordDto[],
		newWords: WordForUpdate[],
		isLanguageChanged: boolean
	): WordForUpdateWithCache[] {
		const validNewWords = this.validateNewWords(newWords);
		const { createdWords, deletedWordsIds, updatedWords } =
			this.divideNewWordsByActions(validNewWords);

		let result = oldWords;
		if (deletedWordsIds.length) {
			result = this.deleteWords(result, deletedWordsIds);
		}
		if (updatedWords.length) {
			result = this.updateWords(result, updatedWords, isLanguageChanged);
		}
		if (createdWords.length) {
			result = this.createWords(result, createdWords);
		}
		return result;
	}

	validateNewWords(words: WordForUpdate[]): WordForUpdate[] {
		return words.map((word) => ({
			...word,
			term: word.term.trim(),
			definitions:
				word.definitions?.map((definition) => definition.trim()) || null,
		}));
	}

	divideNewWordsByActions(words: WordForUpdate[]): {
		createdWords: WordForUpdate[];
		deletedWordsIds: TId[];
		updatedWords: WordForUpdate[];
	} {
		return {
			createdWords: words.filter((word) => word.isCreated && !word.isDeleted),
			deletedWordsIds: words
				.filter((word) => word.isDeleted)
				.map((word) => word._id),
			updatedWords: words.filter((word) => !word.isDeleted && !word.isCreated),
		};
	}

	deleteWords(oldWords: WordDto[], wordsForDeleteIds: TId[]): WordDto[] {
		return oldWords.filter(
			(word) => !wordsForDeleteIds.includes(word._id.toString())
		);
	}

	updateWords(
		oldWords: WordDto[],
		wordsForUpdate: WordForUpdate[],
		isLanguageChanged: boolean
	): WordDto[] {
		return oldWords.map((oldWord) => {
			const updateWord = wordsForUpdate.find(
				(word) => oldWord._id.toString() === word._id
			);
			if (updateWord) {
				const cacheDefinitions =
					!isLanguageChanged && oldWord.term === updateWord.term
						? oldWord.cacheDefinitions
						: null;

				const updatedAt =
					updateWord.term !== oldWord.term ||
					JSON.stringify(updateWord.definitions) !==
						JSON.stringify(oldWord.definitions)
						? updateWord.updatedAt
						: oldWord.updatedAt;

				return {
					_id: oldWord._id,
					term: updateWord.term,
					definitions: updateWord.definitions,
					createdAt: oldWord.createdAt,
					cacheDefinitions,
					updatedAt,
				};
			} else {
				return {
					...oldWord,
					cacheDefinitions: isLanguageChanged ? null : oldWord.cacheDefinitions,
				};
			}
		});
	}

	createWords(oldWords: WordDto[], wordsForCreate: WordForUpdate[]): WordDto[] {
		return [
			...oldWords,
			...wordsForCreate.map((word) => ({
				term: word.term,
				definitions: word.definitions,
				createdAt: word.createdAt,
				updatedAt: word.updatedAt,
				cacheDefinitions: null,
			})),
		];
	}
}
