import type { RedisService } from '../redis/redis.service';
import { EmailVerificationService } from './email-verification.service';

describe('EmailVerificationService', () => {
  it('generates a six-digit code using the secure generator', () => {
    const service = new EmailVerificationService({} as RedisService);

    for (let attempt = 0; attempt < 100; attempt += 1) {
      expect(service.generateCode()).toMatch(/^\d{6}$/);
    }
  });
});
