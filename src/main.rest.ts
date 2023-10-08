import 'reflect-metadata';
import { PinoLogger } from './shared/libs/logger/pino.logger.js';
import { RestApplicaiton } from './rest/rest.application.js';
import { RestConfig } from './shared/libs/config/rest.config.js';
import { Container } from 'inversify';
import { Component } from './shared/types/component.enum.js';
import { Logger } from './shared/libs/logger/index.js';
import { Config } from './shared/libs/config/config.interface.js';
import { RestSchema } from './shared/libs/config/rest.schema.js';

const bootstrap = async () => {
  const container = new Container();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<RestApplicaiton>(Component.RestApplication).to(RestApplicaiton).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inRequestScope();

  try {
    const application = container.get<RestApplicaiton>(Component.RestApplication);
    await application.init();
  } catch (error) {
    const logger = container.get<Logger>(Component.Logger);

    return logger.error('Failed to init application', error);
  }
};

bootstrap();
