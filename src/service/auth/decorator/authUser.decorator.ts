import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtAuthUserDto } from "../dto/jwt/jwtAuthUser.dto";

export const AuthUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): JwtAuthUserDto => {
		const request = ctx.switchToHttp().getRequest();
		return request.user;
	}
);
