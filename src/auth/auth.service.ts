import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto, LoginResponseDto } from './dto/login-auth.dto';
import { User, UserDocument } from '../user/entities/user.schema';
import { LoginToken, LoginTokenDocument } from './entities/login-token.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(LoginToken.name) private readonly loginTokenModel: Model<LoginTokenDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async login(loginAuthDto: LoginAuthDto): Promise<LoginResponseDto> {
    const { email, password } = loginAuthDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password_hash) {
      throw new BadRequestException('User does not have a password set');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const verificationCode = this.generateVerificationCode();
    const expiresIn = this.configService.get<string>('config.jwt.expiresIn') || '15m';
    const expiresAt = new Date(Date.now() + this.parseJwtExpiresIn(expiresIn));
    
    const loginToken = new this.loginTokenModel({
      user_id: user._id,
      code: verificationCode,
      expires_at: expiresAt,
      used: false,
    });

    await loginToken.save();

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      temp: true,
      loginTokenId: loginToken._id,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      expires_in: '15m',
      token_type: 'Bearer',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }


  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private parseJwtExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 's': return value * 1000; 
      case 'm': return value * 60 * 1000; 
      case 'h': return value * 60 * 60 * 1000; 
      case 'd': return value * 24 * 60 * 60 * 1000; 
      default: return 15 * 60 * 1000; 
    }
  }


}