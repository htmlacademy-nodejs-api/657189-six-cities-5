import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../shared/libs/rest/types/index.js';
import { FavoriteOfferDto } from '../dto/favorite-rent-offer.dto.js';

export type FavoriteOfferRequest = Request<RequestParams, RequestBody, FavoriteOfferDto>;
