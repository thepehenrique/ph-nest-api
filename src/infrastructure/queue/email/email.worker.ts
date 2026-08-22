import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Job, Worker } from 'bullmq';

import { EmailService } from '../email/email.service';

interface EmailJob {
  userId: number;
  email: string;
  code?: string;
}

@Injectable()
export class EmailWorker implements OnModuleInit, OnModuleDestroy {
  private worker!: Worker<EmailJob>;

  constructor(private readonly emailService: EmailService) {}

  onModuleInit(): void {
    this.worker = new Worker<EmailJob>(
      'email',
      async (job: Job<EmailJob>) => {
        if (job.name === 'send-welcome-email') {
          await this.emailService.sendWelcomeEmail(job.data.email);

          return;
        }

        if (job.name === 'send-verification-email') {
          if (!job.data.code) {
            throw new Error('Código de verificação não informado.');
          }

          await this.emailService.sendVerificationEmail(
            job.data.email,
            job.data.code,
          );
        }

        if (job.name === 'send-password-reset-email') {
          if (!job.data.code) {
            throw new Error('Código de recuperação não informado.');
          }

          await this.emailService.sendPasswordResetEmail(
            job.data.email,
            job.data.code,
          );
        }
      },
      {
        connection: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: Number.parseInt(process.env.REDIS_PORT ?? '6379', 10),
        },
      },
    );

    this.worker.on('active', (job) => {
      console.log(`[EmailWorker] Processando Job: ${job.id}`);
    });

    this.worker.on('completed', (job) => {
      console.log(`[EmailWorker] Job concluído: ${job.id}`);
    });

    this.worker.on('failed', (job, error) => {
      console.error(`[EmailWorker] Job falhou: ${job?.id}`, error.message);
    });

    this.worker.on('error', (error) => {
      console.error('[EmailWorker] Erro no Worker:', error.message);
    });

    console.log('Email Worker iniciado.');
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker.close();
  }
}
