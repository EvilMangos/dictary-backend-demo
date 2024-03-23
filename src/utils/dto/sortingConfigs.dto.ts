import {
	DictionarySortingEnum,
	DictionaryWordsSortingEnum,
	SortDirectionsEnum,
} from "shared-structures";
import { IsEnum } from "class-validator";
import { SchemaFactory } from "@nestjs/mongoose";

export class SortingConfigsDto {
	@IsEnum(DictionarySortingEnum)
	dictionariesSort: DictionarySortingEnum;
	@IsEnum(SortDirectionsEnum)
	dictionariesSortDirection: SortDirectionsEnum;
	@IsEnum(DictionaryWordsSortingEnum)
	dictionaryWordsSort: DictionaryWordsSortingEnum;
	@IsEnum(SortDirectionsEnum)
	dictionaryWordsSortDirection: SortDirectionsEnum;
}

export const SortingConfigsSchema =
	SchemaFactory.createForClass(SortingConfigsDto);
