import { CityNames } from './city.type.js';
import { Goods } from './goods.type.js';
import { HouseType } from './house-type.type.js';
import { User } from './user.type.js';

export type HousingOffer = {
  title: string;
  description: string;
  offerDate: Date;
  city: CityNames;
  previewImage: string;
  images: Array<string>;
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HouseType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Array<Goods>;
  createdBy: User;
  lat: number;
  lon: number;
  commentsCount?: number;
};
