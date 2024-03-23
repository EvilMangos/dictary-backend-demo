import { IsBoolean, IsDateString, IsString } from "class-validator";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";

@Schema({ _id: false })
export class SubscriptionDto {
	@Prop()
	@IsString()
	@Exclude()
	sessionId: string;
	@Prop()
	@IsString()
	@Exclude()
	id: string;
	@Prop()
	@IsString()
	@Exclude()
	customerId: string;
	@Prop()
	@IsDateString()
	expiredAt: Date;
	@Prop()
	@IsBoolean()
	isCanceled: Boolean;

	constructor(partial: Partial<SubscriptionDto>) {
		Object.assign(this, partial);
	}
}

export const SubscriptionSchema = SchemaFactory.createForClass(SubscriptionDto);
