import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export class CryptoService {
	async encrypt(element: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		return bcrypt.hash(element, salt);
	}

	async isMatch(element: string, hash: string): Promise<boolean> {
		return bcrypt.compare(element, hash);
	}
}
