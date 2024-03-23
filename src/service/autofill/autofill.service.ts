import { Injectable } from "@nestjs/common";
import { TranslateService } from "../translate/translate.service";
import { WordDto } from "../../utils/dto/word.dto";
import { WordWithAutofill } from "../dictionary/dto/dictionaryWithAutofill.dto";
import { LanguagesEnum } from "shared-structures";

const TRANSLATES_LIMIT = 12;

@Injectable()
export class AutofillService {
	constructor(private translateService: TranslateService) {}

	async autofill(
		words: WordDto[],
		from: LanguagesEnum,
		to: LanguagesEnum
	): Promise<{ words: WordWithAutofill[]; wasAutofilled: boolean }> {
		const termsForTranslate = this.getTermsForWords(words);

		let translations = [];
		const needAutofill = !!termsForTranslate.length;
		if (needAutofill) {
			const tempDef = await this.translateService.translateText(
				termsForTranslate,
				from,
				to
			);
			translations =
				tempDef
					?.reverse()
					.map((definition) => definition.slice(0, TRANSLATES_LIMIT)) || [];
		}

		return {
			words: this.wordsToWordsWithAutofill(words, translations),
			wasAutofilled: needAutofill,
		};
	}

	getTermsForWords(words: WordDto[]): string[] {
		return words
			.filter(
				(word) => !word.definitions?.length && !word.cacheDefinitions?.length
			)
			.map((word) => word.term);
	}

	wordsToWordsWithAutofill(
		words: WordDto[],
		translations: string[][]
	): WordWithAutofill[] {
		return words.map((word) => {
			const isAuto = !word.definitions?.length;
			let definition = null;
			if (!isAuto) {
				definition = word.definitions;
			} else if (word.cacheDefinitions?.length) {
				definition = word.cacheDefinitions;
			} else {
				const translate = translations.pop();
				if (translate?.length) {
					definition = translate;
				}
			}
			delete word.cacheDefinitions;
			return {
				...word,
				definitions: definition,
				isAuto,
			};
		});
	}
}
