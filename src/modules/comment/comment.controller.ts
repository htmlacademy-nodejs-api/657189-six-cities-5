import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { Logger } from '../../shared/libs/logger/index.js';
import { BaseController } from '../../shared/libs/rest/controller/index.js';
import { Component } from '../../shared/types/index.js';
import { Config, RestSchema } from '../../shared/libs/config/index.js';
import { CommentService } from './comment.service.interface.js';
import { RentOfferService } from '../rent-offer/rent-offer-service.interface.js';
import { HttpMethod } from '../../shared/libs/rest/types/http-method.enum.js';
import { fillDTO } from '../../shared/helpers/common.js';
import { CreateCommentRequest } from './create-comment-request.type.js';
import { DocumentExistsMiddleware, PrivateRouteMiddleware, ValidateDtoMiddleware } from '../../shared/libs/rest/middleware/index.js';
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
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async create(
    { body, tokenPayload }: CreateCommentRequest,
    res: Response
  ): Promise<void> {
    const comment = await this.commentService.create({
      ...body,
      authorId: tokenPayload.id
    });
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
