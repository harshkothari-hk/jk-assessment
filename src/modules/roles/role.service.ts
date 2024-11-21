import { Injectable } from '@nestjs/common';
import { Roles } from './role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepo: Repository<Roles>
  ) {}

  public async createRole(payload: Roles) {
    const roleResponse = await this.roleRepo.save(payload);
    return roleResponse;
  }
}
