import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, MinLength, IsArray, ArrayMinSize } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'admin',
    required: true
  })
  @IsNotEmpty({ message: 'Role name is required' })
  @IsString({ message: 'Role name must be a string' })
  @MinLength(2, { message: 'Role name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Role name cannot be longer than 50 characters' })
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'admin with full access',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(255, { message: 'Description cannot be longer than 255 characters' })
  description?: string;
}

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'Array of permission IDs to assign to the role',
    example: ['perm-123', 'perm-456', 'perm-789'],
    type: [String],
    required: true
  })
  @IsArray({ message: 'Permissions must be an array' })
  @ArrayMinSize(1, { message: 'At least one permission is required' })
  @IsString({ each: true, message: 'Each permission ID must be a string' })
  permission_ids: string[];
}

export class RolePermissionResponseDto {
  @ApiProperty({ description: 'Role permission ID' })
  id: string;

  @ApiProperty({ description: 'Role ID' })
  role_id: string;

  @ApiProperty({ description: 'Permission ID' })
  permission_id: string;

}