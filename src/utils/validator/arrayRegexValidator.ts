import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import { Patterns } from "shared-structures";

@ValidatorConstraint({ name: "arrayRegexValidator", async: false })
export class ArrayRegexValidator implements ValidatorConstraintInterface {
	validate(words: string[]): boolean {
		return !words.map((word) => Patterns.word.test(word)).includes(false);
	}

	defaultMessage(args: ValidationArguments): string {
		return `${args.property} includes one or more forbidden characters`;
	}
}
