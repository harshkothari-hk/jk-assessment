import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './role.controller';
import { RolesService } from './role.service';
import { RoleDTO } from './role.dto';
import { Repository } from 'typeorm';
import { Roles } from './role.entity';
import { RolePermission } from '../role-permission/rolePermission.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from 'src/common/dto';

describe('Roles Module', () => {
  let controller: RolesController;
  let service: RolesService;
  let roleRepo: Repository<Roles>;
  let rolePermissionRepo: Repository<RolePermission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Roles),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(RolePermission),
          useClass: Repository,
        },
        {
          provide: RolesService,
          useValue: {
            createRole: jest.fn(),
            updateRole: jest.fn(),
            getRoleById: jest.fn(),
            getAllRoles: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
    roleRepo = module.get<Repository<Roles>>(getRepositoryToken(Roles));
    rolePermissionRepo = module.get<Repository<RolePermission>>(
      getRepositoryToken(RolePermission),
    );
  });

  // RolesController Tests
  describe('RolesController', () => {
    it('should call createRole service method and return the response', async () => {
      const payload: RoleDTO = { id: "1", code: 'admin', name: 'Admin', level: "ADMIN" };
      const response = { ...payload };
      const mockUser = { id: "1", firstName: "jane", lastName: "deo", role: {}}
      jest.spyOn(service, 'createRole').mockResolvedValue(response);

      const result = await controller.createRole(payload, mockUser);
      expect(result).toEqual({ success: true, data: response });
      expect(service.createRole).toHaveBeenCalledWith(payload);
    });

    it('should call updateRole service method and return the response', async () => {
      const id = '1';
      const payload: RoleDTO = {id: "1", code: 'admin', name: 'Updated Admin', level: "Admin" };
      const response: any = { affected: 1 };
      const mockUser = { id: "1", firstName: "jane", lastName: "deo", role: {}}

      jest.spyOn(service, 'updateRole').mockResolvedValue(response);

      const result = await controller.updateRole(payload, id, mockUser);
      expect(result).toEqual({ success: true, data: response });
      expect(service.updateRole).toHaveBeenCalledWith(id, payload);
    });

    it('should call getAllRoles service method and return the response', async () => {
      const response: any = { items: [], meta: {} };
      const mockUser = { id: "1", firstName: "jane", lastName: "deo", role: {}}

      jest.spyOn(service, 'getAllRoles').mockResolvedValue(response);

      const result = await controller.getAllRole({}, mockUser);
      expect(result).toEqual({ success: true, data: response });
      expect(service.getAllRoles).toHaveBeenCalledWith({});
    });

    it('should call getRoleById service method and return the response', async () => {
      const id = '1';
      const response: any = { id, name: 'Admin' };
      const mockUser = { id: "1", firstName: "jane", lastName: "deo", role: {}}

      jest.spyOn(service, 'getRoleById').mockResolvedValue(response);

      const result = await controller.getRoleById(id, mockUser);
      expect(result).toEqual({ success: true, data: response });
      expect(service.getRoleById).toHaveBeenCalledWith(id);
    });
  });

  // RolesService Tests
  describe('RolesService', () => {
    it('should create a role successfully', async () => {
      const payload = { code: 'admin', name: 'Admin' } as Roles;
      jest.spyOn(roleRepo, 'find').mockResolvedValue([]);
      jest.spyOn(roleRepo, 'save').mockResolvedValue(payload);
      jest.spyOn(rolePermissionRepo, 'save').mockResolvedValue(null);

      const result = await service.createRole(payload);
      expect(result).toEqual(payload);
      expect(roleRepo.find).toHaveBeenCalledWith({ where: { code: payload.code } });
    });

    it('should throw an error if role with same code exists', async () => {
      const payload = { code: 'admin', name: 'Admin' } as Roles;
      jest.spyOn(roleRepo, 'find').mockResolvedValue([payload]);

      await expect(service.createRole(payload)).rejects.toThrowError(
        'Role with this name already exist')
    });

    it('should update a role successfully', async () => {
      const id = '1';
      const payload = { name: 'Updated Role' } as Roles;
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue({ id, name: 'Old Role' } as Roles);
      jest.spyOn(roleRepo, 'update').mockResolvedValue({ affected: 1 } as any);

      const result = await service.updateRole(id, payload);
      expect(result).toEqual({ affected: 1 });
      expect(roleRepo.update).toHaveBeenCalledWith({ id }, { ...payload });
    });

    it('should throw an error if role id is invalid', async () => {
      const id = '1';
      const payload = { name: 'Updated Role' } as Roles;
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);

      await expect(service.updateRole(id, payload)).rejects.toThrowError(
        'Invalid role id'
      );
    });
  });
});
