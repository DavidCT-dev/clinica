import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document, Types } from 'mongoose';

export type LoginTokenDocument = LoginToken & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class LoginToken {
  @Prop({
      type: String,
      default: () => randomUUID(), 
    })
    _id: string;
  

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true, length: 6 })
  code: string;

  @Prop({ required: true })
  expires_at: Date;

  @Prop({ default: false })
  used: boolean;
}

export const LoginTokenSchema = SchemaFactory.createForClass(LoginToken);
