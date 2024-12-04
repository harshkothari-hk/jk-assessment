import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { Users } from './user.entity';
import { Roles } from '../roles/role.entity';
import { RolePermissionService } from '../role-permission/rolePermission.service';
import { RolePermission } from '../role-permission/rolePermission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles, RolePermission])],
  controllers: [UsersController],
  providers: [UsersService, RolePermissionService],
})
export class UserModule {}
