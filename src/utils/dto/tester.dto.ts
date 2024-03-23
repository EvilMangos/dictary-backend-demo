import { TId } from "../type/id.type";
import { Prop, Schema } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { UserDto } from "./user.dto";
import {
	TestWordDto,
	TestWordSchema,
} from "../../service/tester/dto/testWord.dto";

export class TesterForCreateDto {
	@Prop({
		required: true,
		type: MongooseSchema.Types.ObjectId,
		ref: UserDto.name,
	})
	userId: TId;
	@Prop({ type: [TestWordSchema], default: [] })
	words: TestWordDto[];
}

@Schema({
	collection: "testers",
	timestamps: { createdAt: true, updatedAt: false },
	versionKey: false,
})
export class TesterDto extends TesterForCreateDto {
	_id: TId;
}
