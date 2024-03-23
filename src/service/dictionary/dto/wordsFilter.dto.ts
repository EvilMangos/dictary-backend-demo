import { IsInt, Min } from "class-validator";
import { SortDirectionsEnum } from "shared-structures";

export class WordsFilterDto {
	@IsInt()
	@Min(0)
	wordsNumberLimit?: number;
	wordsDateLimit?: Date;
	direction?: SortDirectionsEnum;
}
