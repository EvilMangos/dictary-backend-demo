import * as process from "process";

function envFullPath(env: string): string {
	return "src/config/environments/" + env;
}

export const getEnvConfig = (): string[] => {
	const env = process.env.NODE_ENV;

	const commonEnv = "common.env";
	let loadEnv: string[] = [".env"];
	switch (env) {
		case "local":
			loadEnv = ["local.env"];
			break;
		case "local-testing":
			loadEnv = ["local-testing.env"];
			break;
		case "testing":
			loadEnv = ["testing.env"];
			break;
		case "production":
			loadEnv = ["production.env"];
			break;
		case "local-docker":
			loadEnv = ["local.env", "docker.env"];
			break;
	}

	return [envFullPath(commonEnv), ...loadEnv.map((env) => envFullPath(env))];
};
