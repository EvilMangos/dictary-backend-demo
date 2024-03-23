import { SchemaFactory } from "@nestjs/mongoose";
import { TesterDto } from "../../../utils/dto/tester.dto";

export const TesterSchema = SchemaFactory.createForClass(TesterDto);
