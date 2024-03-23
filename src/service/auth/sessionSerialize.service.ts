import { PassportSerializer } from "@nestjs/passport";
import { UserRepository } from "../user/user.repository";
import { GoogleAuthUserDto } from "./dto/google/googleAuthUser.dto";

export class SessionSerializeService extends PassportSerializer {
	constructor(private userService: UserRepository) {
		super();
	}

	//eslint-disable-next-line
	serializeUser(user: GoogleAuthUserDto, done: Function): void {
		done(null, user);
	}

	async deserializeUser(
		payload: GoogleAuthUserDto,
		//eslint-disable-next-line
		done: Function
	): Promise<void> {
		const user = await this.userService.findByEmail(payload.email);
		return done(null, user);
	}
}
