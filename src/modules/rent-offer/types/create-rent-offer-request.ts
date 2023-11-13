import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../shared/libs/rest/types/index.js';
import { CreateRentOfferDto } from '../index.js';

export type CreateRentOfferRequest = Request<RequestParams, RequestBody, CreateRentOfferDto>;
