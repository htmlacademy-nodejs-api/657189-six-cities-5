import { types, DocumentType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { RentOfferEntity } from './rent-offer.eneity.js';
import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { RentOfferService } from './rent-offer-service.interface.js';
import { Logger } from '../../logger/index.js';
import { Component } from '../../../types/index.js';

@injectable()
export class DefaultRentOfferService implements RentOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.RentOfferModel)
    private readonly rentOfferModel: types.ModelType<RentOfferEntity>,
  ) {}

  public async create(dto: CreateRentOfferDto): Promise<DocumentType<RentOfferEntity>> {
    const result = await this.rentOfferModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<RentOfferEntity> | null> {
    return this.rentOfferModel.findById(offerId).exec();
  }
}
