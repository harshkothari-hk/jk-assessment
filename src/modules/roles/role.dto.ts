import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class RoleDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  level: string;
}

export class RoleFilterDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}
