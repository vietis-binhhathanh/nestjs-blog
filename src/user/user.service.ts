import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity)
              private userRepository: Repository<UserEntity>,
  ) {
  }

  /* using username because username is unique */

  async findByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { username } });
  }

  async updateUser(username: string, data: UpdateUserDTO) {
    await this.userRepository.update({ username }, data);
    return this.findByUsername(username);
  }

  async followUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepository.findOne({
      where: { username }, relations: ['followers'],
    });
    user.followers.push(currentUser)
    await user.save();
    return user.toProfile(currentUser);
  }

  async unfollowUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['followers']
    });
    user.followers = user.followers.filter(
      follower => follower !== currentUser,
    );
    await user.save();
    return user.toProfile(currentUser);
  }
}
