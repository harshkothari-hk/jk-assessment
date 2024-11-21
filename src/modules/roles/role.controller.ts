import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from './role.service';
import { SuccessResponse } from 'src/common/dto';
import { RoleDTO } from './role.dto';

@ApiTags('roles')
// @UseGuards(AuthGuard()) //todo
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {
    // super();
}

  @Post('/')
  public async createRole(@Body() payload: RoleDTO) {
    const response = await this.rolesService.createRole(payload)
    return new SuccessResponse(response);
  }
}
