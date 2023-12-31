import { Config } from 'convict';
import { inject, injectable } from 'inversify';
import cors from 'cors';
import { getMongoURI } from '../shared/helpers/database.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo.database-client.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import express, { Express } from 'express';
import { Controller } from '../shared/libs/rest/controller/index.js';
import { ExceptionFilter } from '../shared/libs/rest/exception-filter/exception-filter.interface.js';
import { AuthExceptionFilter } from '../modules/auth/auth.exception-filter.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/middleware/parse-token.middleware.js';
import { STATIC_UPLOAD_ROUTE, STATIC_FILES_ROUTE } from './rest.constant.js';
import { getFullServerPath } from '../shared/helpers/index.js';

@injectable()
export class RestApplicaiton {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: MongoDatabaseClient,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.RentOfferController) private readonly offerController: Controller,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.ExceptionFilter) private readonly baseExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter)
    private readonly authExceptionFilter: AuthExceptionFilter,
  ) {
    this.server = express();
  }

  private async initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initControllers() {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/comments', this.commentController.router);
  }

  private async initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initExceptionFilters() {
    this.server.use(this.baseExceptionFilter.catch.bind(this.baseExceptionFilter));
    this.server.use(this.authExceptionFilter.catch.bind(this.baseExceptionFilter));
  }

  private async _initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));

    this.server.use(express.json());
    this.server.use(STATIC_UPLOAD_ROUTE, express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.server.use(STATIC_FILES_ROUTE, express.static(this.config.get('STATIC_DIRECTORY')));
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());
  }

  public async init() {
    this.logger.info('Application initialized');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this.initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init controllers...');
    await this._initControllers();
    this.logger.info('Init controller complete.');

    this.logger.info('Init app-level middleware');
    await this._initMiddleware();
    this.logger.info('App-level middleware init completed');

    this.logger.info('Init exception filters...');
    await this._initExceptionFilters();
    this.logger.info('Init exception filters complete.');

    this.logger.info('Init server...');
    await this.initServer();
    this.logger.info(
      `Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`,
    );
  }
}
