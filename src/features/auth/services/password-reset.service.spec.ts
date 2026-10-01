import type { RedisService } from '../../../infrastructure/redis/redis.service';
import { PasswordResetService } from './password-reset.service';

describe('PasswordResetService', () => {
  it('generates a six-digit code using the secure generator', () => {
    const service = new PasswordResetService({} as RedisService);

    for (let attempt = 0; attempt < 100; attempt += 1) {
      expect(service.generateCode()).toMatch(/^\d{6}$/);
    }
  });
});
