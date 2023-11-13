import 'reflect-metadata';

import { Container } from 'inversify';
import { Logger } from 'pino';
import { RestApplicaiton } from './rest/rest.application.js';
import { createRestAppContainer } from './rest/rest.container.js';
import { createRentOfferContainer } from './modules/rent-offer/rent-offer-container.js';
import { Component } from './shared/types/component.enum.js';
import { createUserContainer } from './modules/user/user.container.js';
import { createCommentContainer } from './modules/comment/comment.container.js';
import { createAuthContainer } from './modules/auth/auth.container.js';

const bootstrap = async () => {
  const appContainer = Container.merge(
    createRestAppContainer(),
    createRentOfferContainer(),
    createCommentContainer(),
    createUserContainer(),
    createAuthContainer(),
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
