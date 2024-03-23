import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserRepository } from "../../user/user.repository";

@Injectable()
export class UserGuard implements CanActivate {
	constructor(private userRepository: UserRepository) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { user } = context.switchToHttp().getRequest();
		if (!user) {
			return true;
		}

		const dbUser = await this.userRepository.findById(user.id);
		return !!dbUser;
	}
}
