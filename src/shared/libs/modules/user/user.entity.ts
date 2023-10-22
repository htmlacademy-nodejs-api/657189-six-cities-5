import { prop, getModelForClass, defaultClasses, modelOptions, Ref } from '@typegoose/typegoose';
import { User, UserStatus } from '../../../types/index.js';
import { createSHA256 } from '../../../helpers/hash.js';
import { RentOfferEntity } from '../rent-offer/rent-offer.eneity.js';

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

  @prop({ required: true, minlength: 1, maxlength: 15 })
  public username: string;

  @prop({ required: false, default: '' })
  public thumbnailUrl: string;

  @prop({ required: true, minlength: 6, maxlength: 12 })
  private password?: string;

  @prop({
    required: true,
    ref: () => RentOfferEntity,
    _id: false,
    default: [],
    type: () => [RentOfferEntity],
  })
  public favoriteRentOffers: Ref<RentOfferEntity>[];

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

export const UserModel = getModelForClass(UserEntity);
