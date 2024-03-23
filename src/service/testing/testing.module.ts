import { Module } from "@nestjs/common";
import { TestingService } from "./testing.service";
import { TestingController } from "./testing.controller";
import { TesterModule } from "../tester/tester.module";

@Module({
	imports: [TesterModule],
	providers: [TestingService],
	controllers: [TestingController],
})
export class TestingModule {}
