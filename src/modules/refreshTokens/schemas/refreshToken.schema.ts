import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  collection: 'refreshTokens',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class RefreshTokenEntity extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: string | mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, unique: true, required: true })
  tokenId: string | mongoose.Types.ObjectId;

  @Prop()
  hashedRefreshToken: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenEntity);

RefreshTokenSchema.index({ hashedRefreshToken: 1, expiresAt: 1 });
