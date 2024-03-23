import { UserDto } from "../../../utils/dto/user.dto";
import { Model } from "mongoose";
import { DictionaryDto } from "../../../utils/dto/dictionary.dto";
import { TesterDto } from "../../../utils/dto/tester.dto";
import { TokenDto } from "../../../utils/dto/token.dto";

export class ModelDto {
	user?: Model<UserDto>;
	dictionary?: Model<DictionaryDto>;
	tester?: Model<TesterDto>;
	token?: Model<TokenDto>;
}
