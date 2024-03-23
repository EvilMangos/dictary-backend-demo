export enum LingvoLanguagesCodeEnum {
	en = 1033,
	de = 1031,
	it = 1049,
	fr = 1036,
	es = 1034,
	uk = 1058,
}

export const LingvoDictionaries = [
	{
		from: LingvoLanguagesCodeEnum.en,
		to: LingvoLanguagesCodeEnum.uk,
	},
	{
		from: LingvoLanguagesCodeEnum.uk,
		to: LingvoLanguagesCodeEnum.en,
	},
];
