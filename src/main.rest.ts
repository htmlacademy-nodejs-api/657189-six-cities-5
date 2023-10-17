// eslint-disable-next-line node/file-extension-in-import
import 'module-alias/register';
import 'reflect-metadata';

import { Container } from 'inversify';
import { Logger } from 'pino';
import { RestApplicaiton } from './rest/rest.application.js';
import { createRestAppContainer } from './rest/rest.container.js';
import { createRentOfferContainer } from './shared/libs/modules/rent-offer/rent-offer-container.js';
import { createUserContainer } from './shared/libs/modules/user/user.container.js';
import { Component } from './shared/types/component.enum.js';

const bootstrap = async () => {
  const appContainer = Container.merge(
    createRestAppContainer(),
    createUserContainer(),
    createRentOfferContainer(),
  );

  try {
    const application = appContainer.get<RestApplicaiton>(Component.RestApplication);
    await application.init();
  } catch (error) {
    const logger = appContainer.get<Logger>(Component.Logger);

    return logger.error('Failed to init application', error);
  }
};

bootstrap();