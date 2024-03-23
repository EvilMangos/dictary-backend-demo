import {
	IsBoolean,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from "class-validator";
import { LanguagesEnum, LengthsLimits, Patterns } from "shared-structures";

export class SignUpRequestDto {
	@IsEmail()
	@IsNotEmpty()
	@Matches(Patterns.email)
	@MaxLength(LengthsLimits.middle)
	email: string;
	@IsString()
	@IsNotEmpty()
	@Matches(Patterns.password)
	@MinLength(6)
	@MaxLength(LengthsLimits.middle)
	password: string;
	@IsEnum(LanguagesEnum)
	interfaceLanguage: LanguagesEnum;
	@IsBoolean()
	acceptPolicy: boolean;
}
