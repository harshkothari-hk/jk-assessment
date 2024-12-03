import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/dto';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { DocumentService } from './document.service';
import { DocumentDTO } from './document.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('documents')
// @UseGuards(AuthGuard())
@Controller('documents')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  public async addDocument(@Body() payload: DocumentDTO, @UploadedFile() file: any) {
    try {
    const response = await this.documentService.addDocument(file, payload);
    return new SuccessResponse(response);
    } catch (error) {
      console.log(error)
    }
  }

  @Delete('/:id')
  public async deleteDocument(@Param('id') id: string) {
    try {
    const response = await this.documentService.deleteDocument(id);
    return new SuccessResponse("Document deleted successfully!");
    } catch (error) {
      console.log(error)
    }
  }

  @Get('/')
  public async getAllDocument(@Query() data) {
    const response = await this.documentService.getAllDocuments(data);
    return new SuccessResponse(response);
  }
}
