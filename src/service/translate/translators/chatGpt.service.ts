import { Injectable } from "@nestjs/common";
import OpenAi from "openai";
import { ConfigService } from "@nestjs/config";
import { LanguagesEnum } from "shared-structures";

const MINIMUM_TRANSLATES = 3;
const MAXIMUM_TRANSLATES = 12;

@Injectable()
export class ChatGptService {
	private readonly openai;
	private readonly model;
	constructor(configService: ConfigService) {
		this.openai = new OpenAi({
			organization: configService.get("OPENAI_ORGANIZATION_ID"),
			apiKey: configService.get("OPENAI_API_KEY"),
		});
		this.model = configService.get("OPENAI_CHATGPT_TRANSLATE_MODEL");
	}

	async isLanguagesPairAvailable(
		srcLanguage: LanguagesEnum,
		targetLanguage: LanguagesEnum
	): Promise<boolean> {
		return true;
	}

	async translateMany(
		data: string[],
		from: LanguagesEnum,
		to: LanguagesEnum
	): Promise<string[][]> {
		const result = await this.openai.chat.completions.create({
			model: this.model,
			messages: [
				{
					role: "user",
					content: `In this chat i will send you an array of words of language with language code "${from}" and you give me only an array of arrays each of them should contains minimum ${MINIMUM_TRANSLATES} and maximum ${MAXIMUM_TRANSLATES} translations to language with language code "${to}"  in format  [[translate1ForWord1, translate2ForWord1,  translate3ForWord1...], [translate1ForWord2, translate2ForWord2,  translate3ForWord2...]...] . If you cannot translate word, just return an empty array. Return only array don't type nothing more.`,
				},
				{
					role: "user",
					content: `[${data.join(", ")}]`,
				},
			],
		});

		return JSON.parse(result.choices[0].message.content);
	}
}
