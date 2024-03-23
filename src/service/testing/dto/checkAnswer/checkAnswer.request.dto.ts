import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
import { LengthsLimits, Patterns } from "shared-structures";

export class CheckAnswerRequestDto {
	@IsString()
	@IsNotEmpty()
	@Matches(Patterns.word)
	@MaxLength(LengthsLimits.long)
	answer: string;
}
