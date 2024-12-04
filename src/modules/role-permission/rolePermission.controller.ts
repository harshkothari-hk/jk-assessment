import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse, TokenDTO } from 'src/common/dto';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { RolePermissionService } from './rolePermission.service';
import { RolePermissionDTO } from './rolePermission.dto';
import { CurrentUser } from 'src/common/decorators/current-user';
import { Permission, ServiceType } from 'src/common/constants';

@ApiTags('role-permission')
@UseGuards(AuthGuard())
@Controller('role-permission')
export class RolePermissionController {
  constructor(private rolePermissionService: RolePermissionService) { }
  
  @Post('/')
  @ApiOperation({ summary: 'Add Permission against role' })
  public async createRole(@Body() payload: RolePermissionDTO, @CurrentUser() user: TokenDTO) {
    await this.rolePermissionService.verifyAccess(user, ServiceType.ROLE_PERMISSION_MANAGEMENT, Permission.WRITE)
    const response = await this.rolePermissionService.addRolePermission(payload);
    return new SuccessResponse(response);
  }

  @Get('/:roleId')
  @ApiOperation({ summary: 'Get permissions against roleId' })
  public async getRolePermission(@Param('roleId') roleId: string, @CurrentUser() user: TokenDTO) {
    await this.rolePermissionService.verifyAccess(user, ServiceType.ROLE_PERMISSION_MANAGEMENT, Permission.READ)
    const response = await this.rolePermissionService.getAllRolePermission(roleId);
    return new SuccessResponse(response);
  }
}
