import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { TId } from "../../utils/type/id.type";
import { TesterRepository } from "../tester/tester.repository";
import { TestWordDto } from "../tester/dto/testWord.dto";
import { TesterDto } from "../../utils/dto/tester.dto";
import { TestingReportDto } from "./dto/testingReport.dto";

@Injectable()
export class TestingService {
	constructor(private testerRepository: TesterRepository) {}

	async getTestOrDeleteTesterIfFinished(userId: TId): Promise<{
		word: TestWordDto;
		testsLeft: number;
		report: TestingReportDto;
	}> {
		const tester = await this.testerRepository.findByUser(userId);
		if (!tester) {
			throw new NotFoundException("Tester not found");
		}
		if (await this.checkTesterFinished(tester.words)) {
			const report = this.generateTestingReport(tester);
			await this.testerRepository.deleteById(tester._id);
			return {
				word: null,
				testsLeft: 0,
				report,
			};
		}
		return {
			word: this.findFirstNotDoneWord(tester.words),
			testsLeft: this.findNotDoneWordsLength(tester.words),
			report: null,
		};
	}

	async checkTesterFinished(words: TestWordDto[]): Promise<boolean> {
		const test = this.findFirstNotDoneWord(words);
		return !test;
	}
	findFirstNotDoneWord(words: TestWordDto[]): TestWordDto {
		return words.find((word) => word.needAnswers > 0 && !word.skipped);
	}

	findNotDoneWordsLength(words: TestWordDto[]): number {
		return words.filter((word) => word.needAnswers > 0 && !word.skipped).length;
	}

	generateTestingReport(tester: TesterDto): TestingReportDto {
		const words = tester.words.map((word) => ({
			term: word.term,
			definitions: word.definitions,
			isDone: !word.needAnswers,
		}));
		return {
			words,
		};
	}

	async checkAnswerAndUpdateTest(
		answer: string,
		userId: TId
	): Promise<boolean> {
		const tester = await this.testerRepository.findByUser(userId);
		if (!tester) {
			throw new NotFoundException("Tester not found");
		}
		if (await this.checkTesterFinished(tester.words)) {
			throw new BadRequestException("There are no active testers");
		}
		const rightWord = this.findFirstNotDoneWord(tester.words);
		if (this.checkAnswerForWord(rightWord, answer.trim().toLowerCase())) {
			await this.testerRepository.setAnswerToDoneAndDecreaseNeededAnswers(
				tester._id,
				answer
			);
			return true;
		}
		return false;
	}

	checkAnswerForWord(word: TestWordDto, answer: string): boolean {
		return (
			!!word.definitions.includes(answer) &&
			!word.doneDefinitions.includes(answer)
		);
	}

	async skipWordAndGetAnswer(userId: TId): Promise<string[]> {
		const tester = await this.testerRepository.findByUser(userId);
		if (!tester) {
			throw new NotFoundException("Tester not found");
		}
		if (await this.checkTesterFinished(tester.words)) {
			throw new BadRequestException("There are no active testers");
		}
		const answer =
			await this.testerRepository.findCurrentWordNotDoneDefinitions(tester._id);
		await this.testerRepository.skipWordByTerm(tester._id, answer.term);
		return answer.definitions;
	}

	async getCurrentWordAnswers(userId: TId): Promise<{
		answer: string[];
		needAnswers: number;
		doneDefinitions: string[];
	}> {
		const tester = await this.testerRepository.findByUser(userId);
		if (!tester) {
			throw new NotFoundException("Tester not found");
		}
		const answer =
			await this.testerRepository.findCurrentWordNotDoneDefinitions(tester._id);
		return {
			answer: answer?.definitions,
			needAnswers: answer?.needAnswers,
			doneDefinitions: answer?.doneDefinitions,
		};
	}
}
