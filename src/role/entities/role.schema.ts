import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
   @Prop({
    type: String,
    default: () => randomUUID(), 
  })
  _id: string;
  
  @Prop({ required: true, unique: true, trim:true })
  name: string;

  @Prop({trim:true})
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
