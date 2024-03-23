import { Injectable } from "@nestjs/common";
import { TId } from "../../utils/type/id.type";
import { TokenTypesEnum } from "./enum/tokenTypes.enum";
import { CryptoService } from "../crypto/crypto.service";
import { TokenDto } from "../../utils/dto/token.dto";
import { TokenRepository } from "./token.repository";

@Injectable()
export class TokenService {
	constructor(
		private tokenRepository: TokenRepository,
		private cryptoService: CryptoService
	) {}

	generate(): string {
		return Math.random().toString().slice(2, 8);
	}

	async findToken(userId: TId, type: TokenTypesEnum): Promise<TokenDto> {
		return this.tokenRepository.findOne({
			userId,
			type,
		});
	}

	async deleteToken(userId: TId, type: TokenTypesEnum): Promise<boolean> {
		return this.tokenRepository.delete({
			userId,
			type,
		});
	}

	async updateOrCreateToken(
		userId: TId,
		type: TokenTypesEnum
	): Promise<string> {
		const token = this.generate();
		const encryptedToken = await this.cryptoService.encrypt(token);

		await this.tokenRepository.upsert(
			{
				userId,
				type,
			},
			{ userId, tokenHash: encryptedToken, type }
		);
		return token;
	}
}
