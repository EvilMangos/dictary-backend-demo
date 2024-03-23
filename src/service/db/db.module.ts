import { Module } from "@nestjs/common";
import { DbService } from "./db.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserDto } from "../../utils/dto/user.dto";
import { UserSchema } from "./schemas/user.schema";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DictionaryDto } from "../../utils/dto/dictionary.dto";
import { DictionarySchema } from "./schemas/dictionary.schema";
import { TesterDto } from "../../utils/dto/tester.dto";
import { TesterSchema } from "./schemas/tester.schema";
import { TokenDto } from "../../utils/dto/token.dto";
import { TokenSchema } from "./schemas/token.schema";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get("MONGODB_URI"),
			}),
			inject: [ConfigService],
		}),
		MongooseModule.forFeature([
			{ name: UserDto.name, schema: UserSchema },
			{ name: DictionaryDto.name, schema: DictionarySchema },
			{ name: TesterDto.name, schema: TesterSchema },
			{ name: TokenDto.name, schema: TokenSchema },
		]),
	],
	providers: [DbService],
	exports: [DbService],
})
export class DbModule {}
