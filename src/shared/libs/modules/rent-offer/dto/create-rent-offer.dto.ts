import { CityNames, Goods, HouseType } from '../../../../types/index.js';

export class CreateRentOfferDto {
  public title: string;
  public description: string;
  public offerDate: Date;
  public city: CityNames;
  public previewImage: string;
  public images: Array<string>;
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: HouseType;
  public rooms: number;
  public maxAdults: number;
  public price: number;
  public goods: Array<Goods>;
  public authorId: string;
  public lat: number;
  public lon: number;
  public commentsCount?: number | undefined;
}
