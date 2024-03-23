import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
} from "class-validator";
import { LengthsLimits, Patterns } from "shared-structures";

export class RestorePasswordRequestDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@Matches(Patterns.email)
	@MaxLength(LengthsLimits.middle)
	email: string;
}
