import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission, PermissionDocument } from './entities/permission.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PermissionService {
  constructor(
      @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
    ) { }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    try {
      // Check if permission with same name already exists
      const existingPermission = await this.permissionModel.findOne({
        name: createPermissionDto.name.trim()
      });

      if (existingPermission) {
        throw new ConflictException('Permission with this name already exists');
      }

      // Create new permission
      const newPermission = new this.permissionModel({
        name: createPermissionDto.name.trim(),
        description: createPermissionDto.description?.trim(),
      });

      return await newPermission.save();

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Invalid permission data');
      }

      throw new BadRequestException('Error creating permission');
    }
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.find().sort({ name: 1 }).exec();
  }

}
