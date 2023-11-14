import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { User, UserStatus } from '../../../shared/types/index.js';
import { USER_NAME_LENGTH } from '../user.constants.js';

export class UpdateUserDto implements Partial<User> {
  @IsOptional()
  @IsEmail({}, { message: 'email must be valid' })
  public email?: string;

  @IsOptional()
  @IsString({ message: 'username is required' })
  @MinLength(USER_NAME_LENGTH.MIN, {
    message: `Min length for username is ${USER_NAME_LENGTH.MIN} char`,
  })
  @MaxLength(USER_NAME_LENGTH.MAX, {
    message: `Max length for username is ${USER_NAME_LENGTH.MAX} chars`,
  })
  public username?: string;

  @IsOptional()
  @IsEnum(UserStatus, {
    message: `user status must be either ${UserStatus.Pro} or ${UserStatus.Standard}`,
  })
  public userStatus?: UserStatus;

  @IsOptional()
  @IsUrl({}, { message: 'preview image must be a valid URL string' })
  public thumbnailUrl?: string;
}
