import { validateEnvironment } from './environment.config';

describe('validateEnvironment', () => {
  const validEnvironment = {
    DATABASE_SUPABASE: 'postgresql://user:password@localhost:5432/database',
    JWT_SECRET: 'test-secret',
    JWT_EXPIRES_IN: '15m',
    SMTP_HOST: 'smtp.example.com',
    SMTP_USER: 'user',
    SMTP_PASSWORD: 'password',
    SMTP_FROM: 'noreply@example.com',
  };

  it('normalizes defaults and numeric values', () => {
    const environment = validateEnvironment({
      ...validEnvironment,
      APP_PORT: '4000',
      DATABASE_SYNCHRONIZE: 'true',
    });

    expect(environment).toMatchObject({
      APP_PORT: 4000,
      NODE_ENV: 'development',
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      DATABASE_SSL: true,
      DATABASE_SYNCHRONIZE: true,
      SMTP_SECURE: false,
    });
  });

  it('reports all missing required variables', () => {
    expect(() => validateEnvironment({})).toThrow(
      /DATABASE_SUPABASE[\s\S]*JWT_SECRET[\s\S]*SMTP_HOST/,
    );
  });

  it('rejects invalid ports and booleans', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        REDIS_PORT: 'invalid',
        SMTP_SECURE: 'yes',
      }),
    ).toThrow(/REDIS_PORT[\s\S]*SMTP_SECURE/);
  });
});
