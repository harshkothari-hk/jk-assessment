import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from 'src/common/dto';
import { BaseService } from 'src/common/service';
import { RequestQuery } from 'src/common/dto/base-service.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { RolePermission } from './rolePermission.entity';
import { RolePermissionDTO, RolePermissionFilterDTO } from './rolePermission.dto';
import { Roles } from '../roles/role.entity';

@Injectable()
export class RolePermissionService extends BaseService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
    @InjectRepository(Roles)
    private readonly roleRepo: Repository<Roles>
  ) {
    super();
  }

  public async addRolePermission(payload: RolePermissionDTO) {

    const role = await this.roleRepo.findOne({ where: { id: payload.role } });
    if (!role)
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Invalid role provided');

    const rolePermission = await this.rolePermissionRepo.find({ where: { serviceType: payload.serviceType, role: payload.role } });
    if (rolePermission)
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Permission of this service type against this role already exist');

    const roleResponse = await this.rolePermissionRepo.save(payload);
    return roleResponse;
  }

  public async getAllRolePermission(roleId: string) {
    if (!roleId)
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'RoleId required');

    return this.rolePermissionRepo.find({ relations: ['role']})
  }
}
