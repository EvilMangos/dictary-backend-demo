import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from "class-validator";
import { LengthsLimits, Patterns } from "shared-structures";

export class LogInRequestDto {
	@IsString()
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
}
