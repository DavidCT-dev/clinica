// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginToken, LoginTokenSchema } from './entities/login-token.schema';
import { User, UserSchema } from 'src/user/entities/user.schema';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoginToken.name, schema: LoginTokenSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule { }