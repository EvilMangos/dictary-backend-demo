import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Post,
	Res,
} from "@nestjs/common";
import { SignUpRequestDto } from "./dto/signUp/signUp.request.dto";
import { AuthService } from "./auth.service";
import { LogInRequestDto } from "./dto/logIn/logIn.request.dto";
import { Public } from "./decorator/public.decorator";
import { AuthUser } from "./decorator/authUser.decorator";
import { JwtAuthUserDto } from "./dto/jwt/jwtAuthUser.dto";
import { SetPasswordRequestDto } from "./dto/setPassword/setPassword.request.dto";
import { RestorePasswordRequestDto } from "./dto/restorePassword/restorePassword.request.dto";
import { RestoreRequestDto } from "./dto/restore/restore.request.dto";
import { ApiTags } from "@nestjs/swagger";
import { ApiTagEnum } from "../../utils/enum/apiTag.enum";
import { VerifyRequestDto } from "./dto/verify/verify.request.dto";
import { VerificationService } from "./verification.service";
import { RestoreService } from "./restore.service";
import { Roles } from "./decorator/roles.decorator";
import { GoogleAuthRequestDto } from "./dto/google/googleAuth.request.dto";
import { RolesEnum } from "shared-structures";
import { CreateGuestAccountRequestDto } from "./dto/guest/createGuestAccount.request.dto";
import { Response } from "express";
import { CookieService } from "./cookie.service";
import { CreateGuestAccountResponseDto } from "./dto/guest/createGuestAccount.response.dto";
import { UserIdDto } from "./dto/userId.dto";
import { DeletedDto } from "../../utils/dto/deleted.dto";

@Controller("auth")
@ApiTags(ApiTagEnum.auth)
export class AuthController {
	constructor(
		private authService: AuthService,
		private verificationService: VerificationService,
		private restoreService: RestoreService,
		private cookieService: CookieService
	) {}

	@Post("signup")
	@HttpCode(HttpStatus.CREATED)
	@Public()
	async signUp(@Body() data: SignUpRequestDto): Promise<UserIdDto> {
		const userId = await this.authService.signUp(
			{
				email: data.email,
				password: data.password,
				interfaceLanguage: data.interfaceLanguage,
			},
			data.acceptPolicy
		);
		return new UserIdDto({ userId });
	}

	@Post("login")
	@HttpCode(HttpStatus.OK)
	@Public()
	async login(
		@Body() data: LogInRequestDto,
		@Res({ passthrough: true }) response: Response
	): Promise<UserIdDto> {
		const { token, userId } = await this.authService.signIn(data);
		this.cookieService.setToken(response, token);
		return new UserIdDto({ userId });
	}

	@Post("google")
	@HttpCode(HttpStatus.OK)
	@Public()
	async googleAuthenticationCallback(
		@Body() data: GoogleAuthRequestDto,
		@Res({ passthrough: true }) response: Response
	): Promise<UserIdDto> {
		const { token, userId } = await this.authService.googleAuth(
			data.credential
		);
		this.cookieService.setToken(response, token);
		return new UserIdDto({ userId });
	}

	@Post("verify")
	@HttpCode(HttpStatus.OK)
	@Roles(RolesEnum.NotVerifiedUser)
	async verify(
		@Body() data: VerifyRequestDto,
		@AuthUser() user: JwtAuthUserDto,
		@Res({ passthrough: true }) response: Response
	): Promise<UserIdDto> {
		const token = await this.verificationService.verify(user, data.code);
		this.cookieService.setToken(response, token);
		return new UserIdDto({ userId: user.id });
	}

	@Post("verify/resend")
	@HttpCode(HttpStatus.CREATED)
	@Roles(RolesEnum.NotVerifiedUser)
	async resendVerificationCode(
		@AuthUser() user: JwtAuthUserDto
	): Promise<void> {
		await this.verificationService.resendVerificationCode(user);
	}

	@Post("password")
	@HttpCode(HttpStatus.OK)
	@Roles(
		RolesEnum.NotVerifiedUser,
		RolesEnum.User,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async setPassword(
		@Body() data: SetPasswordRequestDto,
		@AuthUser() user: JwtAuthUserDto
	): Promise<void> {
		await this.restoreService.setPassword(user.id, data.password);
	}

	@Post("restore/code")
	@HttpCode(HttpStatus.OK)
	@Public()
	async getRestoreCode(@Body() data: RestorePasswordRequestDto): Promise<void> {
		await this.restoreService.sendRestoreCode(data.email);
	}

	@Post("restore")
	@HttpCode(HttpStatus.OK)
	@Public()
	async getTempTokenForRestore(
		@Body() data: RestoreRequestDto,
		@Res({ passthrough: true }) response: Response
	): Promise<void> {
		const token = await this.restoreService.getTempAccessTokenForRestore(
			data.email,
			data.code
		);
		this.cookieService.setToken(response, token);
	}

	@Post("guest")
	@HttpCode(HttpStatus.CREATED)
	@Public()
	async authAsGuest(
		@Body() data: CreateGuestAccountRequestDto,
		@Res({ passthrough: true }) response: Response
	): Promise<CreateGuestAccountResponseDto> {
		const { token, user } = await this.authService.createGuestAccount(
			data.interfaceLanguage
		);
		this.cookieService.setToken(response, token);
		return new CreateGuestAccountResponseDto({
			_id: user._id,
		});
	}

	@Post("regenerateToken")
	@HttpCode(HttpStatus.CREATED)
	@Roles(RolesEnum.User, RolesEnum.Premium, RolesEnum.Developer)
	async regenerateToken(
		@AuthUser() user: JwtAuthUserDto,
		@Res({ passthrough: true }) response: Response
	): Promise<void> {
		const token = await this.authService.regenerateToken(user);
		this.cookieService.setToken(response, token);
	}

	@Delete("account")
	@HttpCode(HttpStatus.OK)
	@Roles(
		RolesEnum.NotVerifiedUser,
		RolesEnum.User,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async deleteAccount(@AuthUser() user: JwtAuthUserDto): Promise<DeletedDto> {
		const result = await this.authService.deleteAccount(user);
		return { deleted: result };
	}
}
