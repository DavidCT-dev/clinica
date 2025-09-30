import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { AssignPermissionsDto, CreateRoleDto } from './dto/create-role.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('api/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  @ApiResponse({
    status: 409,
    description: 'Role name already exists'
  })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of all roles'
  })
  async findAll() {
    return this.roleService.findAll();
  }

  @ApiBearerAuth()
  @Post(':roleId/permissions')
  @ApiOperation({ summary: 'Assign permissions to a role (replaces existing)' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({
    status: 201,
    description: 'Permissions assigned successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Role or permission not found'
  })
  async assignPermissions(
    @Param('roleId') roleId: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.roleService.assignPermissions(roleId, assignPermissionsDto);
  }
}
