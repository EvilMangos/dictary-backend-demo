import { getTestingApp } from "./utils/getTestingApp";
import { DbService } from "../src/service/db/db.service";

module.exports = async () => {
	const { app } = await getTestingApp();
	const dbService = app.get(DbService);
	const promises = Object.keys(dbService.model).map(async (key) =>
		dbService.model[key].deleteMany()
	);
	await Promise.all(promises);

	await app.close();
};
