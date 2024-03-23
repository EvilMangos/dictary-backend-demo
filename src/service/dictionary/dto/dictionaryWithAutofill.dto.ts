import { DictionaryDto } from "../../../utils/dto/dictionary.dto";
import { WordDto } from "../../../utils/dto/word.dto";
import { OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, ValidateNested } from "class-validator";

export class WordWithAutofill extends OmitType(WordDto, [
	"cacheDefinitions",
] as const) {
	@IsBoolean()
	isAuto: boolean;
}

export class DictionaryWithAutofillDto extends OmitType(DictionaryDto, [
	"words",
] as const) {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => WordWithAutofill)
	words: WordWithAutofill[];
	@IsNumber()
	wordsNumber: number;

	constructor(partial: Partial<DictionaryWithAutofillDto>) {
		super();
		Object.assign(this, partial);
	}
}
