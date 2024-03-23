import { Module } from "@nestjs/common";
import { TesterService } from "./tester.service";
import { TesterController } from "./tester.controller";
import { DictionaryModule } from "../dictionary/dictionary.module";
import { DbModule } from "../db/db.module";
import { AutofillModule } from "../autofill/autofill.module";
import { TesterRepository } from "./tester.repository";
import { UserModule } from "../user/user.module";

@Module({
	imports: [DictionaryModule, DbModule, AutofillModule, UserModule],
	providers: [TesterRepository, TesterService],
	controllers: [TesterController],
	exports: [TesterRepository, TesterService],
})
export class TesterModule {}
