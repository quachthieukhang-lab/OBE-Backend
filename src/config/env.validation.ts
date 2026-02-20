import { plainToInstance } from "class-transformer";
import { IsEnum, IsInt, IsString, validateSync } from "class-validator";

enum NodeEnv {
  development = "development",
  test = "test",
  production = "production",
}

class EnvVars {
  @IsEnum(NodeEnv)
  NODE_ENV!: NodeEnv;

  @IsInt()
  PORT!: number;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  REDIS_URL!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  JWT_EXPIRES_IN!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvVars, {
    ...config,
    PORT: Number(config.PORT),
  });

  const errors = validateSync(validated, { whitelist: true });
  if (errors.length) {
    throw new Error(
      `ENV validation error: ${errors
        .map((e) => JSON.stringify(e.constraints))
        .join(", ")}`
    );
  }
  return validated;
}