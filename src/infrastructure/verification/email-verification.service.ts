import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infrastructure/redis/redis.service';

@Injectable()
export class EmailVerificationService {
  private readonly codeExpiration = 60 * 10;

  constructor(private readonly redisService: RedisService) {}

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async saveCode(userId: number, code: string): Promise<void> {
    const key = `email-verification:${userId}`;

    await this.redisService.set(key, code, this.codeExpiration);
  }

  async getCode(userId: number): Promise<string | null> {
    const key = `email-verification:${userId}`;

    return this.redisService.get(key);
  }

  async deleteCode(userId: number): Promise<void> {
    const key = `email-verification:${userId}`;

    await this.redisService.delete(key);
  }
}
