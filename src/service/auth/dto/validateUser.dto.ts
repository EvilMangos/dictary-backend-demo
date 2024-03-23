import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class validUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;
	@IsNotEmpty()
	password?: string;
	@IsOptional()
	interfaceLanguage: string;
}
