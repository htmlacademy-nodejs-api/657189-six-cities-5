import { prop, defaultClasses, modelOptions, Ref } from '@typegoose/typegoose';
import { CityNames, Goods, HouseType, RentOffer } from '../../../types/index.js';
import { UserEntity } from '../user/user.entity.js';

export interface RentOfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})
export class RentOfferEntity
  extends defaultClasses.TimeStamps
  implements Omit<RentOffer, 'author' | 'isFavorite'> {
  @prop({ required: true, trim: true, minlength: 10, maxlength: 100 })
  public title: string;

  @prop({ required: true, trim: true, minlength: 20, maxlength: 1024 })
  public description: string;

  @prop({ required: true })
  public offerDate: Date;

  @prop({ required: true, type: String, enum: CityNames })
  public city!: CityNames;

  @prop({ required: true })
  public previewImage: string;

  @prop({ required: true, type: String })
  public images: string[];

  @prop({ required: true, default: false })
  public isPremium: boolean;

  @prop({ required: true, min: 0, max: 5, default: 0 })
  public rating: number;

  @prop({ required: true, type: String, enum: HouseType })
  public type: HouseType;

  @prop({ required: true, min: 1, max: 8 })
  public rooms: number;

  @prop({ required: true, min: 1, max: 10 })
  public maxAdults: number;

  @prop({ required: true, min: 100, max: 100_000 })
  public price: number;

  @prop({ required: true, enum: Goods, type: String })
  public goods: Goods[];

  @prop({ required: true, ref: () => UserEntity })
  public authorId!: Ref<UserEntity>;

  @prop({ required: true })
  public lat: number;

  @prop({ required: true })
  public lon: number;

  @prop({ default: 0 })
  public commentsCount?: number;
}
