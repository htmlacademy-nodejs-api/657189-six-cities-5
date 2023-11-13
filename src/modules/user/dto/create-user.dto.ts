import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UserStatus } from '../../../shared/types/index.js';
import { USER_NAME_LENGTH, USER_PASSWORD_LENGTH } from '../user.constants.js';

export class CreateUserDto {
  @IsEmail({}, { message: 'email must be valid' })
  public email: string;

  @IsString({ message: 'username is required' })
  @MinLength(USER_NAME_LENGTH.MIN, {
    message: `Min length for username is ${USER_NAME_LENGTH.MIN} char`,
  })
  @MaxLength(USER_NAME_LENGTH.MAX, {
    message: `Max length for username is ${USER_NAME_LENGTH.MAX} chars`,
  })
  public username: string;

  @IsString({ message: 'password is required' })
  @MinLength(USER_PASSWORD_LENGTH.MIN, {
    message: `Min length for password is ${USER_PASSWORD_LENGTH.MIN} chars`,
  })
  @MaxLength(USER_PASSWORD_LENGTH.MAX, {
    message: `Max length for password is ${USER_PASSWORD_LENGTH.MAX} chars`,
  })
  public password: string;

  @IsEnum(UserStatus, {
    message: `user status must be either ${UserStatus.Pro} or ${UserStatus.Standard}`,
  })
  public userStatus: UserStatus;
}
