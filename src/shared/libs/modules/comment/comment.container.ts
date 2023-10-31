import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Component } from '../../../types/index.js';
import { CommentService } from './comment.service.interface.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentEntity } from './comment.entity.js';
import { CommentModel } from './comment.model.js';
import { CommentController } from './comment.controller.js';
import { Controller } from '../../rest/controller/index.js';

export const createCommentContainer = () => {
  const commentContainer = new Container();

  commentContainer
    .bind<CommentService>(Component.CommentService)
    .to(DefaultCommentService)
    .inSingletonScope();
  commentContainer
    .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);
  commentContainer
    .bind<Controller>(Component.CommentController)
    .to(CommentController)
    .inSingletonScope();

  return commentContainer;
};
