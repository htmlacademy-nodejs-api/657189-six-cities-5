import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';


import { RentOfferService } from './rent-offer-service.interface.js';
import { DefaultRentOfferService } from './default-rent-offer.service.js';
import { RentOfferEntity, RentOfferModel } from './rent-offer.eneity.js';
import { Component } from '../../../types/index.js';

export const createRentOfferContainer = () => {
  const offerContainer = new Container();

  offerContainer.bind<RentOfferService>(Component.RentOfferService).to(DefaultRentOfferService);
  offerContainer
    .bind<types.ModelType<RentOfferEntity>>(Component.RentOfferModel)
    .toConstantValue(RentOfferModel);

  return offerContainer;
};
