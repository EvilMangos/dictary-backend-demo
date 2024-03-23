import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { TId } from "../../../../utils/type/id.type";

export class CreateDictionaryResponseDto {
	@ApiProperty({ type: "string" })
	@Transform((property) => property.value.toString())
	dictionaryId: TId;

	constructor(partial: Partial<CreateDictionaryResponseDto>) {
		Object.assign(this, partial);
	}
}
