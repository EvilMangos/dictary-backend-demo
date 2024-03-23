import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TokenService } from "../token/token.service";
import { CryptoService } from "../crypto/crypto.service";
import { UserRepository } from "../user/user.repository";
import { MailService } from "../mail/mail.service";
import { TId } from "../../utils/type/id.type";
import { TokenTypesEnum } from "../token/enum/tokenTypes.enum";

@Injectable()
export class RestoreService {
	constructor(
		private authService: AuthService,
		private tokenService: TokenService,
		private cryptoService: CryptoService,
		private userService: UserRepository,
		private mailService: MailService
	) {}

	async checkRestoreToken(userId: TId, token: string): Promise<boolean> {
		const tokenFromDb = await this.tokenService.findToken(
			userId,
			TokenTypesEnum.passwordRestore
		);
		if (!tokenFromDb) {
			return false;
		}

		return this.cryptoService.isMatch(token, tokenFromDb.tokenHash);
	}

	async setPassword(userId: TId, password: string): Promise<void> {
		const hash = await this.cryptoService.encrypt(password);
		await this.userService.updateOne(userId, { password: hash });
	}

	async sendRestoreCode(email: string): Promise<void> {
		const user = await this.userService.findByEmail(email);
		if (user) {
			const token = await this.tokenService.updateOrCreateToken(
				user._id,
				TokenTypesEnum.passwordRestore
			);
			await this.mailService.sendRestoreCode(user.email, token);
		}
	}

	async getTempAccessTokenForRestore(
		email: string,
		code: string
	): Promise<string> {
		const user = await this.userService.findByEmail(email);
		if (!user) {
			return null;
		}

		const isTokenValid = await this.checkRestoreToken(user._id, code);
		if (isTokenValid) {
			await this.tokenService.deleteToken(
				user._id,
				TokenTypesEnum.passwordRestore
			);
			return this.authService.getAccessToken(user);
		}
		return null;
	}
}
