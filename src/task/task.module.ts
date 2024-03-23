import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { ScheduleModule } from "@nestjs/schedule";
import { UserModule } from "../service/user/user.module";
import { DictionaryModule } from "../service/dictionary/dictionary.module";
import { TesterModule } from "../service/tester/tester.module";

@Module({
	imports: [
		ScheduleModule.forRoot(),
		UserModule,
		DictionaryModule,
		TesterModule,
	],
	providers: [TaskService],
})
export class TaskModule {}
