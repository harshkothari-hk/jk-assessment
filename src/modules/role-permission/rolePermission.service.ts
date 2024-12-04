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
import { Permission } from 'src/common/constants';

@Injectable()
export class RolePermissionService extends BaseService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
    @InjectRepository(Roles)
    private readonly roleRepo: Repository<Roles>,
  ) {
    super();
  }

  public async addRolePermission(payload: RolePermissionDTO) {
    const role = await this.roleRepo.findOne({ where: { id: payload.roleId } });
    if (!role)
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Invalid role provided');

    const rolePermission = await this.rolePermissionRepo.find({
      where: { serviceType: payload.serviceType, roleId: payload.roleId },
    });
    if (rolePermission.length > 0)
      throw new ErrorResponse(
        HttpStatus.BAD_REQUEST,
        'Permission of this service type against this role already exist',
      );

    const roleResponse = await this.rolePermissionRepo.save(payload);
    return roleResponse;
  }

  public async getAllRolePermission(roleId: string) {
    if (!roleId)
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'RoleId required');

    return this.rolePermissionRepo.find({ relations: ['role'] });
  }

  public async verifyAccess(user, serviceType: string, accessType) {
    const query = { roleId: user.role.id, serviceType };

    const roleResponse = await this.rolePermissionRepo.findOne({
      where: { ...query },
    });
    const invalidAccess = () => this.throwException(serviceType, accessType);
    if (!roleResponse) invalidAccess();

    const invalidGranted = (accessType: string, getPermission: any) =>
      (accessType == Permission.READ && !getPermission?.canRead) ||
      (accessType == Permission.WRITE && !getPermission?.canWrite) ||
      (accessType == Permission.UPDATE && !getPermission?.canUpdate) ||
      (accessType == Permission.DELETE && !getPermission?.canDelete);
    if (invalidGranted(accessType, roleResponse)) invalidAccess();

    return roleResponse;
  }

  private throwException(serviceType: string, accessType: string) {
    let message = `AccessDenied: Not granted ${accessType.toUpperCase()} permission for service ${serviceType}`;
    throw new ErrorResponse(HttpStatus.BAD_REQUEST, message);
  }
}
