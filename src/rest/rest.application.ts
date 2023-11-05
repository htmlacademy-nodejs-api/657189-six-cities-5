import { Config } from 'convict';
import { inject, injectable } from 'inversify';
import { getMongoURI } from '../shared/helpers/database.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo.database-client.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import express, { Express } from 'express';
import { Controller } from '../shared/libs/rest/controller/index.js';
import { ExceptionFilter } from '../shared/libs/rest/exception-filter/exception-filter.interface.js';

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

    this.logger.info('Init exception filters...');
    await this._initExceptionFilters();
    this.logger.info('Init exception filters complete.');

    this.logger.info('Init server...');
    await this.initServer();
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
