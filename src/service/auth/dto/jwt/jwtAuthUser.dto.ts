import { TId } from "../../../../utils/type/id.type";
import { IsBoolean, IsString } from "class-validator";
import { RolesEnum } from "shared-structures";

export class JwtAuthUserDto {
	@IsString()
	id: TId;
	@IsBoolean()
	role: RolesEnum;
}
