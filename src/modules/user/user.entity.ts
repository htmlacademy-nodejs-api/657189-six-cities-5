import { prop, defaultClasses, modelOptions, Ref } from '@typegoose/typegoose';
import { User, UserStatus } from '../../shared/types/index.js';
import { createSHA256 } from '../../shared/helpers/hash.js';
import { RentOfferEntity } from '../rent-offer/index.js';
import { USER_NAME_LENGTH } from './user.constants.js';

const EMAIL_REG_EXP = /^[^:;,\\[\]<>()\s@]+@[^\s@]+\.\w+$/;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ unique: true, required: true, match: EMAIL_REG_EXP })
  public email: string;

  @prop({ required: false, type: () => String, enum: UserStatus, default: UserStatus.Standard })
  public userStatus: UserStatus;

  @prop({ required: true, minlength: USER_NAME_LENGTH.MIN, maxlength: USER_NAME_LENGTH.MAX })
  public username: string;

  @prop({ required: false })
  public thumbnailUrl: string;

  @prop({
    required: true,
  })
  private password?: string;

  @prop({
    required: true,
    ref: () => RentOfferEntity,
    _id: false,
    default: [],
    type: () => [RentOfferEntity],
  })
  public favoriteRentOffers!: Ref<RentOfferEntity>[];

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.thumbnailUrl = userData.thumbnailUrl ?? '';
    this.username = userData.username;
    this.userStatus = userData.userStatus;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    return createSHA256(password, salt) === this.password;
  }
}
