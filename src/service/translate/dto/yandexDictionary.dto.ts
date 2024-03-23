export class YandexDictionaryRequestFilterDto {
	url: string;
	method: string;
	params?: {
		lang: string;
		text: string;
	};
}
