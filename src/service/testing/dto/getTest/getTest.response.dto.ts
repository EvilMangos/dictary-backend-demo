import { TestingReportDto } from "../testingReport.dto";

export class GetTestResponseDto {
	test: string;
	testsLeft: number;
	report: TestingReportDto;
}
