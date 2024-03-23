import { Prop, Schema } from "@nestjs/mongoose";
import { IsBoolean, IsEmail, IsInt, IsNotEmpty } from "class-validator";
import { TId } from "../type/id.type";
import { Exclude, Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { RolesEnum } from "shared-structures";
import { SubscriptionDto, SubscriptionSchema } from "./Subscription.dto";
import { SortingConfigsDto, SortingConfigsSchema } from "./sortingConfigs.dto";

export class UserForCreateDto {
	@Prop()
	interfaceLanguage: string;
	@Prop({ required: true, unique: true })
	@IsEmail()
	@IsNotEmpty()
	email: string;
	@Prop()
	@IsNotEmpty()
	@Exclude()
	password?: string;
	@Prop({ require: true, enum: RolesEnum })
	role: RolesEnum;
	@IsBoolean()
	@Prop({ default: false, require: true })
	shouldShowWelcomeMessage?: boolean;
	@Prop(SortingConfigsSchema)
	@Type(() => SortingConfigsDto)
	sortingConfigs: SortingConfigsDto;
}
@Schema({ collection: "users", timestamps: true, versionKey: false })
export class UserDto extends UserForCreateDto {
	@ApiProperty({ type: "string" })
	@Transform((property) => property.value.toString())
	_id: TId;
	@Prop({ default: 0 })
	@IsInt()
	testersCounter?: number;
	@Prop(SubscriptionSchema)
	@Type(() => SubscriptionDto)
	subscription?: SubscriptionDto;

	constructor(partial: Partial<UserDto>) {
		super();
		Object.assign(this, partial);
	}
}
