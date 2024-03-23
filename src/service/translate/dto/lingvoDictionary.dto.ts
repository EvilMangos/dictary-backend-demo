export class LingvoDictionaryDto {
	url: string;
	method: string;
	token?: string;
	params?: {
		srcLang: number;
		dstLang: number;
		text: string;
	};
}
