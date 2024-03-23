import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from "@nestjs/common";
import { AuthUser } from "../auth/decorator/authUser.decorator";
import { JwtAuthUserDto } from "../auth/dto/jwt/jwtAuthUser.dto";
import { CheckAnswerRequestDto } from "./dto/checkAnswer/checkAnswer.request.dto";
import { GetTestResponseDto } from "./dto/getTest/getTest.response.dto";
import { TestingService } from "./testing.service";
import { ApiTags } from "@nestjs/swagger";
import { ApiTagEnum } from "../../utils/enum/apiTag.enum";
import { CheckAnswerResponseDto } from "./dto/checkAnswer/checkAnswer.response.dto";
import { Roles } from "../auth/decorator/roles.decorator";
import { SkipWordResponseDto } from "./dto/skipWord/skipWord.response.dto";
import { RolesEnum } from "shared-structures";
import { Throttle, hours, minutes } from "@nestjs/throttler";

@Throttle({
	short: { limit: 60, ttl: minutes(1) },
	medium: { limit: 1200, ttl: hours(1) },
})
@Controller("testing")
@ApiTags(ApiTagEnum.testing)
export class TestingController {
	constructor(private testingService: TestingService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@Roles(
		RolesEnum.User,
		RolesEnum.Guest,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async getNextTest(
		@AuthUser() user: JwtAuthUserDto
	): Promise<GetTestResponseDto> {
		const { word, testsLeft, report } =
			await this.testingService.getTestOrDeleteTesterIfFinished(user.id);
		return {
			test: word?.term || null,
			testsLeft,
			report,
		};
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Roles(
		RolesEnum.User,
		RolesEnum.Guest,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async checkAnswer(
		@Body() data: CheckAnswerRequestDto,
		@AuthUser() user: JwtAuthUserDto
	): Promise<CheckAnswerResponseDto> {
		//eslint-disable-next-line
		let { answer, needAnswers, doneDefinitions } =
			await this.testingService.getCurrentWordAnswers(user.id);
		const isAnswerCorrect = await this.testingService.checkAnswerAndUpdateTest(
			data.answer,
			user.id
		);

		if (isAnswerCorrect) {
			needAnswers--;
			doneDefinitions.push(data.answer);
		} else {
			answer = null;
		}

		return {
			result: isAnswerCorrect,
			answer: needAnswers ? null : answer,
			needAnswers,
			doneDefinitions,
		};
	}

	@Post("skip")
	@HttpCode(HttpStatus.OK)
	@Roles(
		RolesEnum.User,
		RolesEnum.Guest,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async skipWord(
		@AuthUser() user: JwtAuthUserDto
	): Promise<SkipWordResponseDto> {
		return { answer: await this.testingService.skipWordAndGetAnswer(user.id) };
	}
}
