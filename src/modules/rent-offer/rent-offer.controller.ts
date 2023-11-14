import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../shared/libs/rest/controller/index.js';
import { Component } from '../../shared/types/index.js';
import { RentOfferService } from './rent-offer-service.interface.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { HttpMethod } from '../../shared/libs/rest/types/index.js';
import { RentOfferEntity } from './rent-offer.eneity.js';
import { DocumentType } from '@typegoose/typegoose';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../shared/libs/rest/errors/index.js';
import { fillDTO, fillRDO } from '../../shared/helpers/index.js';
import { parseQueryAsInteger } from '../../shared/helpers/query-params.js';
import { RentOfferRdo } from './rdo/rent-offer-full.rdo.js';
import { UserRdo } from '../user/rdo/user.rdo.js';
import { RentOfferPreviewRdo } from './rdo/rent-offer-preview.rdo.js';
import { CreateRentOfferRequest } from './types/create-rent-offer-request.js';
import { UpdateOfferRequest } from './types/update-rent-offer-request.js';
import {
  DocumentExistsMiddleware,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  UploadFilesMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../shared/libs/rest/middleware/index.js';
import { CreateRentOfferDto } from './index.js';
import { UpdateRentOfferDto } from './dto/update-rent-offer.dto.js';
import { CommentRdo } from '../comment/rdo/comment.rdo.js';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  DEFAULT_OFFER_LIMIT,
  PREMIUM_OFFER_LIMIT,
  RENT_OFFER_IMAGES_COUNT,
} from './rent-offer.constants.js';
import { CommentService } from '../comment/comment.service.interface.js';
import { UserService } from '../user/user-service.interface.js';
import { GetPremiumOffersRequest } from './types/get-premium-offers-request.type.js';
import { FavoriteOfferRequest } from './types/update-favorite-offer-request.type.js';
import { GetOfferCommentsRequest } from './types/get-offer-comments-request.type.js';
import { VerifyAuthorMiddleware } from '../../shared/libs/rest/middleware/verify-author.middleware.js';
import { Config, RestSchema } from '../../shared/libs/config/index.js';
import { RentOfferImagesRdo } from './rdo/rent-offer-images.rdo.js';

@injectable()
export class RentOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.RentOfferService) private readonly rentOfferService: RentOfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.getOffers });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateRentOfferDto)],
    });
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers,
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getDetails,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'Rent-offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateRentOfferDto),
        new DocumentExistsMiddleware(this.rentOfferService, 'Rent-offer', 'offerId'),
        new VerifyAuthorMiddleware(this.rentOfferService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'Rent-offer', 'offerId'),
        new VerifyAuthorMiddleware(this.rentOfferService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Put,
      handler: this.updateFavoriteStatus,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'Rent-offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'Rent-offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/preview',
      method: HttpMethod.Post,
      handler: this.uploadPreview,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'Offer', 'offerId'),
        new VerifyAuthorMiddleware(this.rentOfferService, 'Offer', 'offerId'),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'previewImage',
          ALLOWED_IMAGE_MIME_TYPES,
        ),
      ],
    });

    this.addRoute({
      path: '/:offerId/images',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'Offer', 'offerId'),
        new VerifyAuthorMiddleware(this.rentOfferService, 'Offer', 'offerId'),
        new UploadFilesMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'images',
          ALLOWED_IMAGE_MIME_TYPES,
          RENT_OFFER_IMAGES_COUNT,
        ),
      ],
    });
  }

  private transformOffer(offer: DocumentType<RentOfferEntity>) {
    return Object.assign(offer, {
      isFavorite: false,
      rating: offer.rating ?? 0,
      id: offer._id.toHexString(),
    });
  }

  public async uploadPreview({ params: { offerId }, file }: Request, res: Response) {
    if (!file) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'No file was uploaded');
    }

    const dataToUpdate = {
      previewImage: file.filename,
    };
    await this.rentOfferService.updateById(offerId, dataToUpdate);
    this.created(res, fillDTO(RentOfferPreviewRdo, dataToUpdate));
  }

  public async uploadImages({ params: { offerId }, files }: Request, res: Response) {
    if (!Array.isArray(files)) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'No files were uploaded');
    }

    const dataToUpdate = {
      images: files.map((file) => file.filename),
    };
    await this.rentOfferService.updateById(offerId, dataToUpdate);
    this.created(res, fillDTO(RentOfferImagesRdo, dataToUpdate));
  }

  public async getOffers({ query }: Request, res: Response): Promise<void> {
    const offersCount = parseQueryAsInteger(query.limit) ?? DEFAULT_OFFER_LIMIT;
    const offers = await this.rentOfferService
      .find(offersCount)
      .then((offerDocuments) => offerDocuments.map((offer) => this.transformOffer(offer)));
    const responseData = fillDTO(RentOfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create({ body }: CreateRentOfferRequest, res: Response): Promise<void> {
    const result = await this.rentOfferService.create(body);
    this.created(res, fillDTO(RentOfferRdo, result));
  }

  public async getDetails({ params: { offerId } }: Request, res: Response): Promise<void> {
    const offer = await this.rentOfferService.findById(offerId!);
    const responseData = fillDTO(RentOfferRdo, this.transformOffer(offer!));
    responseData.author = fillDTO(UserRdo, responseData.author);
    this.ok(res, responseData);
  }

  public async update(
    { params: { offerId }, body }: UpdateOfferRequest,
    res: Response,
  ): Promise<void> {
    const result = await this.rentOfferService.updateById(offerId as string, body);
    this.ok(res, fillDTO(RentOfferRdo, result));
  }

  public async delete({ params: { offerId } }: Request, res: Response): Promise<void> {
    await this.rentOfferService.deleteById(offerId);
    this.noContent(res, null);
  }

  public async getPremiumOffers({ query }: GetPremiumOffersRequest, res: Response): Promise<void> {
    const offers = await this.rentOfferService.findPremium(
      query.city as string,
      PREMIUM_OFFER_LIMIT,
    );

    this.ok(res, fillDTO(RentOfferRdo, offers));
  }

  public async getFavorites({ tokenPayload: { id } }: Request, res: Response): Promise<void> {
    const offers = await this.userService.findUserFavoriteOffers(id);
    this.ok(res, fillDTO(RentOfferPreviewRdo, offers));
  }

  public async updateFavoriteStatus(
    { params: { offerId }, query: { isFavorite } }: FavoriteOfferRequest,
    res: Response,
  ): Promise<void> {
    if (!isFavorite || (isFavorite !== '0' && isFavorite !== '1')) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Incorrect path Error. Check your request', '');
    }
    const userId = res.locals.user.id;
    await this.userService.updateFavoriteStatus(userId, offerId as string, isFavorite === '1');
    const offer = await this.rentOfferService.findById(offerId as string, userId);

    this.ok(res, fillRDO(RentOfferRdo, offer));
  }

  public async getComments(
    { params: { offerId } }: GetOfferCommentsRequest,
    res: Response,
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(offerId as string);
    this.ok(res, fillRDO(CommentRdo, comments));
  }

  public async verifyAuthorUserId(userId: string, documentId: string): Promise<boolean> {
    const offer = await this.rentOfferService.findById(documentId);
    return offer?.authorId.toString() === userId;
  }
}
