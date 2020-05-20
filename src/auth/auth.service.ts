import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from '../models/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async register(credentials: RegisterDTO) {
    try {
      const user = this.userRepository.create(credentials);
      await user.save();
    } catch (error) {
      /* Check username duplicate, error code 23505 */
      if (error.code === '23505') {
        throw new ConflictException('Username already exists')
      }
      throw new InternalServerErrorException();
    }
  }

  async login({ email, password }: LoginDTO) {
    try {
      const user = await this.userRepository.findOne({where: { email }});
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
