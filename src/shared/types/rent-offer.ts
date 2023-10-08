import { CityNames } from './city.type.js';
import { Goods } from './goods.enum.js';
import { HouseType } from './house-type.enum.js';
import { User } from './user.type.js';

export type RentOffer = {
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
  rooms: number;
  maxAdults: number;
  price: number;
  goods: Array<Goods>;
  createdBy: User;
  lat: number;
  lon: number;
  commentsCount?: number;
};
