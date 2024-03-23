import { faker } from "@faker-js/faker";
import { SignUpRequestDto } from "../../src/service/auth/dto/signUp/signUp.request.dto";
import { LanguagesEnum } from "shared-structures";

export const getSignUpData = (): SignUpRequestDto => {
	const password = faker.internet.password();
	return {
		email: faker.internet.email(),
		password: password.length > 6 ? password : password + password,
		interfaceLanguage: LanguagesEnum.us,
		acceptPolicy: true,
	};
};
