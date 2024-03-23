import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
import { LengthsLimits, Patterns } from "shared-structures";

export class VerifyRequestDto {
	@IsString()
	@IsNotEmpty()
	@Matches(Patterns.code)
	@MaxLength(LengthsLimits.short)
	code: string;
}
