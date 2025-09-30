import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './entities/role.schema';
import { RolePermission, RolePermissionSchema } from './entities/role-permission.schema';
import { Permission, PermissionSchema } from 'src/permission/entities/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule { }
