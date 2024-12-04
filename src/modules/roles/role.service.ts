import { HttpStatus, Injectable } from '@nestjs/common';
import { Roles } from './role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from '../../common/dto';
import { BaseService } from '../../common/service';
import { RequestQuery } from 'src/common/dto/base-service.dto';
import { RoleFilterDTO } from './role.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { RolePermission } from '../role-permission/rolePermission.entity';
import { ServiceTypeCode } from 'src/common/constants';

@Injectable()
export class RolesService extends BaseService {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepo: Repository<Roles>,

    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
  ) {
    super();
  }

  public async createRole(payload: Roles) {
    const getRole = await this.roleRepo.find({ where: { code: payload.code } });
    if (getRole.length > 0)
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Role with this name already exist');

    const roleResponse = await this.roleRepo.save(payload);
    await Promise.all(
      ServiceTypeCode.map(async (service) => {
        const permissionPayload = {
          serviceType: service,
          roleId: roleResponse.id,
          canRead: false,
          canWrite: false,
          canUpdate: false,
          canDelete: false,
        };
        await this.rolePermissionRepo.save(permissionPayload);
      })
    )
    return roleResponse;
  }

  public async updateRole(id: string, payload: Roles) {
    const getRole = await this.roleRepo.findOne({ where: { id: id } });

    if (!getRole)
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Invalid role id');

    const roleResponse = await this.roleRepo.update(
      {
        id: id,
      },
      {
        ...payload,
      },
    );
    return roleResponse;
  }

  public async getRoleById(id: string) {
    return this.roleRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  public async getAllRoles(query: RequestQuery<RoleFilterDTO>) {
    const { filter, pagination, sort } = this.getQuery(query);
    const rolesQB = this.roleRepo
      .createQueryBuilder('roles')
      .select('roles.id')
      .addSelect('roles.name');

    if (filter.name) {
      rolesQB.andWhere('roles.name ILIKE :name', {
        name: `%${filter.name}%`,
      });
    }

    if (sort.name) {
      rolesQB.orderBy('roles.name', sort.name.toUpperCase());
    }

    return paginate(rolesQB, pagination);
  }
}
