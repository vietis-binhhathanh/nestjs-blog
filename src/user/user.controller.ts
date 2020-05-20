import { Body, Controller, Get, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDTO } from '../models/user.model';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {
  }

  /**
   * Get user logged in
   * @param username
   */
  @Get()
  @UseGuards(AuthGuard())
  findCurrentUser(@User() { username }: UserEntity) {
    return this.userService.findByUsername(username);
  }

  @Put()
  @UseGuards(AuthGuard())
  update(@User() { username }: UserEntity, @Body(new ValidationPipe({
    transform: true, whitelist: true
  })) data: UpdateUserDTO) {
    return this.userService.updateUser(username, data);
  }
}
