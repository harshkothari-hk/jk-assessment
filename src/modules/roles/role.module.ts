import { Module } from '@nestjs/common';
import { RolesController } from './role.controller';
import { RolesService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './role.entity';
import { RolePermission } from '../role-permission/rolePermission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, RolePermission])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RoleModule {}
