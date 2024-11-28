import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/dto';
import { LoginUserDTO, UpdateUserDTO, UserDTO } from './user.dto';
import { UsersService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/')
  public async createUser(@Body() payload: UserDTO) {
    const response = await this.userService.createUser(payload);
    return new SuccessResponse(response);
  }

  @Put('/:id')
  public async updateUser(@Body() payload: UpdateUserDTO, @Param('id') id: string) {
    const response = await this.userService.updateUser(id, payload);
    return new SuccessResponse(response);
  }

  @Get('/')
  public async getAllUser(@Query() data) {
    const response = await this.userService.getAllUsers(data);
    return new SuccessResponse(response);
  }

  @Get('/:id')
  public async getUser(@Param('id') id: string) {
    const response = await this.userService.getUserById(id);
    return new SuccessResponse(response);
  }

  @Post('/login')
  public async loginUser(@Body() payload: LoginUserDTO) {
    const response = await this.userService.loginUser(payload);
    return new SuccessResponse(response);
  }

  @Put('/change-password/:id')
  public async changePassword(@Param('id') id: string, @Body() payload) {
    const response = await this.userService.changePassword(id, payload);
    return new SuccessResponse(response);
  }
}
