import { LanguagesEnum } from "shared-structures";
import { IsEnum } from "class-validator";

export class CreateGuestAccountRequestDto {
	@IsEnum(LanguagesEnum)
	interfaceLanguage: LanguagesEnum;
}
