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
}
