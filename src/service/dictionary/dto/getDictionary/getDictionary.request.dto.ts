import {
	IsBoolean,
	IsEnum,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
} from "class-validator";
import {
	DictionaryWordsSortingEnum,
	LengthsLimits,
	Patterns,
	SortDirectionsEnum,
} from "shared-structures";

export class GetDictionaryRequestDto {
	@IsOptional()
	@IsEnum(DictionaryWordsSortingEnum)
	sort?: DictionaryWordsSortingEnum;
	@IsOptional()
	@IsEnum(SortDirectionsEnum)
	sortDirection?: SortDirectionsEnum;
	@IsOptional()
	@IsString()
	@Matches(Patterns.word)
	@MaxLength(LengthsLimits.long)
	filter?: string;
	@IsOptional()
	@IsString()
	limit?: string;
	@IsOptional()
	@IsString()
	offset?: string;
	@IsOptional()
	@IsBoolean()
	isReverted?: boolean;
}
