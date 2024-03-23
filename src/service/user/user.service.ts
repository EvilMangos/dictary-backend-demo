import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CryptoService } from "../crypto/crypto.service";
import { UserDto } from "../../utils/dto/user.dto";
import { TId } from "../../utils/type/id.type";
import { UpdateUserRequestDto } from "./dto/updateUser/updateUser.request.dto";
import { RolesEnum } from "shared-structures";
import { UserForUpdateDto } from "./dto/userForUpdate.dto";
import { JwtAuthUserDto } from "../auth/dto/jwt/jwtAuthUser.dto";

@Injectable()
export class UserService {
	constructor(
		private userRepository: UserRepository,
		private cryptoService: CryptoService
	) {}

	async updateUser(
		user: JwtAuthUserDto,
		data: UpdateUserRequestDto
	): Promise<UserDto> {
		const validData: UserForUpdateDto = {};
		const {
			dictionariesSort,
			dictionariesSortDirection,
			dictionaryWordsSort,
			dictionaryWordsSortDirection,
		} = data;
		if (dictionariesSort) {
			validData["sortingConfigs.dictionariesSort"] = dictionariesSort;
		}
		if (dictionariesSortDirection) {
			validData["sortingConfigs.dictionariesSortDirection"] =
				dictionariesSortDirection;
		}
		if (dictionaryWordsSort) {
			validData["sortingConfigs.dictionaryWordsSort"] = dictionaryWordsSort;
		}
		if (dictionaryWordsSortDirection) {
			validData["sortingConfigs.dictionaryWordsSortDirection"] =
				dictionaryWordsSortDirection;
		}
		if (user.role === RolesEnum.Guest) {
			const { shouldShowWelcomeMessage } = data;
			validData.shouldShowWelcomeMessage = shouldShowWelcomeMessage;
		} else {
			const { password, interfaceLanguage } = data;
			if (password) {
				validData.password = await this.cryptoService.encrypt(password);
			}
			if (interfaceLanguage) {
				validData.interfaceLanguage = interfaceLanguage;
			}
		}

		return this.userRepository.updateOne(user.id, validData);
	}

	async getUser(id: TId): Promise<UserDto> {
		const user = await this.userRepository.findById(id);
		if (user.role === RolesEnum.Guest) {
			return {
				...user,
				email: "JohnDoe@gmail.com",
			};
		}
		return user;
	}
}
