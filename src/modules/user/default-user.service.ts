import { DocumentType, types } from '@typegoose/typegoose';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UserEntity } from './user.entity.js';
import { UserService } from './user-service.interface.js';
import { inject, injectable } from 'inversify';
import { Logger } from '../../shared/libs/logger/index.js';
import { Component } from '../../shared/types/index.js';
import { RentOfferEntity } from '../rent-offer/rent-offer.eneity.js';
import { SortType } from '../../shared/types/sort.enum.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);

    user.setPassword(dto.password, salt);
    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      this.logger.info(`Existing user was found by email: ${dto.email}`);
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateFavoriteStatus(
    userId: string,
    offerId: string,
    status: boolean,
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { [`${status ? '$addToSet' : '$pull'}`]: { favoriteOffers: offerId } },
        { new: true },
      )
      .exec();
  }

  public async findUserFavoriteOffers(
    userId: string,
  ): Promise<DocumentType<RentOfferEntity>[] | null> {
    return this.userModel
      .findById(userId, { favoriteOffers: true, _id: false })
      .populate<{ favoriteOffers: DocumentType<RentOfferEntity>[] }>({
        path: 'favoriteOffers',
        options: { sort: { createdAt: SortType.Desc } },
      })
      .exec()
      .then((result) => result?.favoriteOffers ?? null);
  }

  public async updateById(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .populate(['favoriteOffers'])
      .exec();
  }
}
