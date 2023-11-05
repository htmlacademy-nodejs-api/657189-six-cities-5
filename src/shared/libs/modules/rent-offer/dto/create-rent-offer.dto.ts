import {
  MinLength,
  MaxLength,
  IsDateString,
  IsOptional,
  IsUrl,
  IsEnum,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsInt,
  Max,
  Min,
  ArrayUnique,
  IsLatitude,
  IsLongitude,
  IsMongoId,
} from 'class-validator';
import { CityNames, Goods, HouseType, RentOffer } from '../../../../types/index.js';
import {
  RENT_OFFER_ADULTS_COUNT,
  RENT_OFFER_BEDROOMS_COUNT,
  RENT_OFFER_DESCRIPTION_LENGTH,
  RENT_OFFER_IMAGES_COUNT,
  RENT_OFFER_MIN_GOODS_COUNT,
  RENT_OFFER_PRICE,
  RENT_OFFER_TITLE_LENGTH,
} from '../rent-offer.constants.js';

export class CreateRentOfferDto implements Omit<RentOffer, 'author' | 'commentsCount' | 'rating' | 'isFavorite'> {
  @MinLength(RENT_OFFER_TITLE_LENGTH.MIN, {
    message: `Minimum title length must be ${RENT_OFFER_TITLE_LENGTH.MIN} chars`,
  })
  @MaxLength(RENT_OFFER_TITLE_LENGTH.MAX, {
    message: `Maximum title length must be ${RENT_OFFER_TITLE_LENGTH.MAX} chars`,
  })
  public title: string;

  @MinLength(RENT_OFFER_DESCRIPTION_LENGTH.MIN, {
    message: `Minimum description length must be ${RENT_OFFER_DESCRIPTION_LENGTH.MIN} chars`,
  })
  @MaxLength(RENT_OFFER_DESCRIPTION_LENGTH.MAX, {
    message: `Maximum description length must be ${RENT_OFFER_DESCRIPTION_LENGTH.MAX} chars`,
  })
  public description: string;

  @IsOptional()
  @IsDateString({}, { message: 'offerDate must be valid ISO date' })
  public offerDate: Date;

  @IsEnum(CityNames, {
    message: `city must be only one of the following: ${Object.values(CityNames).join(', ')}`,
  })
  public city: CityNames;

  @IsUrl({}, { message: 'preview image must be a valid URL string' })
  public previewImage: string;

  @IsArray({ message: '"images" field must be an array' })
  @ArrayMinSize(RENT_OFFER_IMAGES_COUNT, {
    message: `"images" field must contain ${RENT_OFFER_IMAGES_COUNT} image files`,
  })
  @ArrayMaxSize(RENT_OFFER_IMAGES_COUNT, {
    message: `"images" field must contain ${RENT_OFFER_IMAGES_COUNT} image files`,
  })
  @IsUrl({}, { each: true, message: 'image must be a valid URL string' })
  public images: Array<string>;

  @IsBoolean({ message: '"isPremium" field must be a boolean' })
  public isPremium: boolean;

  @IsEnum(HouseType, {
    message: `offer type must be only one of the following: ${Object.values(HouseType).join(', ')}`,
  })
  public type: HouseType;

  @IsInt({ message: 'bedrooms count must be an integer value' })
  @Min(RENT_OFFER_BEDROOMS_COUNT.MIN, {
    message: `bedrooms min count is ${RENT_OFFER_BEDROOMS_COUNT.MIN}`,
  })
  @Max(RENT_OFFER_BEDROOMS_COUNT.MAX, {
    message: `bedrooms max count is ${RENT_OFFER_BEDROOMS_COUNT.MAX}`,
  })
  public bedrooms: number;

  @IsInt({ message: 'maxAdults count must be an integer value' })
  @Min(RENT_OFFER_ADULTS_COUNT.MIN, {
    message: `maxAdults min count is ${RENT_OFFER_ADULTS_COUNT.MIN}`,
  })
  @Max(RENT_OFFER_ADULTS_COUNT.MAX, {
    message: `maxAdults max count is ${RENT_OFFER_ADULTS_COUNT.MAX}`,
  })
  public maxAdults: number;

  @IsInt({ message: 'price must be an integer value' })
  @Min(RENT_OFFER_PRICE.MIN, { message: `price min count is ${RENT_OFFER_PRICE.MIN}` })
  @Max(RENT_OFFER_PRICE.MAX, { message: `price min count is ${RENT_OFFER_PRICE.MAX}` })
  public price: number;

  @IsArray({ message: 'field "goods" must be an array' })
  @IsEnum(Goods, {
    each: true,
    message: `each item in "goods" array must be one of the following: ${Object.values(Goods).join(
      ', ',
    )}`,
  })
  @ArrayUnique({ message: 'all items in "goods" array must be unique' })
  @ArrayMinSize(RENT_OFFER_MIN_GOODS_COUNT, {
    message: `field "goods" must contain ${RENT_OFFER_MIN_GOODS_COUNT} items count`,
  })
  public goods: Array<Goods>;

  @IsMongoId({message: 'authorId field must be a valid id'})
  public authorId: string;

  @IsLatitude({ message: 'latitude must have a correct lat. coordinate format' })
  public lat: number;

  @IsLongitude({ message: 'longitude must have a correct long. coordinate format' })
  public lon: number;
}
