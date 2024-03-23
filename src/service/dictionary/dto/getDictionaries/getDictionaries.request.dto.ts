import {
	IsEnum,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
} from "class-validator";
import {
	DictionarySortingEnum,
	LengthsLimits,
	Patterns,
	SortDirectionsEnum,
} from "shared-structures";

export class GetDictionariesRequestDto {
	@IsOptional()
	@IsEnum(DictionarySortingEnum)
	sort?: DictionarySortingEnum;
	@IsOptional()
	@IsEnum(SortDirectionsEnum)
	sortDirection?: SortDirectionsEnum;
	@IsOptional()
	@IsString()
	@Matches(Patterns.name)
	@MaxLength(LengthsLimits.short)
	filter?: string;
}
