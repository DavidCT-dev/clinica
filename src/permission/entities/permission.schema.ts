import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema()
export class Permission {
  @Prop({
    type: String,
    default: () => randomUUID(),
  })
  _id: string;

  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
