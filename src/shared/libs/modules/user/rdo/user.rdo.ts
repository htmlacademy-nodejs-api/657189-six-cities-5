import { Expose } from 'class-transformer';
import { User, UserStatus } from '../../../../types/user.type.js';

export class UserRdo implements User {
  @Expose()
  public email: string ;

  @Expose()
  public thumbnailUrl: string;

  @Expose()
  public username: string;

  @Expose()
  public userStatus: UserStatus;
}
