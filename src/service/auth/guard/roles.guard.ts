import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/roles.decorator";
import { RolesEnum } from "shared-structures";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		);

		const { user } = context.switchToHttp().getRequest();
		if (!requiredRoles) {
			return true;
		}
		return requiredRoles.includes(user.role);
	}
}
