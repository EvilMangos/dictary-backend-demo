import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
} from "class-validator";
import { LengthsLimits, Patterns } from "shared-structures";

export class RestoreRequestDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@Matches(Patterns.email)
	@MaxLength(LengthsLimits.middle)
	email: string;
	@IsString()
	@IsNotEmpty()
	@Matches(Patterns.code)
	@MaxLength(LengthsLimits.extraShort)
	code: string;
}
