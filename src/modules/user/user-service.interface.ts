import { DocumentType } from '@typegoose/typegoose';

import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { RentOfferEntity } from '../rent-offer/rent-offer.eneity.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findUserFavoriteOffers(userId: string): Promise<DocumentType<RentOfferEntity>[] | null>;
  updateFavoriteStatus(userId: string, offerId: string, status: boolean): Promise<DocumentType<UserEntity> | null>;
  updateById(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<DocumentType<UserEntity> | null>;
}
