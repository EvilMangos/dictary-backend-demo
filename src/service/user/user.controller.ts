import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
} from "@nestjs/common";
import { UserDto } from "../../utils/dto/user.dto";
import { JwtAuthUserDto } from "../auth/dto/jwt/jwtAuthUser.dto";
import { AuthUser } from "../auth/decorator/authUser.decorator";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserService } from "./user.service";
import { UpdateUserRequestDto } from "./dto/updateUser/updateUser.request.dto";
import { ApiTags } from "@nestjs/swagger";
import { ApiTagEnum } from "../../utils/enum/apiTag.enum";
import { RolesEnum } from "shared-structures";

@Controller("users")
@ApiTags(ApiTagEnum.users)
export class UserController {
	constructor(private userService: UserService) {}

	@Get("me")
	@HttpCode(HttpStatus.OK)
	@Roles(
		RolesEnum.User,
		RolesEnum.NotVerifiedUser,
		RolesEnum.Guest,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async getUser(@AuthUser() user: JwtAuthUserDto): Promise<UserDto> {
		return new UserDto(await this.userService.getUser(user.id));
	}

	@Patch("me")
	@HttpCode(HttpStatus.OK)
	@Roles(
		RolesEnum.User,
		RolesEnum.Premium,
		RolesEnum.Developer,
		RolesEnum.Guest
	)
	async updateUser(
		@Body() data: UpdateUserRequestDto,
		@AuthUser() user: JwtAuthUserDto
	): Promise<UserDto> {
		return new UserDto(await this.userService.updateUser(user, data));
	}
}
