import { faker } from "@faker-js/faker";
import { WordDto } from "../../src/utils/dto/word.dto";

export const getWords = (count: number): WordDto[] => {
	const words = [];
	for (let i = 0; i < count; i++) {
		const definitions: string[] = [];
		for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
			definitions.push(faker.word.adverb());
		}
		words.push({
			term: faker.word.noun(),
			definitions,
			createdAt: new Date(faker.date.past()),
			updatedAt: new Date(faker.date.past()),
		});
	}

	return words;
};
