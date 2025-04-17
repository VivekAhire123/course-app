import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { ResponseMessages } from '../common/response-messages';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(data: CreateUserDto) {
    try {
      const { email, password, name, role } = data;

      const isDataExists = await this.databaseService.user.findUnique({
        where: { email },
      });

      if (isDataExists) {
        return new ResponseError(
          { name: 'badRequest' },
          ResponseMessages.user.user_already_exists,
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.databaseService.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role || 'STUDENT',
        },
      });

      const { password: _, ...userWithoutPassword } = user;

      return new ResponseSuccess(
        userWithoutPassword,
        ResponseMessages.user.user_created,
      );
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async getAllUsers() {
    try {
      const users = await this.databaseService.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new ResponseSuccess(users, ResponseMessages.user.user_fetched);
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.user.user_not_found,
        );
      }

      return new ResponseSuccess(
        user,
        ResponseMessages.user.user_fetched_by_id,
      );
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id },
      });

      if (!user) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.user.user_not_found,
        );
      }

      const updateData: any = {
        email: updateUserDto.email,
        name: updateUserDto.name,
      };

      if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      if (updateUserDto.role) {
        updateData.role = updateUserDto.role;
      }

      const updatedUser = await this.databaseService.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new ResponseSuccess(
        updatedUser,
        ResponseMessages.user.user_updated,
      );
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id },
      });

      if (!user) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.user.user_not_found,
        );
      }

      await this.databaseService.user.delete({ where: { id } });

      return new ResponseSuccess(null, ResponseMessages.user.user_deleted);
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }
}
