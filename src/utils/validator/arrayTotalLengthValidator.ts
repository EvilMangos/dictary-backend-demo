import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "arrayTotalLengthValidator", async: false })
export class ArrayTotalLengthValidator implements ValidatorConstraintInterface {
	validate(words: string[], args: ValidationArguments): boolean {
		return words.join("").length < args.constraints[0];
	}

	defaultMessage(args: ValidationArguments): string {
		return `${args.property} length limit is ${args.constraints[0]} characters`;
	}
}
