import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './features/users/users.module';
import { RolesModule } from './features/roles/roles.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
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
