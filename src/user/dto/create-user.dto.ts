import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  RECEPTION = 'reception',
  NURSE = 'nurse'
}

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
    required: true
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+?[\d\s\-\(\)]+$/, { 
    message: 'Phone number format is not valid' 
  })
  phone: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
    required: false,
    minLength: 6
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.PATIENT,
    required: true
  })
  @IsEnum(UserRole, { message: 'Role must be one of: admin, patient, doctor, reception, nurse' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;
}