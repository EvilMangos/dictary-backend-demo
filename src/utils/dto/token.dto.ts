import { TId } from "../type/id.type";
import { Prop, Schema } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { UserDto } from "./user.dto";
import { TokenTypesEnum } from "../../service/token/enum/tokenTypes.enum";
import { IsEnum } from "class-validator";

export class TokenForCreateDto {
	@Prop({
		required: true,
		type: MongooseSchema.Types.ObjectId,
		ref: UserDto.name,
	})
	userId: TId;
	@Prop()
	tokenHash: string;
	@Prop({ enum: TokenTypesEnum, required: true })
	@IsEnum(TokenTypesEnum)
	type: TokenTypesEnum;
}

@Schema({
	collection: "tokens",
	versionKey: false,
})
export class TokenDto extends TokenForCreateDto {
	_id: TId;
	@Prop({ type: Date, default: new Date(), expires: "3h" })
	createdAt: Date;
}
