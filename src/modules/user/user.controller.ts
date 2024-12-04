import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse, TokenDTO } from 'src/common/dto';
import { LoginUserDTO, UpdateUserDTO, UserDTO } from './user.dto';
import { UsersService } from './user.service';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user';
import { RolePermissionService } from '../role-permission/rolePermission.service';
import { Permission, ServiceType } from 'src/common/constants';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private rolePermissionService: RolePermissionService
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create new user' })
  public async createUser(@Body() payload: UserDTO) {
    const response = await this.userService.createUser(payload);
    return new SuccessResponse(response);
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update user' })
  public async updateUser(@Body() payload: UpdateUserDTO, @Param('id') id: string, @CurrentUser() user: TokenDTO) {
    await this.rolePermissionService.verifyAccess(user, ServiceType.USER_MANAGEMENT, Permission.UPDATE)
    const response = await this.userService.updateUser(id, payload);
    return new SuccessResponse(response);
  }

  @Get('/')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get all users' })
  public async getAllUser(@Query() data, @CurrentUser() user: TokenDTO) {
    await this.rolePermissionService.verifyAccess(user, ServiceType.USER_MANAGEMENT, Permission.READ)
    const response = await this.userService.getAllUsers(data);
    return new SuccessResponse(response);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get user by id' })
  public async getUser(@Param('id') id: string, @CurrentUser() user: TokenDTO) {
    await this.rolePermissionService.verifyAccess(user, ServiceType.USER_MANAGEMENT, Permission.READ)
    const response = await this.userService.getUserById(id);
    return new SuccessResponse(response);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  public async loginUser(@Body() payload: LoginUserDTO,) {
    const response = await this.userService.loginUser(payload);
    return new SuccessResponse(response);
  }

  @Put('/change-password/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Change password' })
  public async changePassword(@Param('id') id: string, @Body() payload, @CurrentUser() user: TokenDTO) {
    await this.rolePermissionService.verifyAccess(user, ServiceType.USER_MANAGEMENT, Permission.UPDATE)
    const response = await this.userService.changePassword(id, payload);
    return new SuccessResponse(response);
  }
}
