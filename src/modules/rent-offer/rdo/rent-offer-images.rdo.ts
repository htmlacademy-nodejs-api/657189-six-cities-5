import { Expose } from 'class-transformer';
import { RentOffer } from '../../../shared/types/index.js';

export class RentOfferImagesRdo implements Pick<RentOffer, 'images'> {
  @Expose()
  public images: string[];
}
