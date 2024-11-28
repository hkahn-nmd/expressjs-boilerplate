import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@/core/repository/entity.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from './schemas/user.schema';

@Injectable()
export class UsersRepository extends EntityRepository<UserEntity> {
  constructor(@InjectModel(UserEntity.name) userModel: Model<UserEntity>) {
    super(userModel);
  }
}
