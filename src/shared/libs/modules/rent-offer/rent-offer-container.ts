import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { RentOfferService } from './rent-offer-service.interface.js';
import { DefaultRentOfferService } from './default-rent-offer.service.js';
import { RentOfferEntity } from './rent-offer.eneity.js';
import { Component } from '../../../types/index.js';
import { RentOfferModel } from './rent-offer.model.js';
import { RentOfferController } from './rent-offer.controller.js';
import { Controller } from '../../rest/controller/index.js';

export const createRentOfferContainer = () => {
  const offerContainer = new Container();

  offerContainer
    .bind<RentOfferService>(Component.RentOfferService)
    .to(DefaultRentOfferService)
    .inSingletonScope();
  offerContainer
    .bind<types.ModelType<RentOfferEntity>>(Component.RentOfferModel)
    .toConstantValue(RentOfferModel);
  offerContainer
    .bind<Controller>(Component.RentOfferController)
    .to(RentOfferController)
    .inSingletonScope();

  return offerContainer;
};
