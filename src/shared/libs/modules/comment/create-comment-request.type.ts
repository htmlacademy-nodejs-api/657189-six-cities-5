import { Request } from 'express';
import { RequestBody, RequestParams } from '../../rest/types/index.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';

export type CreateCommentRequest = Request<RequestParams, RequestBody, CreateCommentDTO>;
