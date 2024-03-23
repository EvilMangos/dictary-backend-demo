import { Injectable } from "@nestjs/common";
import { UserDto, UserForCreateDto } from "../../utils/dto/user.dto";
import { DbService } from "../db/db.service";
import { TId } from "../../utils/type/id.type";
import { UserForUpdateDto } from "./dto/userForUpdate.dto";
import { ClientSession } from "mongoose";
import { RolesEnum } from "shared-structures";
import { ConfigService } from "@nestjs/config";
import { SubscriptionDto } from "../../utils/dto/Subscription.dto";

@Injectable()
export class UserRepository {
	constructor(private db: DbService, private configService: ConfigService) {}
	async create(data: UserForCreateDto): Promise<UserDto> {
		return this.db.model.user.create(data);
	}

	async findById(
		id: TId,
		session: ClientSession | null = null
	): Promise<UserDto> {
		const user = await this.db.model.user.findById(id).session(session);
		return user?.toObject() || user;
	}

	async findByEmail(email: string): Promise<UserDto> {
		return this.db.model.user.findOne({ email });
	}

	async updateOne(userId: TId, data: UserForUpdateDto): Promise<UserDto> {
		const user = await this.db.model.user.findOneAndUpdate(
			{ _id: userId },
			{ $set: data },
			{
				new: true,
			}
		);
		return user.toObject();
	}

	async updateMany(data: UserForUpdateDto): Promise<boolean> {
		const result = await this.db.model.user.updateMany({}, data);
		return result.acknowledged;
	}

	async deleteById(
		id: TId,
		session: ClientSession | null = null
	): Promise<boolean> {
		const deleted = await this.db.model.user
			.deleteOne({ _id: id })
			.session(session);
		return deleted.acknowledged;
	}

	async findExpiredGuests(
		session: ClientSession | null = null
	): Promise<UserDto[]> {
		const activeHours = this.configService.get("GUEST_ACCOUNT_HOURS_TO_EXPIRE");
		const oldestAllowedDate = new Date(
			new Date().getTime() - +activeHours * 60 * 60 * 1000
		);
		return this.db.model.user
			.find({
				role: RolesEnum.Guest,
				createdAt: { $lte: oldestAllowedDate },
			})
			.session(session);
	}

	async deleteMany(
		ids: TId[],
		session: ClientSession | null = null
	): Promise<boolean> {
		const deleted = await this.db.model.user
			.deleteMany({ _id: ids })
			.session(session);
		return deleted.acknowledged;
	}

	async findByCustomerId(id: string): Promise<UserDto> {
		const user = await this.db.model.user.findOne({
			"subscription.customerId": id,
		});
		return user?.toObject() || null;
	}

	async updateByCustomerId(
		id: string,
		data: UserForUpdateDto
	): Promise<UserDto> {
		const user = await this.db.model.user.findOneAndUpdate(
			{
				"subscription.customerId": id,
			},
			{ $set: data },
			{ new: true }
		);

		return user?.toObject() || null;
	}

	async updateSubscription(
		id: TId,
		data: Partial<SubscriptionDto>
	): Promise<SubscriptionDto> {
		const dataForUpdate = {};
		for (const key in data) {
			dataForUpdate[`subscription.${key}`] = data[key];
		}
		return this.db.model.user.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$set: dataForUpdate,
			},
			{ new: true }
		);
	}
}
