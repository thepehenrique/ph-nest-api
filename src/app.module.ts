import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './features/users/users.module';
import { RolesModule } from './features/roles/roles.module';
import { AuthModule } from './features/auth/auth.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { RateLimitModule } from './infrastructure/rate-limit/rate-limit.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { EmailModule } from './infrastructure/queue/email/email.module';
import { ChatModule } from './features/chat/chat.module';
import { validateEnvironment } from './config/environment.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnvironment,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDevelopment =
          configService.getOrThrow<string>('NODE_ENV') === 'development';
        const useSsl = configService.getOrThrow<boolean>('DATABASE_SSL');

        return {
          type: 'postgres' as const,
          url: configService.getOrThrow<string>('DATABASE_SUPABASE'),
          ssl: useSsl ? { rejectUnauthorized: false } : false,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize:
            isDevelopment &&
            configService.getOrThrow<boolean>('DATABASE_SYNCHRONIZE'),
          autoLoadEntities: false,
          logging: isDevelopment,
        };
      },
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    CacheModule,
    RateLimitModule,
    QueueModule,
    EmailModule,
    ChatModule,
  ],
})
export class AppModule {}
