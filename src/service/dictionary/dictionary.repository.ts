import { Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service";
import { TId } from "../../utils/type/id.type";
import {
	DictionaryDto,
	DictionaryForCreateDto,
} from "../../utils/dto/dictionary.dto";
import { ClientSession } from "mongoose";
import { DictionarySortingEnum, SortDirectionsEnum } from "shared-structures";

@Injectable()
export class DictionaryRepository {
	constructor(private db: DbService) {}

	async findById(id: TId): Promise<DictionaryDto> {
		const dictionary = await this.db.model.dictionary.findById(
			id,
			{},
			{
				sort: {
					words: 1,
				},
			}
		);
		return dictionary ? dictionary.toObject() : null;
	}
	async findByUser(
		userId: TId,
		filter?: string,
		sort?: DictionarySortingEnum,
		sortDirection?: SortDirectionsEnum
	): Promise<DictionaryDto[]> {
		const filterQuery = this.getFilterQuery(filter, "name");
		const sortQuery = this.getSortQuery(sort, sortDirection);
		const dictionaries = await this.db.model.dictionary.find(
			{ userId: userId, ...filterQuery },
			null,
			{ sort: sortQuery }
		);
		return dictionaries.map((dictionary) => dictionary.toObject());
	}
	getFilterQuery(filter: string, property: string): { [key: string]: RegExp } {
		return filter
			? { [property]: new RegExp(`.*${filter ? filter : ""}.*`) }
			: null;
	}
	getSortQuery(
		sort: DictionarySortingEnum,
		sortDirection: SortDirectionsEnum = SortDirectionsEnum.asc
	): { [key: string]: number } {
		let order: string;
		switch (sort) {
			case DictionarySortingEnum.name:
				order = "name";
				break;
			case DictionarySortingEnum.date:
				order = "updatedAt";
				break;
			case DictionarySortingEnum.words:
				order = "words";
				break;
			default:
				order = "updatedAt";
		}
		return { [order]: +sortDirection };
	}
	async create(dictionary: DictionaryForCreateDto): Promise<DictionaryDto> {
		return this.db.model.dictionary.create(dictionary);
	}
	async deleteById(id: TId): Promise<boolean> {
		const result = await this.db.model.dictionary.deleteOne({ _id: id });
		return result.acknowledged;
	}

	async update(dictionaryData: DictionaryDto): Promise<DictionaryDto> {
		const dictionary = await this.db.model.dictionary.findOneAndUpdate(
			{ _id: dictionaryData._id },
			dictionaryData,
			{ new: true }
		);
		return dictionary ? dictionary.toObject() : null;
	}

	async deleteByUserIds(ids: TId[], session: ClientSession | null = null) {
		return this.db.model.dictionary
			.deleteMany({ userId: ids })
			.session(session);
	}
}
