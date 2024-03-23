import {
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from "class-validator";
import { LengthsLimits, Patterns } from "shared-structures";

export class SetPasswordRequestDto {
	@IsString()
	@IsNotEmpty()
	@Matches(Patterns.password)
	@MinLength(6)
	@MaxLength(LengthsLimits.middle)
	password: string;
}
