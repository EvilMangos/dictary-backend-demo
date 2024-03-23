import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { UserRepository } from "../service/user/user.repository";
import { DictionaryRepository } from "../service/dictionary/dictionary.repository";
import { TesterRepository } from "../service/tester/tester.repository";

@Injectable()
export class TaskService {
	constructor(
		private userRepository: UserRepository,
		private dictionaryRepository: DictionaryRepository,
		private testerRepository: TesterRepository,
		@InjectConnection() private readonly connection: Connection
	) {}

	@Cron(CronExpression.EVERY_HOUR)
	async deleteExpiredGuests() {
		const session = await this.connection.startSession();

		await session.withTransaction(async () => {
			const users = await this.userRepository.findExpiredGuests(session);
			if (!users) {
				return;
			}
			const usersIds = users.map((user) => user._id);
			await this.testerRepository.deleteMany(usersIds, session);
			await this.dictionaryRepository.deleteByUserIds(usersIds, session);
			await this.userRepository.deleteMany(usersIds);
		});

		await session.endSession();
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async resetTestingAttempts() {
		await this.userRepository.updateMany({ testersCounter: 0 });
	}
}
