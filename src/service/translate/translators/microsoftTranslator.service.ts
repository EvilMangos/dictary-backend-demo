import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { BaseTranslatorService } from "./baseTranslator.service";
import { ConfigService } from "@nestjs/config";
import { MicrosoftTranslatorRequestFilterDto } from "../dto/microsoftTranslator.dto";
import { LanguagesEnum } from "shared-structures";

@Injectable()
export class MicrosoftTranslatorService extends BaseTranslatorService {
	private key: string;
	private location: string;
	constructor(configService: ConfigService) {
		super(configService.get("MICROSOFT_TRANSLATOR_URL"));
		this.key = configService.get("MICROSOFT_TRANSLATOR_API_KEY");
		this.location = configService.get("MICROSOFT_TRANSLATOR_LOCATION");
	}

	async translate(
		text: string,
		from: LanguagesEnum,
		to: LanguagesEnum
	): Promise<string[]> {
		const options = {
			text: [text],
			method: "POST",
			url: "/dictionary/lookup",
			params: {
				from,
				to,
			},
		};
		const request = this.createRequest(options);
		const response = await this.sendRequest(request);
		const translations = response.data[0].translations;
		return translations.map((translation) => translation.normalizedTarget);
	}

	async translateMany(
		data: string[],
		from: LanguagesEnum,
		to: LanguagesEnum
	): Promise<string[][]> {
		const options = {
			text: data,
			method: "POST",
			url: "/dictionary/lookup",
			params: {
				from,
				to,
			},
		};

		const request = this.createRequest(options);
		const response = await this.sendRequest(request);

		return this.formatResponseForMany(response);
	}

	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	formatResponseForMany(response: any) {
		return response.data.map((translations) =>
			translations.translations.map((translate) => translate.normalizedTarget)
		);
	}

	async isLanguagesPairAvailable(
		srcLanguage: LanguagesEnum,
		targetLanguage: LanguagesEnum
	): Promise<boolean> {
		const languages = await this.getLanguagesList();
		return languages[srcLanguage]?.translations.find(
			(language) => language.code === targetLanguage
		);
	}

	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	async getLanguagesList(): Promise<any> {
		const options = { method: "GET", url: "/languages" };
		const request = this.createRequest(options);
		const response = await this.sendRequest(request);
		return response.data.dictionary;
	}

	createRequest(
		options: MicrosoftTranslatorRequestFilterDto
	): AxiosRequestConfig {
		const data = options.text?.map((text) => ({ text }));
		return {
			url: options.url,
			method: options.method,
			headers: {
				"Ocp-Apim-Subscription-Key": this.key,
				"Ocp-Apim-Subscription-Region": this.location,
				"Content-type": "application/json",
			},
			params: {
				"api-version": "3.0",
				...options.params,
			},
			data: data,
			responseType: "json",
		};
	}
}
