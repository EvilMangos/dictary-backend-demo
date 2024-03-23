import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { LanguagesEnum } from "shared-structures";

@Injectable()
export abstract class BaseTranslatorService {
	private baseUrl: string;
	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}
	abstract translateMany(
		data: string[],
		from: LanguagesEnum,
		to: LanguagesEnum
	): Promise<string[][]>;
	abstract isLanguagesPairAvailable(
		srcLanguage: LanguagesEnum,
		targetLanguage: LanguagesEnum
	): Promise<boolean>;
	async sendRequest(request: AxiosRequestConfig): Promise<AxiosResponse> {
		return axios({ ...request, baseURL: this.baseUrl });
	}
}
