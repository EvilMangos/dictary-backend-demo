import {
	IsArray,
	IsBoolean,
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	ValidateNested,
} from "class-validator";
import { WordForCreateDto } from "../../../../utils/dto/word.dto";
import { Transform, Type } from "class-transformer";
import { TId } from "../../../../utils/type/id.type";
import { ApiProperty } from "@nestjs/swagger";
import { LanguagesEnum, LengthsLimits, Patterns } from "shared-structures";

export class WordForUpdate extends WordForCreateDto {
	@ApiProperty({ type: "string" })
	@Transform((property) => property.value.toString())
	@IsString()
	_id?: TId;
	@IsBoolean()
	isDeleted?: boolean;
	@IsBoolean()
	isCreated?: boolean;
}

export class UpdateDictionaryRequestDto {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@Matches(Patterns.name)
	@MaxLength(LengthsLimits.short)
	name?: string;
	@IsEnum(LanguagesEnum)
	@IsNotEmpty()
	@IsOptional()
	termsLanguage?: LanguagesEnum;
	@IsEnum(LanguagesEnum)
	@IsNotEmpty()
	@IsOptional()
	definitionsLanguage?: LanguagesEnum;
	@ValidateNested({ each: true })
	@Type(() => WordForUpdate)
	@IsOptional()
	words?: WordForUpdate[];
	@IsDate()
	@IsNotEmpty()
	@IsOptional()
	createdAt?: Date;
}

export class WordForUpdateWithCache extends WordForUpdate {
	@IsArray()
	@IsString({ each: true })
	cacheDefinitions?: string[];
}
