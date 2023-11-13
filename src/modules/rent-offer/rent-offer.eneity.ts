import { prop, defaultClasses, modelOptions, Ref } from '@typegoose/typegoose';
import { CityNames, Goods, HouseType, RentOffer } from '../../shared/types/index.js';
import { UserEntity } from '../user/user.entity.js';
import {
  RENT_OFFER_ADULTS_COUNT,
  RENT_OFFER_BEDROOMS_COUNT,
  RENT_OFFER_DESCRIPTION_LENGTH,
  RENT_OFFER_PRICE,
  RENT_OFFER_RATING,
  RENT_OFFER_TITLE_LENGTH,
} from './rent-offer.constants.js';

export interface RentOfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'rent-offers',
    timestamps: true,
  },
})
export class RentOfferEntity extends defaultClasses.TimeStamps implements Omit<RentOffer, 'author' | 'isFavorite'> {
  @prop({
    required: true,
    trim: true,
    minlength: RENT_OFFER_TITLE_LENGTH.MIN,
    maxlength: RENT_OFFER_TITLE_LENGTH.MAX,
  })
  public title: string;

  @prop({
    required: true,
    trim: true,
    minlength: RENT_OFFER_DESCRIPTION_LENGTH.MIN,
    maxlength: RENT_OFFER_DESCRIPTION_LENGTH.MAX,
  })
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

  @prop({ required: true, min: RENT_OFFER_RATING.MIN, max: RENT_OFFER_RATING.MAX, default: 0 })
  public rating: number;

  @prop({ required: true, type: String, enum: HouseType })
  public type: HouseType;

  @prop({ required: true, min: RENT_OFFER_BEDROOMS_COUNT.MIN, max: RENT_OFFER_BEDROOMS_COUNT.MAX })
  public bedrooms: number;

  @prop({ required: true, min: RENT_OFFER_ADULTS_COUNT.MIN, max: RENT_OFFER_ADULTS_COUNT.MAX })
  public maxAdults: number;

  @prop({ required: true, min: RENT_OFFER_PRICE.MIN, max: RENT_OFFER_PRICE.MAX })
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
