import {
	IsBoolean,
	IsEmail,
	IsEnum,
	IsInt,
	IsNotEmpty,
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
	RolesEnum,
	SortDirectionsEnum,
} from "shared-structures";
import { Type } from "class-transformer";
import { SubscriptionDto } from "../../../utils/dto/Subscription.dto";
import { PartialType } from "@nestjs/swagger";

class PartialSubscriptionDto extends PartialType(SubscriptionDto) {}

export class UserForUpdateDto {
	@IsEnum(LanguagesEnum)
	interfaceLanguage?: LanguagesEnum;
	@IsEmail()
	@IsNotEmpty()
	@Matches(Patterns.email)
	@MaxLength(LengthsLimits.middle)
	email?: string;
	@IsString()
	@Matches(Patterns.password)
	@MinLength(6)
	@MaxLength(LengthsLimits.middle)
	password?: string;
	@IsEnum(RolesEnum)
	role?: RolesEnum;
	@IsInt()
	testersCounter?: number;
	@Type(() => PartialSubscriptionDto)
	subscription?: PartialSubscriptionDto;
	@IsBoolean()
	shouldShowWelcomeMessage?: boolean;
	@IsEnum(DictionarySortingEnum)
	"sortingConfigs.dictionariesSort"?: DictionarySortingEnum;
	@IsEnum(SortDirectionsEnum)
	"sortingConfigs.dictionariesSortDirection"?: SortDirectionsEnum;
	@IsEnum(DictionaryWordsSortingEnum)
	"sortingConfigs.dictionaryWordsSort"?: DictionaryWordsSortingEnum;
	@IsEnum(SortDirectionsEnum)
	"sortingConfigs.dictionaryWordsSortDirection"?: SortDirectionsEnum;
}
