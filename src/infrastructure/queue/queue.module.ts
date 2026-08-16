import { Global, Module } from '@nestjs/common';

import { EmailQueue } from './email.queue';
import { EmailWorker } from './email/email.worker';

@Global()
@Module({
  providers: [EmailQueue, EmailWorker],
  exports: [EmailQueue],
})
export class QueueModule {}
