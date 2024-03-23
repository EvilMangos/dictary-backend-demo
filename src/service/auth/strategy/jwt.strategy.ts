import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayloadDto } from "../dto/jwt/jwtPayload.dto";
import { JwtAuthUserDto } from "../dto/jwt/jwtAuthUser.dto";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				JwtStrategy.extractJwtFromCookie,
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get("JWT_SECRET"),
		});
	}

	private static extractJwtFromCookie(req: Request): string | null {
		if (req.signedCookies && req.signedCookies.access_token) {
			return req.signedCookies.access_token;
		}
		return null;
	}

	async validate(payload: JwtPayloadDto): Promise<JwtAuthUserDto> {
		return { id: payload.sub, role: payload.role };
	}
}
