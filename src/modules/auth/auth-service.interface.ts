import { LoginUserDto } from '../user/dto/user-login.dto.js';
import { UserEntity } from '../user/user.entity.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
}
