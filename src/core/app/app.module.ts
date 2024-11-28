import { AuthModule } from './../../modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@/configs/config.module';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '@/modules/users/users.module';
import { RefreshTokensModule } from '@/modules/refreshTokens/refreshTokens.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    RefreshTokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
