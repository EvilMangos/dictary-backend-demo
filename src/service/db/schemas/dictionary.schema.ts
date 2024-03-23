import { SchemaFactory } from "@nestjs/mongoose";
import { DictionaryDto } from "../../../utils/dto/dictionary.dto";

export const DictionarySchema = SchemaFactory.createForClass(DictionaryDto);
