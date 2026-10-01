import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RateLimitGuard } from './rate-limit.guard';
import { RateLimitService } from './rate-limit.service';

describe('RateLimitGuard', () => {
  const request = {
    ip: '127.0.0.1',
    method: 'POST',
    path: '/auth/login',
  };

  const context = {
    getHandler: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;

  const reflector = {
    get: jest.fn(),
  };

  const rateLimitService = {
    increment: jest.fn(),
  };

  const guard = new RateLimitGuard(
    rateLimitService as unknown as RateLimitService,
    reflector as unknown as Reflector,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows routes without rate-limit metadata', async () => {
    reflector.get.mockReturnValue(undefined);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(rateLimitService.increment).not.toHaveBeenCalled();
  });

  it('returns HTTP 429 after the configured limit', async () => {
    reflector.get.mockReturnValue({ limit: 1, ttl: 60 });
    rateLimitService.increment.mockResolvedValue(2);

    try {
      await guard.canActivate(context);
      throw new Error('RateLimitGuard should have rejected the request.');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  });
});
