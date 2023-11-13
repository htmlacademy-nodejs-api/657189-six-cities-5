import { Request } from 'express';
import { RequestParams } from '../../../shared/libs/rest/types/index.js';

export type GetOfferCommentsRequest = Request<RequestParams, unknown, unknown, unknown>;
