import { Module } from '@nestjs/common';
import { RolesController } from './role.controller';
import { RolesService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './role.entity';
import { RolePermission } from '../role-permission/rolePermission.entity';
import { RolePermissionService } from '../role-permission/rolePermission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, RolePermission])],
  controllers: [RolesController],
  providers: [RolesService, RolePermissionService],
})
export class RoleModule {}
