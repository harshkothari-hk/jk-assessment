import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/dto';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { RolePermissionService } from './rolePermission.service';
import { RolePermissionDTO } from './rolePermission.dto';

@ApiTags('role-permission')
// @UseGuards(AuthGuard())
@Controller('role-permission')
export class RolePermissionController {
  constructor(private rolePermissionService: RolePermissionService) { }
  
  @Post('/')
  public async createRole(@Body() payload: RolePermissionDTO) {
    const response = await this.rolePermissionService.addRolePermission(payload);
    return new SuccessResponse(response);
  }

  @Get('/:roleId')
  public async getRolePermission(@Param('roleId') roleId: string) {
    const response = await this.rolePermissionService.getAllRolePermission(roleId);
    return new SuccessResponse(response);
  }
}
