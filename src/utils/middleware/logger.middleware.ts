import {
	ConsoleLogger,
	Inject,
	Injectable,
	NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LoggerService } from "@nestjs/common/services/logger.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(@Inject(ConsoleLogger) private logger: LoggerService) {}
	use(request: Request, response: Response, next: NextFunction) {
		const { ip, method, originalUrl: url } = request;
		const userAgent = request.get("user-agent") || "";
		const startTime = Date.now();

		response.on("finish", () => {
			const { statusCode } = response;
			const finishTime = Date.now();
			const duration = finishTime - startTime;

			this.logger.log(
				this.messageFormat(method, url, statusCode, duration, userAgent, ip)
			);
		});
		next();
	}

	messageFormat(
		method: string,
		url: string,
		statusCode: number,
		duration: number,
		userAgent: string,
		ip: string
	) {
		return `${method} ${url} ${statusCode} ${duration} - ${userAgent} ${ip}`;
	}
}
