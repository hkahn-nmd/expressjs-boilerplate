import { RefreshTokenEntity } from './schemas/refreshToken.schema';
import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@/core/repository/entity.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RefreshTokensRepository extends EntityRepository<RefreshTokenEntity> {
  constructor(
    @InjectModel(RefreshTokenEntity.name)
    refreshTokenModel: Model<RefreshTokenEntity>,
  ) {
    super(refreshTokenModel);
  }
}
