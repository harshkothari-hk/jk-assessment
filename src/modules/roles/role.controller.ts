import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesService } from './role.service';
import { RolePermissionService } from '../role-permission/rolePermission.service';
import { SuccessResponse, TokenDTO } from 'src/common/dto';
import { RoleDTO } from './role.dto';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user';
import { Permission, ServiceType } from 'src/common/constants';

@ApiTags('roles')
@UseGuards(AuthGuard())
@Controller('roles')
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private rolePermissionService: RolePermissionService,
  ) { }

  @Post('/')
  @ApiOperation({ summary: 'Create Role' })
  public async createRole(@Body() payload: RoleDTO, @CurrentUser() user: TokenDTO) {
    await this.rolePermissionService.verifyAccess(user, ServiceType.ROLE_PERMISSION_MANAGEMENT, Permission.WRITE)
    const response = await this.rolesService.createRole(payload);
    return new SuccessResponse(response);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update Role' })
  public async updateRole(@Body() payload: RoleDTO, @Param('id') id: string, @CurrentUser() user: TokenDTO) {
    await this.rolePermissionService.verifyAccess(user, ServiceType.ROLE_PERMISSION_MANAGEMENT, Permission.UPDATE)
    const response = await this.rolesService.updateRole(id, payload);
    return new SuccessResponse(response);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all role' })
  public async getAllRole(@Query() data, @CurrentUser() user: TokenDTO) {
    await this.rolePermissionService.verifyAccess(user, ServiceType.ROLE_PERMISSION_MANAGEMENT, Permission.READ)
    const response = await this.rolesService.getAllRoles(data);
    return new SuccessResponse(response);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get role by id' })
  public async getRoleById(@Param('id') id: string, @CurrentUser() user: TokenDTO) {
    await this.rolePermissionService.verifyAccess(user, ServiceType.ROLE_PERMISSION_MANAGEMENT, Permission.READ)
    const response = await this.rolesService.getRoleById(id);
    return new SuccessResponse(response);
  }
}
