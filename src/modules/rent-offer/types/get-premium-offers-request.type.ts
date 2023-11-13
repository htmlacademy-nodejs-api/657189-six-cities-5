import { Request } from 'express';
import { Query } from 'express-serve-static-core';

export type GetPremiumOffersRequest = Request<
  unknown,
  unknown,
  unknown,
  | {
      city: string;
    }
  | Query
>;
