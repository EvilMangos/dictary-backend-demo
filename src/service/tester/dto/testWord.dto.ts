import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class TestWordDto {
	@Prop({ required: true })
	term: string;
	@Prop({ required: true, types: [String] })
	definitions: string[];
	@Prop({ required: true, default: [] })
	doneDefinitions: string[];
	@Prop({ required: true })
	needAnswers: number;
	@Prop({ required: true, default: false })
	skipped: boolean;
}
export const TestWordSchema = SchemaFactory.createForClass(TestWordDto);
