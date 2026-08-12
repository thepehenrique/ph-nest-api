import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

import { RedisService } from 'src/infrastructure/redis/redis.service';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly redisService: RedisService) {}

  generate(): string {
    return randomBytes(64).toString('hex');
  }

  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async store(userId: number, token: string): Promise<void> {
    const tokenHash = this.hash(token);

    const key = `refresh-token:${tokenHash}`;

    const ttl = Number.parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_IN ?? '604800',
      10,
    );

    await this.redisService.set(key, String(userId), ttl);
  }

  async getUserId(token: string): Promise<number | null> {
    const tokenHash = this.hash(token);

    const key = `refresh-token:${tokenHash}`;

    const userId = await this.redisService.get(key);

    if (!userId) {
      return null;
    }

    return Number.parseInt(userId, 10);
  }

  async revoke(token: string): Promise<void> {
    const tokenHash = this.hash(token);

    const key = `refresh-token:${tokenHash}`;

    await this.redisService.delete(key);
  }
}
