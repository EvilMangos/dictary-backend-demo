import request from "supertest";
import { HttpStatus } from "@nestjs/common";
import { SortingService } from "../../utils/sorting.service";
import { NestApplication } from "@nestjs/core";
import { UtilsService } from "../../utils/utils.service";
import {
	DictionarySortingEnum,
	RolesEnum,
	SortDirectionsEnum,
} from "shared-structures";

const sortingService = new SortingService();

export async function dictionarySortingHelper(
	server: NestApplication,
	utilsService: UtilsService,
	params: { sort: DictionarySortingEnum; sortDirection: SortDirectionsEnum }
) {
	const { user, authCookie } = await utilsService.createUser(
		RolesEnum.User,
		server
	);
	const dictionaries = await utilsService.createDictionaries(user._id, 5);

	const url = utilsService.addQueryParamsToURL("/dictionaries", [
		{ key: "sort", value: params.sort.toString() },
		{ key: "sortDirection", value: params.sortDirection.toString() },
	]);

	const response = await request(server).get(url).set("Cookie", authCookie);

	expect(response.status).toBe(HttpStatus.OK);
	expect(response.body.data.length).toBe(dictionaries.length);

	const modelData = await utilsService.findDictionaries(
		{ userId: user._id },
		sortingService.getDictionaryQuery(params.sort, params.sortDirection)
	);

	const responseIds = response.body.data.map((value) => value._id);
	const modelIds = modelData.map((value) => value._id);

	expect(JSON.stringify(responseIds)).toBe(JSON.stringify(modelIds));
}
