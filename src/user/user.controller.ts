import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { AllExceptionsFilter } from '../common/filters/all-exception.filter';

@Controller('user')
@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('/viewAll')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/view/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch('/update/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('/delete/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
