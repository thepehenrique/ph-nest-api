const VALID_NODE_ENVIRONMENTS = ['development', 'test', 'production'];

function requiredString(
  config: Record<string, unknown>,
  key: string,
  errors: string[],
): string {
  const value = config[key];

  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${key} is required`);
    return '';
  }

  return value.trim();
}

function optionalString(
  config: Record<string, unknown>,
  key: string,
  fallback: string,
  errors: string[],
): string {
  const value = config[key];

  if (value === undefined || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    errors.push(`${key} must be a string`);
    return fallback;
  }

  return value.trim();
}

function integer(
  config: Record<string, unknown>,
  key: string,
  fallback: number,
  errors: string[],
): number {
  const rawValue = config[key] ?? fallback;
  const value = Number(rawValue);

  if (!Number.isInteger(value) || value <= 0) {
    errors.push(`${key} must be a positive integer`);
    return fallback;
  }

  return value;
}

function boolean(
  config: Record<string, unknown>,
  key: string,
  fallback: boolean,
  errors: string[],
): boolean {
  const value = config[key];

  if (value === undefined || value === '') {
    return fallback;
  }

  if (value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  errors.push(`${key} must be true or false`);
  return fallback;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const errors: string[] = [];
  const nodeEnvironment = optionalString(
    config,
    'NODE_ENV',
    'development',
    errors,
  );

  if (!VALID_NODE_ENVIRONMENTS.includes(nodeEnvironment)) {
    errors.push(
      `NODE_ENV must be one of: ${VALID_NODE_ENVIRONMENTS.join(', ')}`,
    );
  }

  const validatedConfig = {
    ...config,
    NODE_ENV: nodeEnvironment,
    APP_PORT: integer(config, 'APP_PORT', 3000, errors),
    DATABASE_SUPABASE: requiredString(config, 'DATABASE_SUPABASE', errors),
    DATABASE_SSL: boolean(config, 'DATABASE_SSL', true, errors),
    DATABASE_SYNCHRONIZE: boolean(
      config,
      'DATABASE_SYNCHRONIZE',
      false,
      errors,
    ),
    JWT_SECRET: requiredString(config, 'JWT_SECRET', errors),
    JWT_EXPIRES_IN: requiredString(config, 'JWT_EXPIRES_IN', errors),
    REDIS_HOST: optionalString(config, 'REDIS_HOST', 'localhost', errors),
    REDIS_PORT: integer(config, 'REDIS_PORT', 6379, errors),
    REFRESH_TOKEN_EXPIRES_IN: integer(
      config,
      'REFRESH_TOKEN_EXPIRES_IN',
      604800,
      errors,
    ),
    SMTP_HOST: requiredString(config, 'SMTP_HOST', errors),
    SMTP_PORT: integer(config, 'SMTP_PORT', 587, errors),
    SMTP_SECURE: boolean(config, 'SMTP_SECURE', false, errors),
    SMTP_USER: requiredString(config, 'SMTP_USER', errors),
    SMTP_PASSWORD: requiredString(config, 'SMTP_PASSWORD', errors),
    SMTP_FROM: requiredString(config, 'SMTP_FROM', errors),
  };

  if (errors.length > 0) {
    throw new Error(
      `Invalid environment configuration:\n- ${errors.join('\n- ')}`,
    );
  }

  return validatedConfig;
}
