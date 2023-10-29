import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { UserService } from './user-service.interface.js';
import { DefaultUserService } from './default-user.service.js';
import { UserEntity } from './user.entity.js';
import { Component } from '../../../types/index.js';
import { UserModel } from './user.model.js';
import { Controller } from '../../rest/controller/index.js';
import { UserController } from './user.controller.js';

export const createUserContainer = () => {
  const userContainer = new Container();

  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  return userContainer;
};
