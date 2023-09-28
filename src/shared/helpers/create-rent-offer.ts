import {
  COLUMNS_SEPARATOR,
  ROW_SEPARATOR,
  MULTI_VALUES_SEPARATOR,
} from '../constants/index.js';
import {
  CityNames,
  Goods,
  HouseType,
  User,
  UserStatus,
} from '../types/index.js';
import { RentOffer } from '../types/rent-offer.js';

const RADIX = 10;

export const createRentOffer = (offerData: string): RentOffer => {
  const [
    title,
    description,
    offerDate,
    city,
    previewImage,
    images,
    isPremium,
    isFavorite,
    rating,
    type,
    rooms,
    maxAdults,
    price,
    goods,
    lat,
    lon,
    username,
    email,
    userStatus,
    thumbnailUrl,
    commentsCount,
  ] = offerData.replace(ROW_SEPARATOR, '').split(COLUMNS_SEPARATOR);

  const offerImages: string[] = images.split(MULTI_VALUES_SEPARATOR);
  const offerGoods = goods.split(MULTI_VALUES_SEPARATOR) as Goods[];
  const user: User = {
    username,
    email,
    thumbnailUrl,
    userStatus: userStatus as UserStatus,
  };
  const result: RentOffer = {
    title,
    description,
    offerDate: new Date(offerDate),
    city: city as CityNames,
    previewImage,
    images: offerImages,
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: Number.parseFloat(rating),
    type: type as HouseType,
    rooms: Number.parseInt(rooms, RADIX),
    maxAdults: Number.parseInt(maxAdults, RADIX),
    price: Number.parseInt(price, RADIX),
    goods: offerGoods,
    createdBy: user,
    lat: Number.parseFloat(lat),
    lon: Number.parseFloat(lon),
    commentsCount: Number.parseInt(commentsCount, RADIX),
  };

  return result;
};
