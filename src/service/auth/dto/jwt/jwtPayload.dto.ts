import { TId } from "../../../../utils/type/id.type";
import { RolesEnum } from "shared-structures";

export class JwtPayloadDto {
	sub: TId;
	role: RolesEnum;
}
