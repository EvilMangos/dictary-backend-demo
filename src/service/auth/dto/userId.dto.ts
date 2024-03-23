import { TId } from "../../../utils/type/id.type";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class UserIdDto {
	@ApiProperty({ type: "string" })
	@Transform((property) => property.value.toString())
	userId: TId;

	constructor(partial: Partial<UserIdDto>) {
		Object.assign(this, partial);
	}
}
