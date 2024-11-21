import { Module } from '@nestjs/common';
import { RolesController } from './role.controller';
import { RolesService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RoleModule {}
