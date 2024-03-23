import {
	DictionarySortingEnum,
	DictionaryWordsSortingEnum,
	SortDirectionsEnum,
} from "shared-structures";

export class SortingService {
	getDictionaryQuery(
		sort: DictionarySortingEnum,
		sortDirection: SortDirectionsEnum
	): { [p: string]: SortDirectionsEnum } {
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
		return this.formQuery(order, sortDirection);
	}

	formQuery(
		sort: string,
		sortDirection: SortDirectionsEnum
	): { [p: string]: SortDirectionsEnum } {
		return { [sort]: sortDirection };
	}

	getWordSorting(sort: DictionaryWordsSortingEnum): string {
		switch (sort) {
			case DictionaryWordsSortingEnum.term:
				return "term";
			case DictionaryWordsSortingEnum.date:
				return "updatedAt";
			case DictionaryWordsSortingEnum.default:
				return "createAt";
		}
	}
}
