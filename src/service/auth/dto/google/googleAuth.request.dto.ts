import { IsNotEmpty, IsString } from "class-validator";

export class GoogleAuthRequestDto {
	@IsString()
	@IsNotEmpty()
	credential: string;
	@IsString()
	@IsNotEmpty()
	clientId: string;
	@IsString()
	@IsNotEmpty()
	select_by: string;
}
