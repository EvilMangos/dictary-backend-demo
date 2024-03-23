import { TId } from "../../../../utils/type/id.type";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateGuestAccountResponseDto {
	@ApiProperty({ type: "string" })
	@Transform((property) => property.value.toString())
	_id: TId;

	constructor(partial: Partial<CreateGuestAccountResponseDto>) {
		Object.assign(this, partial);
	}
}
