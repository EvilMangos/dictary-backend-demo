import { Module } from "@nestjs/common";
import { AutofillService } from "./autofill.service";
import { TranslateModule } from "../translate/translate.module";

@Module({
	imports: [TranslateModule],
	providers: [AutofillService],
	exports: [AutofillService],
})
export class AutofillModule {}
