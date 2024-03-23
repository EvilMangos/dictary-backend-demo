import { TId } from "../../src/utils/type/id.type";
import { faker } from "@faker-js/faker";
import { DictionaryForCreateDto } from "../../src/utils/dto/dictionary.dto";
import { OmitType } from "@nestjs/swagger";
import { LanguagesEnum } from "shared-structures";

class DictionaryForCreateWithoutIdDto extends OmitType(DictionaryForCreateDto, [
	"userId",
	"words",
]) {}

export const getDictionaryDataForCreate = (
	userId?: TId
): DictionaryForCreateDto | DictionaryForCreateWithoutIdDto => {
	const data = {
		name: faker.word.noun(),
		termsLanguage: LanguagesEnum.en,
		definitionsLanguage: LanguagesEnum.uk,
	};

	return userId ? { ...data, userId } : data;
};
