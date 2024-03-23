import request from "supertest";
import { HttpStatus } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { UtilsService } from "../../utils/utils.service";
import {
	DictionaryWordsSortingEnum,
	RolesEnum,
	SortDirectionsEnum,
} from "shared-structures";
import { SortingService } from "../../utils/sorting.service";

const sortingService = new SortingService();

export async function wordSortingHelper(
	server: NestApplication,
	utilsService: UtilsService,
	params: {
		sort: DictionaryWordsSortingEnum;
		sortDirection: SortDirectionsEnum;
	}
) {
	const { user, authCookie } = await utilsService.createUser(
		RolesEnum.User,
		server
	);
	const dictionary = await utilsService.createDictionary(user._id);
	const words = await utilsService.addWordsToDictionary(dictionary._id, 10);

	const url = utilsService.addQueryParamsToURL(
		`/dictionaries/${dictionary._id}`,
		[
			{ key: "sort", value: params.sort.toString() },
			{ key: "sortDirection", value: params.sortDirection.toString() },
		]
	);

	const response = await request(server).get(url).set("Cookie", authCookie);

	expect(response.status).toBe(HttpStatus.OK);
	expect(response.body.words.length).toBe(words.length);

	const sortProperty = sortingService.getWordSorting(params.sort);

	const modelData = response.body.words.sort(
		params.sortDirection === SortDirectionsEnum.asc
			? (a, b) => {
					if (a[sortProperty] > b[sortProperty]) return 1;
					if (a[sortProperty] === b[sortProperty]) return 0;
					return -1;
			  }
			: (a, b) => {
					{
						if (a[sortProperty] > b[sortProperty]) return -1;
						if (a[sortProperty] === b[sortProperty]) return 0;
						return 1;
					}
			  }
	);

	const responseIds = response.body.words.map((value) => value._id);
	const modelIds = modelData.map((value) => value._id);

	expect(JSON.stringify(responseIds)).toBe(JSON.stringify(modelIds));
}
