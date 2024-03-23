import { Injectable } from "@nestjs/common";
import { SubjectEnum } from "./enum/subject.enum";
import { MessageDto } from "./dto/message.dto";
import { ConfigService } from "@nestjs/config";
import SendGrid from "@sendgrid/mail";

@Injectable()
export class MailService {
	private readonly mailerService: SendGrid.MailService;
	constructor(private configService: ConfigService) {
		this.mailerService = SendGrid;
		this.mailerService.setApiKey(this.configService.get("SENDGRID_API_KEY"));
	}

	async sendVerificationCode(email: string, code: string): Promise<void> {
		await this.send(
			this.formatMessage(email, SubjectEnum.accountVerification, code)
		);
	}

	async send(data: MessageDto): Promise<void> {
		await this.mailerService.send(data);
	}

	formatMessage(email: string, subject: string, text: string): MessageDto {
		return {
			to: email,
			subject,
			text,
			from: this.configService.get("MAIL_USER"),
		};
	}

	async sendRestoreCode(email: string, code: string): Promise<void> {
		await this.send(
			this.formatMessage(email, SubjectEnum.passwordRestore, code)
		);
	}
}
