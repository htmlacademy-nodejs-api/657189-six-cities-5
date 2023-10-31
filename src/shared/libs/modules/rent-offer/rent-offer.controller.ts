import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../rest/controller/index.js';
import { Component } from '../../../types/index.js';
import { RentOfferService } from './rent-offer-service.interface.js';
import { Logger } from '../../logger/index.js';
import { HttpMethod } from '../../rest/types/index.js';
import { RentOfferEntity } from './rent-offer.eneity.js';
import { DocumentType } from '@typegoose/typegoose';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../rest/errors/index.js';
import { fillDTO } from '../../../helpers/index.js';
import { parseQueryAsInteger, parseQueryAsString } from '../../../helpers/query-params.js';
import { RentOfferRDO } from './rdo/rent-offer-full.rdo.js';
import { UserRdo } from '../user/rdo/user.rdo.js';
import RentOfferBasicRDO from './rdo/rent-offer-preview.rdo.js';
import { CreateRentOfferRequest } from './create-rent-offer-request.js';
import { UpdateOfferRequest } from './update-rent-offer-request.js';

const DEFAULT_OFFER_LIMIT = 60;
const PREMIUM_OFFER_LIMIT = 3;

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.RentOfferService) private readonly offerService: RentOfferService,
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.getOffers });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremiumOffers });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getDetails });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Put,
      handler: this.addFavorite,
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
    const offers = await this.offerService
      .find(offersCount)
      .then((offerDocuments) => offerDocuments.map((offer) => this.transformOffer(offer)));
    const responseData = fillDTO(RentOfferRDO, offers);
    this.ok(res, responseData);
  }

  public async create({ body }: CreateRentOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(RentOfferRDO, result));
  }

  public async getDetails({ params }: Request, res: Response): Promise<void> {
    const offerId = parseQueryAsString(params.offerId);

    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${params.offerId} is not a valid ID`,
        'OfferController',
      );
    }

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} does not exist`,
        'OfferController',
      );
    }

    const responseData = fillDTO(RentOfferRDO, this.transformOffer(offer));
    responseData.author = fillDTO(UserRdo, responseData.author);
    this.ok(res, responseData);
  }

  public async update({ params, body }: UpdateOfferRequest, res: Response): Promise<void> {
    const offerId = parseQueryAsString(params.offerId);

    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `ID is not valid is not valid ${params.offerId}`,
        'OfferController',
      );
    }

    const existingOffer = await this.offerService.exists(offerId);

    if (!existingOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} does not exist`,
        'OfferController',
      );
    }

    const result = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDTO(RentOfferRDO, result));
  }

  public async delete({ params }: Request, res: Response): Promise<void> {
    const offerId = parseQueryAsString(params.offerId);

    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${params.offerId} is not a valid ID`,
        'OfferController',
      );
    }

    const existingOffer = await this.offerService.exists(offerId);

    if (!existingOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} does not exist`,
        'OfferController',
      );
    }

    await this.offerService.deleteById(offerId);
    this.noContent(res, null);
  }

  public async getPremiumOffers({ query }: Request, res: Response): Promise<void> {
    const city = parseQueryAsString(query.city);

    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${city} is not a valid city name`,
        'OfferController',
      );
    }

    const offers = await this.offerService
      .findPremium(city, PREMIUM_OFFER_LIMIT)
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
}
