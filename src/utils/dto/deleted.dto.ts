import { IsBoolean } from "class-validator";

export class DeletedDto {
	@IsBoolean()
	deleted: boolean;
}
