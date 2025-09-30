import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AssignPermissionsDto, CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './entities/role.schema';
import { Model } from 'mongoose';
import { RolePermission, RolePermissionDocument } from './entities/role-permission.schema';
import { Permission, PermissionDocument } from 'src/permission/entities/permission.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RolePermission.name) private readonly rolePermissionModel: Model<RolePermissionDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
  ) {}
  
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const existingRole = await this.roleModel.findOne({
        name: createRoleDto.name
      });

      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }

      const newRole = new this.roleModel(createRoleDto);
      return await newRole.save();

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Invalid role data');
      }

      throw new BadRequestException('Error creating role');
    }
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }


  async assignPermissions(roleId: string, assignPermissionsDto: AssignPermissionsDto): Promise<RolePermission[]> {
  // Verify role exists
  const role = await this.roleModel.findById(roleId);
  if (!role) {
    throw new NotFoundException('Role not found');
  }

  // Verify all permissions exist
  const permissions = await this.permissionModel.find({
    _id: { $in: assignPermissionsDto.permission_ids }
  });

  if (permissions.length !== assignPermissionsDto.permission_ids.length) {
    throw new NotFoundException('One or more permissions not found');
  }

  // Remove existing permissions for this role
  await this.rolePermissionModel.deleteMany({ 
    role_id:roleId
  });

  // Create new role-permission assignments with ObjectId
  const rolePermissions = assignPermissionsDto.permission_ids.map(permissionId => ({
    role_id: roleId,
    permission_id: permissionId,
  }));

  const result = await this.rolePermissionModel.insertMany(rolePermissions);
  
  // Convertir el resultado al tipo correcto
  return result as unknown as RolePermission[];
}
}
