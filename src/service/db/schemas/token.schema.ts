import { SchemaFactory } from "@nestjs/mongoose";
import { TokenDto } from "../../../utils/dto/token.dto";

export const TokenSchema = SchemaFactory.createForClass(TokenDto);
