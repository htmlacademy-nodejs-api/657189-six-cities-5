import { CityNames, Goods, HouseType, RentOffer } from '../../../../types/index.js';

export class UpdateRentOfferDto implements Partial<Omit<RentOffer, 'author' | 'rating' | 'commentsCount' | 'isFavorite'>> {
  public title?: string;
  public description?: string;
  public offerDate?: Date;
  public city?: CityNames;
  public previewImage?: string;
  public images?: Array<string>;
  public isPremium?: boolean;
  public type?: HouseType;
  public rooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: Array<Goods>;
  public authorId?: string;
  public lat?: number;
  public lon?: number;
}
