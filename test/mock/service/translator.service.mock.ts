import { Injectable } from "@nestjs/common";
import { LanguagesEnum } from "shared-structures";

@Injectable()
export class TranslatorServiceMock {
	async isLanguagesPairAvailable(
		srcLanguage: LanguagesEnum,
		targetLanguage: LanguagesEnum
	): Promise<boolean> {
		return true;
	}
	async translateMany(): Promise<string[][]> {
		return [[]];
	}
}
