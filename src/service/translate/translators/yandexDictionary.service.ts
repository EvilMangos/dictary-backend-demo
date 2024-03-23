import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { BaseTranslatorService } from "./baseTranslator.service";
import { ConfigService } from "@nestjs/config";
import { YandexDictionaryRequestFilterDto } from "../dto/yandexDictionary.dto";
import { LanguagesEnum } from "shared-structures";
@Injectable()
export class YandexDictionaryService extends BaseTranslatorService {
	private key: string;
	constructor(configService: ConfigService) {
		super(configService.get("YANDEX_DICTIONARY_URL"));
		this.key = configService.get("YANDEX_DICTIONARY_API_KEY");
	}

	async translate(
		text: string,
		from: LanguagesEnum,
		to: LanguagesEnum
	): Promise<string[]> {
		const request = this.createRequest({
			url: "/lookup",
			method: "GET",
			params: {
				lang: `${from}-${to}`,
				text,
			},
		});
		const response = await this.sendRequest(request);
		const translations = response.data.def[0]?.tr || [];
		return translations.map((translation) => translation.text);
	}

	async translateMany(
		data: string[],
		from: LanguagesEnum,
		to: LanguagesEnum
	): Promise<string[][]> {
		const promises = data.map((text) => this.translate(text, from, to));
		return Promise.all(promises);
	}

	async isLanguagesPairAvailable(
		srcLanguage: LanguagesEnum,
		targetLanguage: LanguagesEnum
	): Promise<boolean> {
		const languages = await this.getLanguagesList();
		return languages.includes(`${srcLanguage}-${targetLanguage}`);
	}

	async getLanguagesList(): Promise<string[]> {
		const request = this.createRequest({ url: "/getLangs", method: "GET" });
		const response = await this.sendRequest(request);
		return response.data;
	}

	createRequest(options: YandexDictionaryRequestFilterDto): AxiosRequestConfig {
		return {
			url: options.url,
			method: options.method,
			params: {
				key: this.key,
				...options.params,
			},
			responseType: "json",
		};
	}
}
