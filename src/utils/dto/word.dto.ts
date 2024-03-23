import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
	IsArray,
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	Validate,
} from "class-validator";
import { TId } from "../type/id.type";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { LengthsLimits, Patterns } from "shared-structures";
import { ArrayRegexValidator } from "../validator/arrayRegexValidator";
import { ArrayTotalLengthValidator } from "../validator/arrayTotalLengthValidator";

export class WordForCreateDto {
	@IsString()
	@IsNotEmpty()
	@Prop()
	@Matches(Patterns.word)
	@MaxLength(LengthsLimits.middle)
	term: string;
	@IsArray()
	@IsString({ each: true })
	@Prop()
	@IsOptional()
	@Validate(ArrayRegexValidator)
	@Validate(ArrayTotalLengthValidator, [LengthsLimits.long])
	definitions: string[];
	@IsDate()
	@Prop({ default: new Date(), type: Date, required: true })
	createdAt?: Date;
	@IsDate()
	@Prop({ default: new Date(), type: Date, required: true })
	updatedAt?: Date;
}

@Schema()
export class WordDto extends WordForCreateDto {
	@ApiProperty({ type: "string" })
	@Transform((property) => property.value.toString())
	@IsString()
	_id?: TId;
	@IsArray()
	@IsString({ each: true })
	@Prop()
	@Exclude()
	cacheDefinitions?: string[];
}

export const WordSchema = SchemaFactory.createForClass(WordDto);
