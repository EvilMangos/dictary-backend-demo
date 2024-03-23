import { Response } from "express";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CookieService {
	constructor(private configService: ConfigService) {}

	setToken(response: Response, token: string) {
		response.cookie("access_token", token, {
			httpOnly: false,
			maxAge: +this.configService.get("COOKIE_EXPIRES_HOURS") * 60 * 60 * 1000,
			signed: true,
		});
	}
}
