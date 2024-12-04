import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from '../roles/role.entity';
import { RolePermission } from './rolePermission.entity';
import { RolePermissionController } from './rolePermission.controller';
import { RolePermissionService } from './rolePermission.service';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission, Roles])],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
})
export class RolePermissionModule {}
