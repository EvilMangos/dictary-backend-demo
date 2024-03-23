import dotenv from "dotenv";
import { getEnvConfig } from "../src/config/env_config";

const loadEnv = () => {
	const envs = getEnvConfig();

	envs.forEach((env) => {
		dotenv.config({ path: env });
	});
};

loadEnv();
