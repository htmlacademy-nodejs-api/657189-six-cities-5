import { DocumentType } from '@typegoose/typegoose';

import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { RentOfferEntity } from '../rent-offer/rent-offer.eneity.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findUserFavoriteOffers(userId: string): Promise<DocumentType<RentOfferEntity>[] | null>;
  addOfferToFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  removeOfferFromFavorite(userId: string, offerId: string): Promise<void>;
}
