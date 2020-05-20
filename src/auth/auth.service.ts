import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async register(credentials: RegisterDTO) {
    try {
      const user = this.userRepository.create(credentials);
      await user.save();
      const payload = { username: user.username };
      // const token = this.jwtService.sign(payload);
      const token = '123456789';

      return { user: { ...user.toJSON(), token } };
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
      const payload = { username: user.username };
      // const token = this.jwtService.sign(payload);
      const token = '123456789';

      return { user: { ...user.toJSON(), token } };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
