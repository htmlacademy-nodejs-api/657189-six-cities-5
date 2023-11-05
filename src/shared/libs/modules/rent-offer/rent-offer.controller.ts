import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../rest/controller/index.js';
import { CityNames, Component } from '../../../types/index.js';
import { RentOfferService } from './rent-offer-service.interface.js';
import { Logger } from '../../logger/index.js';
import { HttpMethod } from '../../rest/types/index.js';
import { RentOfferEntity } from './rent-offer.eneity.js';
import { DocumentType } from '@typegoose/typegoose';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../rest/errors/index.js';
import { fillDTO, fillRDO } from '../../../helpers/index.js';
import { parseQueryAsInteger, parseQueryAsString } from '../../../helpers/query-params.js';
import { RentOfferRDO } from './rdo/rent-offer-full.rdo.js';
import { UserRdo } from '../user/rdo/user.rdo.js';
import RentOfferBasicRDO from './rdo/rent-offer-preview.rdo.js';
import { CreateRentOfferRequest } from './create-rent-offer-request.js';
import { UpdateOfferRequest } from './update-rent-offer-request.js';
import {
  DocumentExistsMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../rest/middleware/index.js';
import { CreateRentOfferDto } from './index.js';
import { UpdateRentOfferDto } from './dto/update-rent-offer.dto.js';
import CommentRDO from '../comment/rdo/comment.rdo.js';
import { DEFAULT_OFFER_LIMIT, PREMIUM_OFFER_LIMIT } from './rent-offer.constants.js';
import { CommentService } from '../comment/comment.service.interface.js';
import { CITIES } from '../../../constants/cities.js';
import { isString } from '@typegoose/typegoose/lib/internal/utils.js';

@injectable()
export class RentOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.RentOfferService) private readonly rentOfferService: RentOfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.getOffers });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateRentOfferDto)],
    });
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers,
    });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites });
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
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.rentOfferService, 'Rent-offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Put,
      handler: this.addFavorite,
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
  }

  private transformOffer(offer: DocumentType<RentOfferEntity>) {
    return Object.assign(offer, {
      isFavorite: false,
      rating: offer.rating ?? 0,
      id: offer._id.toHexString(),
    });
  }

  public async getOffers({ query }: Request, res: Response): Promise<void> {
    const offersCount = parseQueryAsInteger(query.limit) ?? DEFAULT_OFFER_LIMIT;
    const offers = await this.rentOfferService
      .find(offersCount)
      .then((offerDocuments) => offerDocuments.map((offer) => this.transformOffer(offer)));
    const responseData = fillDTO(RentOfferRDO, offers);
    this.ok(res, responseData);
  }

  public async create({ body }: CreateRentOfferRequest, res: Response): Promise<void> {
    const result = await this.rentOfferService.create(body);
    this.created(res, fillDTO(RentOfferRDO, result));
  }

  public async getDetails({ params }: Request, res: Response): Promise<void> {
    const offerId = parseQueryAsString(params.offerId);

    const offer = await this.rentOfferService.findById(offerId!);
    const responseData = fillDTO(RentOfferRDO, this.transformOffer(offer!));
    responseData.author = fillDTO(UserRdo, responseData.author);
    this.ok(res, responseData);
  }

  public async update({ params, body }: UpdateOfferRequest, res: Response): Promise<void> {
    const offerId = parseQueryAsString(params.offerId);
    const result = await this.rentOfferService.updateById(offerId!, body);
    this.ok(res, fillDTO(RentOfferRDO, result));
  }

  public async delete({ params }: Request, res: Response): Promise<void> {
    const offerId = parseQueryAsString(params.offerId);
    await this.rentOfferService.deleteById(offerId!);
    this.noContent(res, null);
  }

  public async getPremiumOffers({ query }: Request, res: Response): Promise<void> {
    const city = parseQueryAsString(query.city);

    if (!city || (isString(city) && CITIES[city.toLowerCase() as CityNames] === undefined)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${city} is not a valid city name`,
        'OfferController',
      );
    }

    const offers = await this.rentOfferService
      .findPremium(city!, PREMIUM_OFFER_LIMIT)
      .then((offerDocuments) => offerDocuments.map((offer) => this.transformOffer(offer)));

    const responseData = fillDTO(RentOfferBasicRDO, offers);
    this.ok(res, responseData);
  }

  public async getFavorites(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'OfferController');
  }

  public async addFavorite(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'OfferController');
  }

  public async getComments(
    { params: { offerId } }: Request<ParamsOfferDetails>,
    res: Response,
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(offerId, MAX_COMMENTS_COUNT);
    this.ok(res, fillRDO(CommentRDO, comments));
  }
}
