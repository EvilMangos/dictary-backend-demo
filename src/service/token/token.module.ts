import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { DbModule } from "../db/db.module";
import { CryptoModule } from "../crypto/crypto.module";
import { TokenRepository } from "./token.repository";

@Module({
	imports: [DbModule, CryptoModule],
	providers: [TokenRepository, TokenService],
	exports: [TokenService],
})
export class TokenModule {}
