import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { HttpError } from '../errors/index.js';
import { Middleware } from './middleware.interface.js';
import { VerifyAuthorService } from '../types/index.js';

export class VerifyAuthorMiddleware implements Middleware {
  constructor(
    private readonly service: VerifyAuthorService,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute(
    { params, tokenPayload }: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const idToVerify = params[this.paramName];

    if (!(await this.service.verifyAuthorUserId(tokenPayload.id, idToVerify))) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `No rights for ${this.entityName} with id ${idToVerify}.`,
        'ValidateAuthorMiddleware',
      );
    }

    next();
  }
}
