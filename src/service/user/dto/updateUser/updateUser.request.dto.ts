import {
	IsBoolean,
	IsEnum,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from "class-validator";
import {
	DictionarySortingEnum,
	DictionaryWordsSortingEnum,
	LanguagesEnum,
	LengthsLimits,
	Patterns,
	SortDirectionsEnum,
} from "shared-structures";

export class UpdateUserRequestDto {
	@IsEnum(LanguagesEnum)
	interfaceLanguage?: LanguagesEnum;
	@IsString()
	@Matches(Patterns.password)
	@MinLength(6)
	@MaxLength(LengthsLimits.middle)
	password?: string;
	@IsBoolean()
	shouldShowWelcomeMessage?: boolean;
	@IsEnum(DictionarySortingEnum)
	dictionariesSort: DictionarySortingEnum;
	@IsEnum(SortDirectionsEnum)
	dictionariesSortDirection: SortDirectionsEnum;
	@IsEnum(DictionaryWordsSortingEnum)
	dictionaryWordsSort: DictionaryWordsSortingEnum;
	@IsEnum(SortDirectionsEnum)
	dictionaryWordsSortDirection: SortDirectionsEnum;
}
