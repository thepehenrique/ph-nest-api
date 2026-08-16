import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './features/users/users.module';
import { RolesModule } from './features/roles/roles.module';
import { AuthModule } from './features/auth/auth.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { RateLimitModule } from './infrastructure/rate-limit/rate-limit.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { EmailModule } from './infrastructure/queue/email/email.module';
import { ChatModule } from './features/chat/chat.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    AuthModule,
    CacheModule,
    RateLimitModule,
    QueueModule,
    EmailModule,
    ChatModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_SUPABASE,

      ssl: {
        rejectUnauthorized: false,
      },

      entities: [__dirname + '/**/*.entity{.ts,.js}'],

      synchronize: true,

      autoLoadEntities: false,

      logging: process.env.NODE_ENV === 'development',
    }),
  ],
})
export class AppModule {}
