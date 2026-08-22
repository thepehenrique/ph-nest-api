import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class EmailQueue {
  private readonly queue: Queue;

  constructor() {
    this.queue = new Queue('email', {
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number.parseInt(process.env.REDIS_PORT ?? '6379', 10),
      },
    });
  }

  async addWelcomeEmail(userId: number, email: string): Promise<void> {
    await this.queue.add(
      'send-welcome-email',
      {
        userId,
        email,
      },
      {
        jobId: `welcome-email-${userId}`,

        attempts: 3,

        backoff: {
          type: 'exponential',
          delay: 5000,
        },

        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }

  async addVerificationEmail(
    userId: number,
    email: string,
    code: string,
  ): Promise<void> {
    await this.queue.add(
      'send-verification-email',
      {
        userId,
        email,
        code,
      },
      {
        jobId: `verification-email-${userId}`,

        attempts: 3,

        backoff: {
          type: 'exponential',
          delay: 5000,
        },

        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }

  async addPasswordResetEmail(
    userId: number,
    email: string,
    resetCode: string,
  ): Promise<void> {
    await this.queue.add(
      'send-password-reset-email',
      {
        userId,
        email,
        code: resetCode,
      },
      {
        jobId: `password-reset-email-${userId}-${Date.now()}`,

        attempts: 3,

        backoff: {
          type: 'exponential',
          delay: 5000,
        },

        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}
