import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '../../common/dto/success-response.dto';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { DocumentService } from './document.service';
import { DocumentDTO } from './document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user';
import { TokenDTO } from 'src/common/dto';
import { RolePermissionService } from '../role-permission/rolePermission.service';
import { Permission, ServiceType } from 'src/common/constants';

@ApiTags('documents')
@UseGuards(AuthGuard())
@Controller('documents')
export class DocumentController {
  constructor(
    private documentService: DocumentService,
    // private rolePermissionService: RolePermissionService
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Add document' })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  public async addDocument(@Body() payload: DocumentDTO, @UploadedFile() file: any, @CurrentUser() user: TokenDTO) {
    // await this.rolePermissionService.verifyAccess(user, ServiceType.DOCUMENT_MANAGEMENT, Permission.WRITE)
    const response = await this.documentService.addDocument(file, payload);
    return new SuccessResponse(response);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete document' })
  public async deleteDocument(@Param('id') id: string, @CurrentUser() user: TokenDTO) {
    // await this.rolePermissionService.verifyAccess(user, ServiceType.DOCUMENT_MANAGEMENT, Permission.DELETE)
    const response = await this.documentService.deleteDocument(id);
    return new SuccessResponse("Document deleted successfully!");
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all documents' })
  public async getAllDocument(@Query() data, @CurrentUser() user: TokenDTO) {
    // await this.rolePermissionService.verifyAccess(user, ServiceType.DOCUMENT_MANAGEMENT, Permission.READ)
    const response = await this.documentService.getAllDocuments(data);
    return new SuccessResponse(response);
  }
}
