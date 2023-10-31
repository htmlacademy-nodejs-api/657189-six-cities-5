import { Expose } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { CityNames, Goods, HouseType, RentOffer } from '../../../../types/index.js';

export class RentOfferRDO implements RentOffer {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public offerDate: Date;

  @Expose()
  public city: CityNames;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public rooms: number;

  @Expose()
  public maxAdults: number;

  @Expose()
  public price: number;

  @Expose()
  public commentsCount: number;

  @Expose()
  public author: UserRdo;

  @Expose()
  public lat: number;

  @Expose()
  public lon: number;

  @Expose()
  public type: HouseType;

  @Expose()
  public goods: Goods[];
}
