import { Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service";
import { FilterQuery } from "mongoose";
import { TokenDto } from "../../utils/dto/token.dto";

@Injectable()
export class TokenRepository {
	constructor(private dbService: DbService) {}

	async findOne(filter: FilterQuery<TokenDto>): Promise<TokenDto> {
		return this.dbService.model.token.findOne(filter);
	}

	async upsert(filter: FilterQuery<TokenDto>, data: object): Promise<TokenDto> {
		return this.dbService.model.token.findOneAndUpdate(filter, data, {
			upsert: true,
		});
	}

	async delete(filter: FilterQuery<TokenDto>): Promise<boolean> {
		const deleted = await this.dbService.model.token.deleteOne(filter);
		return deleted.acknowledged;
	}
}
