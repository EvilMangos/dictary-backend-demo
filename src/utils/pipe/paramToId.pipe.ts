import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform,
} from "@nestjs/common";
import mongoose from "mongoose";

export class ParamToIdPipe implements PipeTransform {
	async transform(value: string, metadata: ArgumentMetadata) {
		if (metadata.type !== "param") {
			return value;
		}

		try {
			return new mongoose.Types.ObjectId(value);
		} catch (err) {
			throw new BadRequestException("Validation failed");
		}
	}
}
