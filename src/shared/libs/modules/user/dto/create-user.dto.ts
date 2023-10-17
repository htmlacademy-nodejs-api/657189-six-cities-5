import { UserStatus } from '../../../../types/index.js';

export class CreateUserDto {
  public email: string;
  public thumbnailUrl: string;
  public username: string;
  public password: string;
  public userStatus: UserStatus;
}
