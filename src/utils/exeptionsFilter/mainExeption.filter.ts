import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class MainExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();

		const exceptionResponse = exception.getResponse();

		if (typeof exceptionResponse === "string") {
			response.status(status).json({
				statusCode: status,
				message: exceptionResponse,
				error: exception.message,
			});
		}
		if (typeof exceptionResponse === "object") {
			const errorMessage = exceptionResponse["message"];
			const isArray = Array.isArray(errorMessage);
			response.status(status).json({
				statusCode: status,
				message: isArray
					? errorMessage
							.map((error: string) => error[0].toUpperCase() + error.slice(1))
							.join(". ")
					: errorMessage[0].toUpperCase() + errorMessage.slice(1),
				error: exception.message,
			});
		}
	}
}
