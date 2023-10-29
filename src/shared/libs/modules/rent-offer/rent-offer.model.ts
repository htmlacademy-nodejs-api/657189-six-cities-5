import { getModelForClass } from '@typegoose/typegoose';
import { RentOfferEntity } from './rent-offer.eneity.js';

export const RentOfferModel = getModelForClass(RentOfferEntity);
