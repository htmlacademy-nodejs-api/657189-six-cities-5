import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Component } from '../../../types/index.js';
import { CommentService } from './comment.service.interface.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';

export const createCommentContainer = () => {
  const offerContainer = new Container();

  offerContainer.bind<CommentService>(Component.CommentService).to(DefaultCommentService);
  offerContainer
    .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);

  return offerContainer;
};
