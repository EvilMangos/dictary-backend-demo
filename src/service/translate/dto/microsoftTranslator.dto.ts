export class MicrosoftTranslatorRequestFilterDto {
	text?: string[];
	url: string;
	method: string;
	params?: { from: string; to: string };
}
