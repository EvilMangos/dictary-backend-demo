import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { BaseTranslatorService } from "./baseTranslator.service";
import { ConfigService } from "@nestjs/config";
import { LingvoDictionaryDto } from "../dto/lingvoDictionary.dto";
import { LingvoLanguagesCodeEnum } from "./enum/lingvoLanguagesCode.enum";
import { LanguagesEnum } from "shared-structures";

@Injectable()
export class LingvoDictionaryService extends BaseTranslatorService {
	private key: string;
	constructor(configService: ConfigService) {
		super(configService.get("LINGVO_DICTIONARY_URL"));
		this.key = configService.get("LINGVO_API_KEY");
	}

	async authenticate(): Promise<string> {
		const request = this.createRequest({
			url: "v1.1/authenticate",
			method: "POST",
			token: `Basic ${this.key}`,
		});
		const response = await this.sendRequest(request);
		return response.data;
	}

	async translate(
		data: string,
		from: LanguagesEnum,
		to: LanguagesEnum
	): Promise<string[]> {
		const token = await this.authenticate();
		const request = this.createRequest({
			url: "v1/Translation",
			method: "GET",
			token: `Bearer ${token}`,
			params: {
				srcLang: LingvoLanguagesCodeEnum[from],
				dstLang: LingvoLanguagesCodeEnum[to],
				text: data,
			},
		});
		const response = await this.sendRequest(request);
		return this.formatResponseForMany(response);
	}

	async translateMany(
		data: string[],
		from: LanguagesEnum,
		to: LanguagesEnum
	): Promise<string[][]> {
		const promises = data.map((text) => this.translate(text, from, to));
		return Promise.all(promises);
	}

	formatResponseForMany(response: AxiosResponse) {
		let result = response.data[0].Body[1]?.Items;
		if (result) {
			result.shift();
			result = result
				.map((elem) => elem.Markup)
				.reduce((resultArray, current) => resultArray.concat(current), [])
				.map((elem) => elem.Items)
				.filter((elem) => elem)
				.reduce((resultArray, current) => resultArray.concat(current), [])
				.map((elem) => elem.Markup)
				.reduce((resultArray, current) => resultArray.concat(current), [])
				.map((elem) => elem.Markup)
				.reduce((resultArray, current) => resultArray.concat(current), [])
				.filter((elem) => elem)
				.filter((elem) => elem.Text)
				.filter((elem) => elem.IsItalics === false)
				.map((elem) => elem.Text.trim())
				.filter((elem: string) => elem !== ")" && elem !== "(")
				.map((elem) => elem.split(/[,;]+/))
				.reduce((resultArray, current) => resultArray.concat(current), [])
				.filter((elem) => elem)
				.map((elem) => elem.trim())
				.filter((elem) => elem.split(" ").length < 3);
		}

		return result || [];
	}

	async isLanguagesPairAvailable(
		srcLanguage: LanguagesEnum,
		targetLanguage: LanguagesEnum
	): Promise<boolean> {
		return false;
	}

	createRequest(options: LingvoDictionaryDto): AxiosRequestConfig {
		return {
			url: options.url,
			method: options.method,
			params: {
				...options.params,
			},
			headers: {
				Authorization: options.token,
			},
			responseType: "json",
		};
	}
}
