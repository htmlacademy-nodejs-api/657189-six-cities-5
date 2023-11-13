import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../shared/libs/rest/types/index.js';
import { UpdateRentOfferDto } from '../dto/update-rent-offer.dto.js';

export type UpdateOfferRequest = Request<RequestParams, RequestBody, UpdateRentOfferDto>;
