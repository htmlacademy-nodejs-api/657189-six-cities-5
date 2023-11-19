import { types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { Logger } from '../../shared/libs/logger/index.js';
import { Component } from '../../shared/types/index.js';
import { CommentEntity } from './comment.entity.js';
import { CommentService } from './comment.service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { SortType } from '../../shared/types/sort.enum.js';
import { MAX_COMMENTS_COUNT } from './comment.constants.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  async create(dto: CreateCommentDto): Promise<types.DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);

    this.logger.info(`New comment was created: ${result.text}`);

    return result.populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    this.logger.info(`Removed all the comments from offer with id: ${offerId}`);

    return result.deletedCount;
  }

  public async findByOfferId(offerId: string): Promise<types.DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.Desc })
      .limit(MAX_COMMENTS_COUNT)
      .populate('userId');
  }
}
