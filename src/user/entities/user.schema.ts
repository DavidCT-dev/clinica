import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
   @Prop({
    type: String,
    default: () => randomUUID(), 
  })
  _id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  password_hash?: string;

  @Prop({ enum: ['admin', 'patient', 'doctor', 'reception', 'nurse'], required: true })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password_hash') && this.password_hash) {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password_hash) return false;
  return bcrypt.compare(candidatePassword, this.password_hash);
};
