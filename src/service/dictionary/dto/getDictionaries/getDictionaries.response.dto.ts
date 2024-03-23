import { DictionaryDto } from "../../../../utils/dto/dictionary.dto";
import { OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { WordDto } from "../../../../utils/dto/word.dto";

export class DictionaryWithoutWords extends OmitType(DictionaryDto, [
	"words",
] as const) {
	length: number;
	@Exclude()
	words: WordDto[];
	constructor(partial: Partial<DictionaryWithoutWords>) {
		super();
		Object.assign(this, partial);
	}
}

export class GetDictionariesResponseDto {
	data: DictionaryWithoutWords[];
}
