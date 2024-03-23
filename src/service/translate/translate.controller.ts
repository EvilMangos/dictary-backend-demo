import { Controller, Get } from "@nestjs/common";
import { TranslateService } from "./translate.service";
import { Public } from "../auth/decorator/public.decorator";
import { LanguagesEnum } from "shared-structures";

@Controller("translate")
export class TranslateController {
	constructor(private translateService: TranslateService) {}
	@Get()
	@Public()
	async translate() {
		return this.translateService.translateText(
			["fly", "skip", "skim", "age", "lock", "shark", "hand"],
			LanguagesEnum.en,
			LanguagesEnum.uk
		);
	}
}
