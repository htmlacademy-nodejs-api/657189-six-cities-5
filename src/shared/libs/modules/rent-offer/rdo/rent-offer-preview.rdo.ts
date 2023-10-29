import { Expose, Transform, Type } from 'class-transformer';
import { CITIES } from '../../../../constants/cities.js';
import { City, CityNames } from '../../../../types/city.type.js';
import { HouseType } from '../../../../types/index.js';

export class CityRDO implements City {
  @Expose()
  public name!: CityNames;

  @Expose()
  public lat!: number;

  @Expose()
  public lon!: number;
}

export default class RentOfferBasicRDO {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose({ name: 'createdAt' })
  public offerDate: Date;

  @Expose()
  @Type(() => CityRDO)
  @Transform(({ value }) => CITIES[value as CityNames])
  public city: CityRDO;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: HouseType;

  @Expose()
  public price: number;

  @Expose()
  public commentsCount: number;

  @Expose()
  public lat: number;

  @Expose()
  public lon: number;
}
