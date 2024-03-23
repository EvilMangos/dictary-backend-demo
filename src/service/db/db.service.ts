import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { UserDto } from "../../utils/dto/user.dto";
import { Connection, Model } from "mongoose";
import { ModelDto } from "./dto/model.dto";
import { DictionaryDto } from "../../utils/dto/dictionary.dto";
import { TesterDto } from "../../utils/dto/tester.dto";
import { TokenDto } from "../../utils/dto/token.dto";

@Injectable()
export class DbService {
	public model: ModelDto = {};

	constructor(
		@InjectConnection() private readonly connection: Connection,
		@InjectModel(UserDto.name) userModel: Model<UserDto>,
		@InjectModel(DictionaryDto.name) dictionaryModel: Model<DictionaryDto>,
		@InjectModel(TesterDto.name) testerModel: Model<TesterDto>,
		@InjectModel(TokenDto.name) tokenModel: Model<TokenDto>
	) {
		this.model.user = userModel;
		this.model.dictionary = dictionaryModel;
		this.model.tester = testerModel;
		this.model.token = tokenModel;
	}

	getConnection(): Connection {
		return this.connection;
	}
}
