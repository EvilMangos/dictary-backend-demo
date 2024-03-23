import { Module } from "@nestjs/common";
import { DictionaryController } from "./dictionary.controller";
import { DictionaryService } from "./dictionary.service";
import { DbModule } from "../db/db.module";
import { DictionaryRepository } from "./dictionary.repository";
import { AutofillModule } from "../autofill/autofill.module";
import { WordRepository } from "./word.repository";
import { WordService } from "./word.service";
import { WordController } from "./word.controller";

@Module({
	imports: [DbModule, AutofillModule],
	controllers: [DictionaryController, WordController],
	providers: [
		DictionaryRepository,
		WordRepository,
		DictionaryService,
		WordService,
	],
	exports: [DictionaryRepository, DictionaryService, WordService],
})
export class DictionaryModule {}
