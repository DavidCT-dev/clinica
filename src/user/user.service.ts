import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  @InjectModel(User.name) private readonly userModel: Model<UserDocument>

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userModel.findOne({
        $or: [
          { email: createUserDto.email },
          { phone: createUserDto.phone }
        ]
      });

      if (existingUser) {
        if (existingUser.email === createUserDto.email) {
          throw new ConflictException('Email already exists');
        }
        if (existingUser.phone === createUserDto.phone) {
          throw new ConflictException('Phone number already exists');
        }
      }

      const userData: any = {
        email: createUserDto.email,
        phone: createUserDto.phone,
        role: createUserDto.role,
      };

      if (createUserDto.password) {
        userData.password_hash = createUserDto.password;
      }

      const newUser = new this.userModel(userData);
      const savedUser = await newUser.save();

      const userObject = savedUser.toObject();
      delete userObject.password_hash;

      return userObject;

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException('Invalid user data');
      }

      throw new InternalServerErrorException('Error creating user');
    }
  }
}
