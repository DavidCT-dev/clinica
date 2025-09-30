import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, MinLength, Matches } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Permission name (should be in format: resource:action)',
    example: 'user:create',
    required: true
  })
  @IsNotEmpty({ message: 'Permission name is required' })
  @IsString({ message: 'Permission name must be a string' })
  @MinLength(3, { message: 'Permission name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Permission name cannot be longer than 50 characters' })
  @Matches(/^[a-zA-Z]+:[a-zA-Z]+$/, { 
    message: 'Permission name should be in format: resource:action (e.g., user:create, patient:read)' 
  })
  name: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Allows creating new users',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(255, { message: 'Description cannot be longer than 255 characters' })
  description?: string;
}