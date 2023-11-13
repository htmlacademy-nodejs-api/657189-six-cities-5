import { Expose, Transform, Type } from 'class-transformer';
import { CITIES } from '../../../shared/constants/cities.js';
import { City, CityNames } from '../../../shared/types/city.type.js';
import { HouseType } from '../../../shared/types/index.js';

export class CityRdo implements City {
  @Expose()
  public name!: CityNames;

  @Expose()
  public lat!: number;

  @Expose()
  public lon!: number;
}

export class RentOfferPreviewRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose({ name: 'createdAt' })
  public offerDate: Date;

  @Expose()
  @Type(() => CityRdo)
  @Transform(({ value }) => CITIES[value as CityNames])
  public city: CityRdo;

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
