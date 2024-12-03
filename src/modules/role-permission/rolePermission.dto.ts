import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RolePermissionDTO {
  @ApiProperty()
  canRead: boolean;

  @ApiProperty()
  canWrite: boolean;

  @ApiProperty()
  canUpdate: boolean;

  @ApiProperty()
  canDelete: boolean;

  @ApiProperty()
  serviceType: string;

  @ApiProperty()
  role: string;
}

export class RolePermissionFilterDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  roleName: string;
}