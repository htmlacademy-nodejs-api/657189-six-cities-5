import { types, DocumentType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { RentOfferEntity } from './rent-offer.eneity.js';
import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { RentOfferService } from './rent-offer-service.interface.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { Component } from '../../shared/types/index.js';
import { UpdateRentOfferDto } from './dto/update-rent-offer.dto.js';
import { SortType } from '../../shared/types/sort.enum.js';

const DEFAULT_OFFER_LIMIT = 20;

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

  public async findById(
    offerId: string,
    userId?: string,
  ): Promise<DocumentType<RentOfferEntity> | null> {
    return this.rentOfferModel
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: offerId }],
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            let: { userId: { $toObjectId: userId } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
              { $project: { _id: 0, favorites: 1 } },
            ],
            as: 'users',
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ['$users', 0] },
          },
        },
        {
          $unset: ['users'],
        },
      ])
      .exec()
      .then(([result]) => result ?? null);
  }

  public async deleteById(offerId: string): Promise<types.DocumentType<RentOfferEntity> | null> {
    return this.rentOfferModel.findByIdAndDelete(offerId).exec();
  }

  public async exists(offerId: string): Promise<boolean> {
    const offer = await this.rentOfferModel.exists({ _id: offerId });

    return offer !== null;
  }

  public async find(limit = DEFAULT_OFFER_LIMIT): Promise<types.DocumentType<RentOfferEntity>[]> {
    return this.rentOfferModel
      .aggregate<DocumentType<RentOfferEntity>>([
        {
          $lookup: {
            from: 'users',
            pipeline: [{ $project: { _id: false, favoriteRentOffers: true } }],
            as: 'author',
          },
        },
        { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            isFavorite: {
              $cond: [
                {
                  $and: [
                    { $ne: [{ $type: '$author.favoriteRentOffers' }, 'missing'] },
                    { $in: ['$_id', '$author.favoriteRentOffers'] },
                  ],
                },
                true,
                false,
              ],
            },
            id: { $toString: '$_id' },
          },
        },
        { $unset: 'author' },
        { $sort: { createdAt: SortType.Desc } },
        { $limit: limit },
      ])
      .exec();
  }

  public async findFavorite(
    userId: string,
    limit = DEFAULT_OFFER_LIMIT,
  ): Promise<types.DocumentType<RentOfferEntity>[]> {
    return this.rentOfferModel
      .aggregate<DocumentType<RentOfferEntity>>([
        {
          $lookup: {
            from: 'users',
            pipeline: [
              { $match: { $expr: { $eq: [userId, { $toString: '$_id' }] } } },
              { $project: { _id: false, favoriteRentOffers: true } },
            ],
            as: 'author',
          },
        },
        { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
        { $match: { $expr: { $in: ['$_id', '$author.favoriteRentOffers'] } } },
        { $addFields: { isFavorite: true, id: { $toString: '$_id' } } },
        { $unset: 'author' },
        { $sort: { createdAt: SortType.Desc } },
        { $limit: limit },
      ])
      .exec();
  }

  public async findMostRated(
    limit = DEFAULT_OFFER_LIMIT,
  ): Promise<types.DocumentType<RentOfferEntity>[]> {
    return this.rentOfferModel
      .aggregate<DocumentType<RentOfferEntity>>([
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            isFavorite: {
              $cond: [
                {
                  $and: [
                    { $ne: [{ $type: '$author.favoriteRentOffers' }, 'missing'] },
                    { $in: ['$_id', '$author.favoriteRentOffers'] },
                  ],
                },
                true,
                false,
              ],
            },
            id: { $toString: '$_id' },
          },
        },
        { $unset: 'author' },
        { $sort: { createdAt: SortType.Desc } },
        { $limit: limit },
      ])
      .exec();
  }

  public async findPremium(
    city?: string,
    limit = DEFAULT_OFFER_LIMIT,
  ): Promise<types.DocumentType<RentOfferEntity>[]> {
    return this.rentOfferModel
      .aggregate<DocumentType<RentOfferEntity>>([
        {
          $match: {
            $and: [{ $expr: { $eq: ['$city', city] } }, { $expr: { $eq: ['$isPremium', true] } }],
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            isFavorite: {
              $cond: [
                {
                  $and: [
                    { $ne: [{ $type: '$author.favoriteRentOffers' }, 'missing'] },
                    { $in: ['$_id', '$author.favoriteRentOffers'] },
                  ],
                },
                true,
                false,
              ],
            },
            id: { $toString: '$_id' },
          },
        },
        { $unset: 'author' },
        { $sort: { createdAt: SortType.Desc } },
        { $limit: limit },
      ])
      .exec();
  }

  public async incCommentCount(
    offerId: string,
  ): Promise<types.DocumentType<RentOfferEntity> | null> {
    return this.rentOfferModel.findByIdAndUpdate(offerId, { $inc: { commentsCount: 1 } }).exec();
  }

  public async calculateRating(
    offerId: string,
  ): Promise<types.DocumentType<RentOfferEntity> | null> {
    const result = await this.rentOfferModel
      .aggregate([
        { $match: { $expr: { $eq: [offerId, { $toString: '$_id' }] } } },
        {
          $lookup: {
            from: 'comments',
            let: { commentsCount: '$commentsCount' },
            pipeline: [
              { $match: { $expr: { $eq: [offerId, { $toString: '$offerId' }] } } },
              { $group: { _id: null, rating: { $sum: '$rating' } } },
              { $project: { _id: false, rating: { $divide: ['$rating', '$$commentsCount'] } } },
            ],
            as: 'commentsRatings',
          },
        },
        { $unwind: { path: '$commentsRatings' } },
        { $project: { _id: false, commentsRatings: true } },
      ])
      .exec()
      .then((res) => res[0].commentsRatings.rating);
    const newRating: number = result.toFixed(1);

    return this.rentOfferModel.findByIdAndUpdate(offerId, { $set: { rating: newRating } });
  }

  public async updateById(
    offerId: string,
    dto: UpdateRentOfferDto,
  ): Promise<DocumentType<RentOfferEntity> | null> {
    const result = await this.rentOfferModel
      .findByIdAndUpdate(offerId, dto, { new: true, returnDocument: 'after' })
      .exec();

    return result;
  }

  public async verifyAuthorUserId(userId: string, documentId: string): Promise<boolean> {
    const offer = await this.rentOfferModel.findById(documentId);
    return offer?.authorId.toString() === userId;
  }
}
