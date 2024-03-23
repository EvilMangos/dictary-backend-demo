import { Injectable } from "@nestjs/common";
import { faker } from "@faker-js/faker";

@Injectable()
export class TranslateServiceMock {
	async translateText(text: string[]): Promise<string[][]> {
		return text.map(() => [faker.word.noun()]);
	}
}
