import { Container } from 'inversify';

import { RestApplicaiton } from './rest.application.js';
import { Component } from '../shared/types/index.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { RestConfig, RestSchema, Config } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { BaseExceptionFilter } from '../shared/libs/rest/exception-filter/base-exception-filter.interface.js';
import { ExceptionFilter } from '../shared/libs/rest/exception-filter/exception-filter.interface.js';
import { PathTransformer } from '../shared/libs/rest/transform/path-transformer.js';

export const createRestAppContainer = () => {
  const container = new Container();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<RestApplicaiton>(Component.RestApplication).to(RestApplicaiton).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container
    .bind<DatabaseClient>(Component.DatabaseClient)
    .to(MongoDatabaseClient)
    .inSingletonScope();
  container
    .bind<ExceptionFilter>(Component.ExceptionFilter)
    .to(BaseExceptionFilter)
    .inSingletonScope();
  container.bind<PathTransformer>(Component.PathTransformer).to(PathTransformer).inSingletonScope();

  return container;
};
