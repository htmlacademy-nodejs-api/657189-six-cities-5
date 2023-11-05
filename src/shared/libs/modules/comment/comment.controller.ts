import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../../logger/index.js';
import { BaseController } from '../../rest/controller/index.js';
import { Component } from '../../../types/index.js';
import { Config, RestSchema } from '../../config/index.js';
import { CommentService } from './comment.service.interface.js';
import { RentOfferService } from '../rent-offer/rent-offer-service.interface.js';
import { HttpMethod } from '../../rest/types/http-method.enum.js';
import { HttpError } from '../../rest/errors/http-error.js';
import { fillRDO } from '../../../helpers/common.js';
import { CreateCommentRequest } from './create-comment-request.type.js';
import { ValidateDtoMiddleware } from '../../rest/middleware/index.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentRdo } from './rdo/comment.rdo.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.RentOfferService) private readonly offerService: RentOfferService,
    @inject(Component.Config) protected readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
  }

  public async create(
    { body: commentData }: CreateCommentRequest,
    res: Response,
  ): Promise<void> {
    if (!(await this.offerService.exists(commentData.rentOfferId))) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Offer with such id ${commentData.rentOfferId} not exists.`,
        'CommentController',
      );
    }

    const author = res.locals.user;

    const comment = await this.commentService.create({ ...commentData, authorId: author.id });
    await this.offerService.incCommentCount(commentData.rentOfferId);
    await this.offerService.calculateRating(commentData.rentOfferId);
    this.created(res, fillRDO(CommentRdo, comment));
  }
}
