import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from '../models/user.dto';

@Injectable()
export class AuthService {
  private mockUser = {
    email: 'binh.hathanh@vietis.com.vn',
    token: 'this.is.token',
    username: 'binh',
    bio: 'Something',
    image: null
  }

  register(credentials: RegisterDTO) {
    return this.mockUser;
  }

  login(credentials: LoginDTO) {
    if (credentials.email === this.mockUser.email) {
      return this.mockUser;
    }

    throw new InternalServerErrorException();
  }
}
