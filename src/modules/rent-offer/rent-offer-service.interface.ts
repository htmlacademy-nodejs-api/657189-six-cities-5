import { DocumentType, types } from '@typegoose/typegoose';

import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { RentOfferEntity } from './rent-offer.eneity.js';
import { UpdateRentOfferDto } from './dto/update-rent-offer.dto.js';
import { VerifyAuthorService } from '../../shared/libs/rest/types/verify-author-service.interface.js';

export interface RentOfferService extends VerifyAuthorService {
  create(dto: CreateRentOfferDto): Promise<DocumentType<RentOfferEntity>>;
  find(count: number): Promise<DocumentType<RentOfferEntity>[]>;
  findById(offerId: string, userId?: string): Promise<DocumentType<RentOfferEntity> | null>;
  findPremium(city?: string, limit?: number): Promise<types.DocumentType<RentOfferEntity>[]>;
  findFavorite(userId: string, limit?: number): Promise<types.DocumentType<RentOfferEntity>[]>;
  findMostRated(limit?: number): Promise<types.DocumentType<RentOfferEntity>[]>;
  deleteById(offerId: string): Promise<types.DocumentType<RentOfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateRentOfferDto,
  ): Promise<DocumentType<RentOfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<RentOfferEntity> | null>;
  calculateRating(offerId: string): Promise<DocumentType<RentOfferEntity> | null>;
  exists(offerId: string): Promise<boolean>;
}
