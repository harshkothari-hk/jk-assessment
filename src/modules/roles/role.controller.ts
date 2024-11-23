import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from './role.service';
import { SuccessResponse } from 'src/common/dto';
import { RoleDTO } from './role.dto';

@ApiTags('roles')
// @UseGuards(AuthGuard()) //todo
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) { }

  @Post('/')
  public async createRole(@Body() payload: RoleDTO) {
    const response = await this.rolesService.createRole(payload);
    return new SuccessResponse(response);
  }

  @Put('/:id')
  public async updateRole(@Body() payload: RoleDTO, @Param('id') id: string) {
    const response = await this.rolesService.updateRole(id, payload);
    return new SuccessResponse(response);
  }

  @Get('/')
  public async getAllRole(@Query() data) {
    const response = await this.rolesService.getAllRoles(data);
    return new SuccessResponse(response);
  }

  @Get('/:id')
  public async getRoleById(@Param('id') id: string) {
    const response = await this.rolesService.getRoleById(id);
    return new SuccessResponse(response);
  }
}
