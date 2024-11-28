import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokensRepository } from './refreshTokens.repository';
import {
  RefreshTokenEntity,
  RefreshTokenSchema,
} from './schemas/refreshToken.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshTokenEntity.name, schema: RefreshTokenSchema },
    ]),
  ],
  providers: [RefreshTokensRepository],
  exports: [RefreshTokensRepository],
})
export class RefreshTokensModule {}
