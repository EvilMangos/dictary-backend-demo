import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthUser } from "../auth/decorator/authUser.decorator";
import { JwtAuthUserDto } from "../auth/dto/jwt/jwtAuthUser.dto";
import { TesterService } from "./tester.service";
import { CreateTesterRequestDto } from "./dto/createTester/createTester.request.dto";
import { ApiTags } from "@nestjs/swagger";
import { ApiTagEnum } from "../../utils/enum/apiTag.enum";
import { CreateTesterResponseDto } from "./dto/createTester/createTester.response.dto";
import { Roles } from "../auth/decorator/roles.decorator";
import { RolesEnum } from "shared-structures";

@Controller("/tester")
@ApiTags(ApiTagEnum.tester)
export class TesterController {
	constructor(private testerService: TesterService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@Roles(
		RolesEnum.User,
		RolesEnum.Guest,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async startTester(
		@Body() data: CreateTesterRequestDto,
		@AuthUser() user: JwtAuthUserDto
	): Promise<CreateTesterResponseDto> {
		const tester = await this.testerService.createTester(data, user);
		return new CreateTesterResponseDto({ testerId: tester._id });
	}
}
