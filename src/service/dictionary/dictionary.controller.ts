import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { DictionaryService } from "./dictionary.service";
import { CreateDictionaryRequestDto } from "./dto/createDictionary/createDictionary.request.dto";
import { AuthUser } from "../auth/decorator/authUser.decorator";
import { JwtAuthUserDto } from "../auth/dto/jwt/jwtAuthUser.dto";
import { TId } from "../../utils/type/id.type";
import { UpdateDictionaryRequestDto } from "./dto/updateDictionary/updateDictionary.request.dto";
import { ApiTags } from "@nestjs/swagger";
import { ApiTagEnum } from "../../utils/enum/apiTag.enum";
import { DictionaryWithAutofillDto } from "./dto/dictionaryWithAutofill.dto";
import {
	DictionaryWithoutWords,
	GetDictionariesResponseDto,
} from "./dto/getDictionaries/getDictionaries.response.dto";
import { GetDictionariesRequestDto } from "./dto/getDictionaries/getDictionaries.request.dto";
import { Roles } from "../auth/decorator/roles.decorator";
import { GetDictionaryRequestDto } from "./dto/getDictionary/getDictionary.request.dto";
import { RolesEnum } from "shared-structures";
import { DictionaryDto } from "../../utils/dto/dictionary.dto";
import { CreateDictionaryResponseDto } from "./dto/createDictionary/createDictionary.response.dto";
import { DeletedDto } from "../../utils/dto/deleted.dto";

@Controller("dictionaries")
@ApiTags(ApiTagEnum.dictionaries)
export class DictionaryController {
	constructor(private dictionaryService: DictionaryService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@Roles(
		RolesEnum.User,
		RolesEnum.Guest,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async createDictionary(
		@Body() data: CreateDictionaryRequestDto,
		@AuthUser() user: JwtAuthUserDto
	): Promise<CreateDictionaryResponseDto> {
		const dictionary = await this.dictionaryService.create(data, user);
		return new CreateDictionaryResponseDto({ dictionaryId: dictionary._id });
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@Roles(
		RolesEnum.User,
		RolesEnum.Guest,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async getUserDictionaries(
		@Query() queryParams: GetDictionariesRequestDto,
		@AuthUser()
		user: JwtAuthUserDto
	): Promise<GetDictionariesResponseDto> {
		const dictionaries = await this.dictionaryService.findByUser(
			user,
			queryParams
		);
		const publicDictionaries = dictionaries.map(
			(dictionary) =>
				new DictionaryWithoutWords({
					...dictionary,
					length: dictionary.words.length,
				})
		);
		return { data: publicDictionaries };
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	@Roles(
		RolesEnum.User,
		RolesEnum.Guest,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async getDictionary(
		@Param("id") id: TId,
		@AuthUser() user: JwtAuthUserDto,
		@Query() params: GetDictionaryRequestDto
	): Promise<DictionaryWithAutofillDto> {
		const dictionary = await this.dictionaryService.getDictionary(
			id,
			user,
			params
		);

		return new DictionaryWithAutofillDto(dictionary);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	@Roles(
		RolesEnum.User,
		RolesEnum.Guest,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async deleteDictionary(
		@Param("id") id: TId,
		@AuthUser() user: JwtAuthUserDto
	): Promise<DeletedDto> {
		const deleted = await this.dictionaryService.deleteDictionary(id, user.id);
		return { deleted };
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	@Roles(
		RolesEnum.User,
		RolesEnum.Guest,
		RolesEnum.Premium,
		RolesEnum.Developer
	)
	async updateDictionary(
		@Param("id") id: TId,
		@Body() data: UpdateDictionaryRequestDto,
		@AuthUser() user: JwtAuthUserDto
	): Promise<DictionaryDto> {
		return this.dictionaryService.updateDictionary(id, data, user);
	}
}
