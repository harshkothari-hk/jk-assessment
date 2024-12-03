import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DocumentDTO {
  @ApiProperty()
  user: string;

  @ApiProperty()
  documentName: string;
}

export class DocumentFilterDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  documentName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userId: string;
}