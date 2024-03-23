import { Injectable } from "@nestjs/common";
import { TranslatorService } from "./translator.service";
import { LanguagesEnum } from "shared-structures";

@Injectable()
export class TranslateService {
	constructor(private translatorService: TranslatorService) {}

	async translateText(
		text: string[],
		from: LanguagesEnum,
		to: LanguagesEnum
	): Promise<string[][]> {
		return this.translatorService.getTranslate(text, from, to);
	}
}
