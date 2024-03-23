import { Prop, Schema } from "@nestjs/mongoose";
import { WordDto, WordSchema } from "./word.dto";
import { IsEnum, IsNotEmpty } from "class-validator";
import { Schema as MongooseSchema } from "mongoose";
import { UserDto } from "./user.dto";
import { TId } from "../type/id.type";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { LanguagesEnum } from "shared-structures";

export class DictionaryForCreateDto {
	@ApiProperty({ type: "string" })
	@Prop({
		required: true,
		type: MongooseSchema.Types.ObjectId,
		ref: UserDto.name,
	})
	@Exclude()
	userId: TId;
	@Prop({ required: true })
	@IsNotEmpty()
	name: string;
	@Prop({ required: true, enum: LanguagesEnum })
	@IsNotEmpty()
	@IsEnum(LanguagesEnum)
	termsLanguage: LanguagesEnum;
	@Prop({ required: true, enum: LanguagesEnum })
	@IsNotEmpty()
	@IsEnum(LanguagesEnum)
	definitionsLanguage: LanguagesEnum;
	@Prop([WordSchema])
	words: WordDto[];
}

@Schema({ collection: "dictionaries", timestamps: true, versionKey: false })
export class DictionaryDto extends DictionaryForCreateDto {
	@ApiProperty({ type: "string" })
	@Transform((property) => property.value.toString())
	_id: TId;

	constructor(partial: Partial<DictionaryDto>) {
		super();
		Object.assign(this, partial);
	}
}
