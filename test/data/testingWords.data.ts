import { faker } from "@faker-js/faker";
import { TestWordDto } from "../../src/service/tester/dto/testWord.dto";

export const getTestingWords = (count: number): TestWordDto[] => {
	const words = [];
	for (let i = 0; i < count; i++) {
		const definitionsList: string[][] = [];
		for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
			const definitions: string[] = [];
			for (let j = 0; j < faker.number.int({ min: 1, max: 3 }); j++) {
				definitions.push(faker.word.adverb());
			}
			definitionsList.push(definitions);
		}

		words.push({
			term: faker.word.noun(),
			definitions: definitionsList.reduce(
				(accum, current) => accum.concat(current),
				[]
			),
			needAnswers: definitionsList.length,
			doneDefinitions: [],
			skipped: false,
		});
	}

	return words;
};
