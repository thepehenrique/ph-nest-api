import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infrastructure/redis/redis.service';

@Injectable()
export class RateLimitService {
  constructor(private readonly redisService: RedisService) {}

  async increment(key: string, ttl: number): Promise<number> {
    return this.redisService.incrementWithExpiration(key, ttl);
  }
}
