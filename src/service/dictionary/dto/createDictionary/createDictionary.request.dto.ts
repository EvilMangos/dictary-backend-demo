import {
	IsEnum,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
} from "class-validator";
import { LanguagesEnum, LengthsLimits, Patterns } from "shared-structures";

export class CreateDictionaryRequestDto {
	@IsString()
	@IsNotEmpty()
	@Matches(Patterns.name)
	@MaxLength(LengthsLimits.short)
	name: string;
	@IsEnum(LanguagesEnum)
	@IsNotEmpty()
	termsLanguage: LanguagesEnum;
	@IsEnum(LanguagesEnum)
	@IsNotEmpty()
	definitionsLanguage: LanguagesEnum;
}
