import { HttpStatus, Injectable } from '@nestjs/common';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from 'src/common/dto';
import { BaseService } from 'src/common/service';
import { RequestQuery } from 'src/common/dto/base-service.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt'
import * as jwt from "jsonwebtoken";

import { LoginUserDTO, UpdateUserDTO, UserDTO, UserFilterDTO } from './user.dto';
import { Roles } from '../roles/role.entity';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    @InjectRepository(Roles)
    private readonly roleRepo: Repository<Roles>,
  ) {
    super();
  }

  public async createUser(payload: UserDTO) {
    const getUser = await this.userRepo.findOne({
      where: { email: payload.email },
    });

    if (getUser)
      throw new ErrorResponse(
        HttpStatus.BAD_REQUEST,
        'User already exists with this email',
      );

    const role = await this.roleRepo.findOne({ where: { id: payload.role } });
    if (!role)
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Invalid role provided');

    // Encrypting password
    const saltRounds = await bcrypt.genSalt(Number(process.env.SALT));
    const encryptPassword = await bcrypt.hash(payload.password, saltRounds);

    const user = this.userRepo.create({
      ...payload,
      password: encryptPassword,
      isDeleted: false,
      role,
    });

    const savedUser = await this.userRepo.save(user);
    return savedUser;
  }

  public async updateUser(id: string, payload: UpdateUserDTO) {
    const getUser = await this.userRepo.findOne({
      where: { id: id },
    });

    if (!getUser) throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Invalid id');

    const role = await this.roleRepo.findOne({ where: { id: payload.role } });
    if (!role)
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Invalid role provided');

    const updateResponse = await this.userRepo.update(
      { id: id },
      {
        ...payload,
        role,
      },
    );
    return updateResponse;
  }

  public async getUserById(id: string) {
    const getUser = await this.userRepo.findOne({
      where: { id: id },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'contactNumber',
        'isDeleted',
        'createdAt',
        'role',
      ],
      relations: ['role'],
    });

    if (!getUser) throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Invalid id');

    return getUser;
  }

  public async getAllUsers(query: RequestQuery<UserFilterDTO>) {
    const { filter, pagination, sort } = this.getQuery(query);
    const usersQB = this.userRepo
      .createQueryBuilder('users')
      .select('users.id', 'id')
      .addSelect('users.firstName')
      .addSelect('users.lastName')
      .addSelect('users.contactNumber')
      .addSelect('users.email')
      .addSelect('roles.name')
      .leftJoin('users.role', 'roles')

    if (filter.firstName) {
      usersQB.andWhere('users.firstName ILIKE :name', {
        firstName: `%${filter.firstName}%`,
      });
    }

    if (filter.lastName) {
      usersQB.andWhere('users.lastName ILIKE :name', {
        lastName: `%${filter.lastName}%`,
      });
    }

    if (filter.contactNumber) {
      usersQB.andWhere('users.contactNumber ILIKE :name', {
        contactNumber: `%${filter.contactNumber}%`,
      });
    }

    if (filter.email) {
      usersQB.andWhere('users.email ILIKE :name', {
        email: `%${filter.email}%`,
      });
    }

    if (filter.roleName) {
      usersQB.andWhere('roles.name ILIKE :name', {
        roleName: `%${filter.roleName}%`,
      });
    } else {
      usersQB.andWhere('roles.name IS NULL OR roles.name IS NOT NULL');
    }

    if (!Object.keys(sort).length) {
      usersQB.orderBy('users.createdAt', 'DESC');
    }
    if (sort.firstName) {
      usersQB.addOrderBy('users.firstName', sort.firstName.toUpperCase());
    }

    // return usersQB;
    return paginate(usersQB, pagination);
  }

  public async loginUser(payload: LoginUserDTO) {
    const getUser = await this.userRepo.findOne({
      where: { email: payload.email }, relations: ['role'],
    });

    if (!getUser)
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Invalid email id');

    const userPasswordCheck = await bcrypt.compare(payload.password, getUser.password);

    if (!userPasswordCheck) throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Invalid Password');

    console.log("process.env.SECRET_KEY",process.env.SECRET_KEY)
    console.log("process.env.JWT_EXPIRYIN",process.env.JWT_EXPIRYIN)
    const jwtToken = jwt.sign(
      {
        id: getUser.id,
        firstName: getUser.firstName,
        lasrName: getUser.lastName,
        role: getUser?.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRYIN }
    );

    return { token: jwtToken }
  }

  public async changePassword(id: string, payload) {
    const getUser = await this.userRepo.findOne({
      where: { id },
    });

    if (!getUser)
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Invalid user id');

    const userPasswordCheck = await bcrypt.compare(payload.oldPassword, getUser.password);
    if (!userPasswordCheck) throw new ErrorResponse(HttpStatus.BAD_REQUEST, 'Old Password Invalid');

    const saltRounds = await bcrypt.genSalt(Number(process.env.SALT));
    const encryptPassword = await bcrypt.hash(payload.newPassword, saltRounds);
    const updateResponse = await this.userRepo.update(
      { id: id },
      {
        password: encryptPassword,
      },
    );
    return updateResponse;
  }
}
