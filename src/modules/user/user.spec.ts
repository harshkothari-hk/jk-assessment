import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { SuccessResponse } from 'src/common/dto';
import { ErrorResponse } from 'src/common/dto';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { Roles } from '../roles/role.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            updateUser: jest.fn(),
            getAllUsers: jest.fn(),
            getUserById: jest.fn(),
            loginUser: jest.fn(),
            changePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a new user and return success response', async () => {
      const mockPayload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'role-id',
        contactNumber: "222222222"
      };
      const mockResponse: any = { id: 'user-id', ...mockPayload };
      jest.spyOn(usersService, 'createUser').mockResolvedValue(mockResponse);

      const result = await usersController.createUser(mockPayload);
      expect(result).toEqual(new SuccessResponse(mockResponse));
      expect(usersService.createUser).toHaveBeenCalledWith(mockPayload);
    });
  });

  describe('updateUser', () => {
    it('should update a user and return success response', async () => {
      const mockPayload: any = { firstName: 'Jane', role: 'new-role-id' };
      const mockId = 'user-id';
      const mockResponse: any = { affected: 1 };
      const mockUser = { id: "1", firstName: "jane", lastName: "deo", role: {}}
      jest.spyOn(usersService, 'updateUser').mockResolvedValue(mockResponse);

      const result = await usersController.updateUser(mockPayload, mockId, mockUser);
      expect(result).toEqual(new SuccessResponse(mockResponse));
      expect(usersService.updateUser).toHaveBeenCalledWith(mockId, mockPayload);
    });
  });

  describe('getAllUser', () => {
    it('should retrieve all users and return success response', async () => {
      const mockQuery = { page: 1, limit: 10 };
      const mockResponse: any = { items: [], meta: {} };
      const mockUser = { id: "1", firstName: "jane", lastName: "deo", role: {}}

      jest.spyOn(usersService, 'getAllUsers').mockResolvedValue(mockResponse);

      const result = await usersController.getAllUser(mockQuery, mockUser);
      expect(result).toEqual(new SuccessResponse(mockResponse));
      expect(usersService.getAllUsers).toHaveBeenCalledWith(mockQuery);
    });
  });

  describe('getUser', () => {
    it('should retrieve a user by ID and return success response', async () => {
      const mockId = 'user-id';
      const mockResponse: any = {
        id: mockId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };
      const mockUser = { id: "1", firstName: "jane", lastName: "deo", role: {}}

      jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockResponse);

      const result = await usersController.getUser(mockId, mockUser);
      expect(result).toEqual(new SuccessResponse(mockResponse));
      expect(usersService.getUserById).toHaveBeenCalledWith(mockId);
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a JWT token', async () => {
      const mockPayload = { email: 'john.doe@example.com', password: 'password123' };
      const mockResponse = { token: 'jwt-token' };
      jest.spyOn(usersService, 'loginUser').mockResolvedValue(mockResponse);

      const result = await usersController.loginUser(mockPayload);
      expect(result).toEqual(new SuccessResponse(mockResponse));
      expect(usersService.loginUser).toHaveBeenCalledWith(mockPayload);
    });
  });

  describe('changePassword', () => {
    it('should change the user password and return success response', async () => {
      const mockId = 'user-id';
      const mockPayload = { oldPassword: 'old-pass', newPassword: 'new-pass' };
      const mockResponse: any = { affected: 1 };
      const mockUser = { id: "1", firstName: "jane", lastName: "deo", role: {}}
      jest.spyOn(usersService, 'changePassword').mockResolvedValue(mockResponse);

      const result = await usersController.changePassword(mockId, mockPayload, mockUser);
      expect(result).toEqual(new SuccessResponse(mockResponse));
      expect(usersService.changePassword).toHaveBeenCalledWith(mockId, mockPayload);
    });
  });
});

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepo: jest.Mocked<Repository<Users>>;
  let roleRepo: jest.Mocked<Repository<Roles>>;

  beforeEach(() => {
    userRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      }),
    } as any;

    roleRepo = {
      findOne: jest.fn(),
    } as any;

    usersService = new UsersService(userRepo, roleRepo);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockPayload: any = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'role-id',
      };

      userRepo.findOne.mockResolvedValueOnce(null);
      roleRepo.findOne.mockResolvedValueOnce({ id: 'role-id', name: 'Admin' } as Roles);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      userRepo.create.mockReturnValue({ ...mockPayload, password: 'hashed-password' });
      userRepo.save.mockResolvedValue({ id: 'user-id', ...mockPayload });

      const result = await usersService.createUser(mockPayload);

      expect(result).toEqual({ id: 'user-id', ...mockPayload });
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: mockPayload.email } });
      expect(roleRepo.findOne).toHaveBeenCalledWith({ where: { id: mockPayload.role } });
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPayload.password, 'salt');
      expect(userRepo.create).toHaveBeenCalledWith({
        ...mockPayload,
        password: 'hashed-password',
        isDeleted: false,
        role: { id: 'role-id', name: 'Admin' },
      });
      expect(userRepo.save).toHaveBeenCalled();
    });
  });

  // Add tests for other service methods similarly.
});
