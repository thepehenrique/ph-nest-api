import { Injectable } from '@nestjs/common';

import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisService.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.redisService.set(key, JSON.stringify(value), ttl);
  }

  async delete(key: string): Promise<void> {
    await this.redisService.delete(key);
  }
}
