import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
} from "class-validator";
import { LengthsLimits, Patterns } from "shared-structures";

export class GoogleAuthUserDto {
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	@Matches(Patterns.email)
	@MaxLength(LengthsLimits.middle)
	email: string;
	@IsString()
	interfaceLanguage: string;
}
