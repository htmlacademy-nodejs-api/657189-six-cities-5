import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '../../rest/controller/index.js';
import { Component } from '../../../types/index.js';
import { Logger } from '../../logger/index.js';
import { UserService } from './index.js';
import { Config, RestSchema } from '../../config/index.js';
import { HttpMethod } from '../../rest/types/index.js';
import { HttpError } from '../../rest/errors/index.js';
import { fillDTO } from '../../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { LoginUserRequest } from './login-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.checkToken });
    this.addRoute({ path: '/logout', method: HttpMethod.Post, handler: this.logout });
  }

  public async create({ body }: CreateUserRequest, res: Response): Promise<void> {
    const isExistingUser = await this.userService.findByEmail(body.email);

    if (isExistingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with this email already exists: "${body.email}"`,
        'UserController',
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, _res: Response): Promise<void> {
    const isExistingUser = await this.userService.findByEmail(body.email);

    if (!isExistingUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User with specified credentials was not found.',
        'UserController',
      );
    }

    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  public async checkToken(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  public async logout(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }
}