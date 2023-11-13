import { Container } from 'inversify';
import { DefaultAuthService } from './default-auth.service.js';
import { AuthService } from './auth-service.interface.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';
import { Component } from '../../shared/types/index.js';
import { ExceptionFilter } from '../../shared/libs/rest/exception-filter/exception-filter.interface.js';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
  authContainer
    .bind<ExceptionFilter>(Component.AuthExceptionFilter)
    .to(AuthExceptionFilter)
    .inSingletonScope();

  return authContainer;
}
