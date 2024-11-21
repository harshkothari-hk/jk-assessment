import { ApiProperty } from '@nestjs/swagger';

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
