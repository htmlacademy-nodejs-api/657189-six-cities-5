import { Expose } from 'class-transformer';
import { RentOffer } from '../../../shared/types/rent-offer.js';

export class RentOfferPreviewRdo implements Pick<RentOffer, 'previewImage'> {
  @Expose()
  public previewImage: string;
}
