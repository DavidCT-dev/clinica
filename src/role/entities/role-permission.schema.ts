import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document, Types } from 'mongoose';

export type RolePermissionDocument = RolePermission & Document;

@Schema()
export class RolePermission {
   @Prop({
    type: String,
    default: () => randomUUID(), 
  })
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  role_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Permission', required: true })
  permission_id: Types.ObjectId;
}

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermission);
